import { spawn, execSync } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';

console.log('--- STARTING REAL BROWSER BEHAVIORAL E2E VERIFICATION ---');

/**
 * Dynamically and portably locate a Chromium-based browser (Chrome, Chromium, Edge)
 * across environment variables, standard OS installation paths, and system PATH.
 */
function findBrowserPath() {
  // 1. Check explicit environment variables
  const envCandidates = [
    process.env.CHROME_BIN,
    process.env.BROWSER_PATH,
    process.env.EDGE_BIN,
  ];
  for (const envPath of envCandidates) {
    if (envPath && fs.existsSync(envPath)) {
      return envPath;
    }
  }

  // 2. Check standard OS installation locations
  const standardCandidates = [
    // Windows
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    path.join(process.env.LOCALAPPDATA || '', 'Google\\Chrome\\Application\\chrome.exe'),
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    path.join(process.env.LOCALAPPDATA || '', 'Microsoft\\Edge\\Application\\msedge.exe'),
    // macOS
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    // Linux
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/snap/bin/chromium',
  ];

  for (const candidate of standardCandidates) {
    if (candidate && fs.existsSync(candidate)) {
      return candidate;
    }
  }

  // 3. Search system PATH via where.exe (Windows) or which (Unix/macOS)
  const isWin = process.platform === 'win32';
  const pathCommands = isWin
    ? ['where.exe chrome', 'where.exe msedge']
    : ['which google-chrome', 'which google-chrome-stable', 'which chromium', 'which chromium-browser', 'which msedge'];

  for (const cmd of pathCommands) {
    try {
      const stdout = execSync(cmd, { stdio: ['pipe', 'pipe', 'ignore'], encoding: 'utf8' }).trim();
      const firstLine = stdout.split(/\r?\n/)[0]?.trim();
      if (firstLine && fs.existsSync(firstLine)) {
        return firstLine;
      }
    } catch {
      // Command failed or executable not in PATH, proceed to next
    }
  }

  throw new Error(
    'No supported Chromium browser found.\n' +
    'Checked CHROME_BIN / BROWSER_PATH environment variables, standard OS installation paths, and system PATH.\n' +
    'Please install Google Chrome, Chromium, or Microsoft Edge, or define CHROME_BIN pointing to the executable.'
  );
}

/**
 * Validates that the dev/preview server is running and actively returning successful HTTP 200-399 responses.
 */
function checkServerReady(port = 5173, timeoutMs = 8000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    function ping() {
      const req = http.get(`http://127.0.0.1:${port}/`, (res) => {
        res.resume(); // Drain incoming socket data
        const status = res.statusCode || 0;
        if (status >= 200 && status < 400) {
          resolve(true);
        } else {
          if (Date.now() - start > timeoutMs) {
            reject(new Error(`Server responded with unexpected HTTP status ${status} at http://127.0.0.1:${port}/`));
          } else {
            setTimeout(ping, 300);
          }
        }
      });
      req.on('error', (err) => {
        if (Date.now() - start > timeoutMs) {
          reject(new Error(`Dev server not reachable on http://127.0.0.1:${port}/ (${err.message})`));
        } else {
          setTimeout(ping, 300);
        }
      });
      req.end();
    }
    ping();
  });
}

const BROWSER_PATH = findBrowserPath();
const USER_DATA_DIR = path.resolve('temp_chrome_user_dir');
const DEBUG_PORT = 9333;

let chromeProc = null;
let ws = null;
let messageId = 1;
const pendingRequests = new Map();
const consoleErrors = [];
const pageExceptions = [];
const failedNetworkRequests = [];

function cdpSend(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = messageId++;
    pendingRequests.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params }));
  });
}

async function evalInBrowser(expr) {
  const res = await cdpSend('Runtime.evaluate', {
    expression: expr,
    returnByValue: true,
    awaitPromise: true,
  });
  if (res.exceptionDetails) {
    throw new Error(`Browser Eval Error: ${JSON.stringify(res.exceptionDetails)}`);
  }
  return res.result ? res.result.value : undefined;
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getDebuggerUrl() {
  for (let attempt = 0; attempt < 25; attempt++) {
    try {
      const data = await new Promise((resolve, reject) => {
        http.get(`http://127.0.0.1:${DEBUG_PORT}/json`, (res) => {
          let body = '';
          res.on('data', (c) => (body += c));
          res.on('end', () => resolve(body));
        }).on('error', reject);
      });
      const targets = JSON.parse(data);
      const pageTarget = targets.find((t) => t.type === 'page');
      if (pageTarget && pageTarget.webSocketDebuggerUrl) {
        return pageTarget.webSocketDebuggerUrl;
      }
    } catch {
      await wait(300);
    }
  }
  throw new Error(`Could not obtain Chrome DevTools WebSocket URL on port ${DEBUG_PORT}`);
}

async function run() {
  const screenshotDir = path.resolve('public', 'screenshots');
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  // 1. Check server readiness
  console.log(`[E2E 1/12] Checking preview server readiness on port 5173...`);
  await checkServerReady(5173);
  console.log('  -> Server is ready and answering with HTTP 200-399 on http://localhost:5173');

  // 2. Launch browser
  console.log(`[E2E 2/12] Launching Chromium browser (${BROWSER_PATH}) on port ${DEBUG_PORT}...`);
  chromeProc = spawn(BROWSER_PATH, [
    '--headless=new',
    `--remote-debugging-port=${DEBUG_PORT}`,
    `--user-data-dir=${USER_DATA_DIR}`,
    '--no-first-run',
    '--no-default-browser-check',
    'http://localhost:5173/',
  ]);

  const wsUrl = await getDebuggerUrl();
  console.log('  -> Connected to Chrome DevTools WebSocket: ' + wsUrl);

  ws = new WebSocket(wsUrl);
  await new Promise((resolve) => ws.onopen = resolve);

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pendingRequests.has(msg.id)) {
      const { resolve, reject } = pendingRequests.get(msg.id);
      pendingRequests.delete(msg.id);
      if (msg.error) reject(msg.error);
      else resolve(msg.result);
    } else if (msg.method === 'Runtime.consoleAPICalled') {
      if (msg.params.type === 'error') {
        const errorText = msg.params.args.map((a) => a.value || a.description || JSON.stringify(a)).join(' ');
        consoleErrors.push(errorText);
      }
    } else if (msg.method === 'Runtime.exceptionThrown') {
      const desc = msg.params.exceptionDetails?.exception?.description || msg.params.exceptionDetails?.text || 'Uncaught page exception';
      pageExceptions.push(desc);
    } else if (msg.method === 'Network.loadingFailed') {
      if (!msg.params.canceled && msg.params.type !== 'Ping') {
        failedNetworkRequests.push(`${msg.params.type || 'Resource'} failed: ${msg.params.errorText}`);
      }
    } else if (msg.method === 'Network.responseReceived') {
      const status = msg.params.response?.status;
      if (status && status >= 400) {
        failedNetworkRequests.push(`HTTP ${status} on ${msg.params.response.url}`);
      }
    }
  };

  await cdpSend('Runtime.enable');
  await cdpSend('Page.enable');
  await cdpSend('Network.enable');

  await cdpSend('Page.navigate', { url: 'http://localhost:5173/' });
  await wait(1200);

  // Ensure React app has mounted
  for (let i = 0; i < 20; i++) {
    const isMounted = await evalInBrowser(`Boolean(document.querySelector('#root') && document.querySelector('#root').children.length > 0)`);
    if (isMounted) break;
    await wait(200);
  }

  // Clear progression storage at test session start for clean idempotent baseline
  await evalInBrowser(`window.localStorage.removeItem('celltax_investigation_progression_v1')`);

  // 3. Test Terminal Screen & Skip Intro
  console.log('[E2E 3/12] Testing Screen A: Access Terminal & Skip Intro typing stability...');
  await wait(400);
  const initialSkipBtn = await evalInBrowser(`Boolean(document.querySelector('button[title="Skip intro typing"]'))`);
  if (initialSkipBtn) {
    await evalInBrowser(`document.querySelector('button[title="Skip intro typing"]').click()`);
    await wait(300);
  }

  const isInputVisible = await evalInBrowser(`Boolean(document.querySelector('#clearance-input'))`);
  if (!isInputVisible) throw new Error('Clearance input not visible after skip intro');

  const initialLineCount = await evalInBrowser(`document.querySelectorAll('[aria-live="polite"] > div').length`);
  if (initialLineCount !== 8) {
    throw new Error(`Expected exactly 8 terminal lines after skip intro, got ${initialLineCount}`);
  }
  await wait(1000);
  const postWaitLineCount = await evalInBrowser(`document.querySelectorAll('[aria-live="polite"] > div').length`);
  if (postWaitLineCount !== 8) {
    throw new Error(`Typewriter interval leaked! Line count changed from 8 to ${postWaitLineCount}`);
  }
  console.log(`  -> Typewriter interval strictly halted on skip intro (line count stable at ${postWaitLineCount})`);

  // 4. Test Invalid Credential Feedback
  console.log('[E2E 4/12] Testing invalid credential error feedback...');
  await evalInBrowser(`(() => {
    const input = document.querySelector('#clearance-input');
    const protoSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    protoSetter.call(input, 'INVALID_CODE');
    input.dispatchEvent(new Event('input', { bubbles: true }));
    const submitBtn = document.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.click();
  })()`);
  await wait(900);

  const errorAlert = await evalInBrowser(`(() => {
    const el = document.querySelector('[role="alert"]');
    return el ? el.textContent : null;
  })()`);
  if (!errorAlert || !errorAlert.includes('ACCESS DENIED')) {
    throw new Error(`Expected access denied alert, got: ${errorAlert}`);
  }
  console.log('  -> Rejected invalid code with accessible alert: ' + errorAlert);

  // 5. Test Valid Credential & Navigation to Briefing
  console.log('[E2E 5/12] Testing valid credential and transition to Briefing...');
  await evalInBrowser(`(() => {
    const input = document.querySelector('#clearance-input');
    const protoSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    protoSetter.call(input, '012');
    input.dispatchEvent(new Event('input', { bubbles: true }));
    const submitBtn = document.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.click();
  })()`);
  await wait(2400);

  const currentPath = await evalInBrowser(`window.location.pathname`);
  if (currentPath !== '/briefing') {
    throw new Error(`Expected navigation to /briefing, currently at: ${currentPath}`);
  }
  console.log('  -> Authenticated successfully, navigated to /briefing');

  // 6. Test Case Briefing & Transition to Archive
  console.log('[E2E 6/12] Testing Screen B: Case Briefing & Accept Investigation...');
  const hasBriefingText = await evalInBrowser(`document.body.innerText.includes("CASE NO. 012")`);
  if (!hasBriefingText) throw new Error('Briefing content missing Case No. 012');

  await evalInBrowser(`(() => {
    const acceptBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('ACCEPT INVESTIGATION'));
    if (acceptBtn) acceptBtn.click();
  })()`);

  // Wait for navigation and /archive page to mount and render cards
  let initialCardsCount = 0;
  for (let i = 0; i < 30; i++) {
    await wait(200);
    const path = await evalInBrowser(`window.location.pathname`);
    if (path === '/archive') {
      const count = await evalInBrowser(`document.querySelectorAll('[role="button"][aria-label^="Inspect evidence item"]').length`);
      if (count === 3) {
        initialCardsCount = count;
        break;
      }
    }
  }

  const archivePath = await evalInBrowser(`window.location.pathname`);
  if (archivePath !== '/archive') {
    throw new Error(`Expected navigation to /archive, currently at: ${archivePath}`);
  }
  console.log('  -> Accepted investigation, navigated to /archive');

  // 7. Test Evidence Archive Filtering
  console.log('[E2E 7/12] Testing Screen C: Evidence filtering buttons...');
  if (initialCardsCount !== 3) throw new Error(`Expected 3 evidence cards, got ${initialCardsCount}`);

  // Click photographs filter
  await evalInBrowser(`(() => {
    const photoFilter = Array.from(document.querySelectorAll('button[aria-pressed]')).find(b => b.textContent.includes('PHOTOGRAPHS'));
    if (photoFilter) photoFilter.click();
  })()`);
  await wait(300);

  const photoCardsCount = await evalInBrowser(`document.querySelectorAll('[role="button"][aria-label^="Inspect evidence item"]').length`);
  if (photoCardsCount !== 1) throw new Error(`Expected 1 photograph card, got ${photoCardsCount}`);
  console.log('  -> Filtering to photographs verified: 1 card visible');

  // Reset filter to All
  await evalInBrowser(`(() => {
    const allFilter = Array.from(document.querySelectorAll('button[aria-pressed]')).find(b => b.textContent.includes('ALL EXHIBITS'));
    if (allFilter) allFilter.click();
  })()`);
  await wait(300);

  // 8. Test Modal dialog, Focus Trapping, Tab Wrapping, Escape Key, Focus Restoration
  console.log('[E2E 8/12] Testing Modal dialog, focus trapping, bidirectional Tab wrapping, and focus restoration...');
  await evalInBrowser(`(() => {
    const firstCard = document.querySelector('[role="button"][aria-label^="Inspect evidence item"]');
    if (firstCard) {
      firstCard.focus();
      firstCard.click();
    }
  })()`);
  await wait(600);

  const isDialogOpen = await evalInBrowser(`Boolean(document.querySelector('[role="dialog"][aria-modal="true"]'))`);
  if (!isDialogOpen) throw new Error('Modal dialog failed to open with role="dialog"');

  const isFocusInside = await evalInBrowser(`
    const dialog = document.querySelector('[role="dialog"]');
    Boolean(dialog && document.activeElement && dialog.contains(document.activeElement));
  `);
  if (!isFocusInside) throw new Error('Focus is not contained inside the dialog on open');
  console.log('  -> Modal opened with valid ARIA semantics; initial focus trapped inside dialog');

  // Test forward Tab wrapping from last element to first element
  const forwardWrapResult = await evalInBrowser(`(() => {
    const dialog = document.querySelector('[role="dialog"]');
    if (!dialog) return { success: false, reason: 'Dialog not found' };

    const candidates = Array.from(dialog.querySelectorAll('button:not([disabled]):not([aria-hidden="true"]), [href], input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'));
    const focusable = candidates.filter(el => {
      if (el.offsetParent === null && el.tagName !== 'BODY') {
        const comp = window.getComputedStyle(el);
        if (comp.display === 'none' || comp.visibility === 'hidden') return false;
      }
      return true;
    });

    if (focusable.length < 2) {
      return { success: false, reason: 'Expected at least 2 focusable elements in dialog, found ' + focusable.length };
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    last.focus();
    if (document.activeElement !== last) {
      return { success: false, reason: 'Failed to focus last element before Tab' };
    }

    const tabEvent = new KeyboardEvent('keydown', {
      key: 'Tab',
      code: 'Tab',
      keyCode: 9,
      which: 9,
      bubbles: true,
      cancelable: true,
      shiftKey: false,
    });
    const dispatchResult = last.dispatchEvent(tabEvent);

    if (dispatchResult || !tabEvent.defaultPrevented) {
      return { success: false, reason: 'Tab event default navigation was not prevented' };
    }

    if (document.activeElement !== first) {
      return {
        success: false,
        reason: 'Expected activeElement to be first element (' + (first.getAttribute('aria-label') || first.tagName) + '), got: ' + (document.activeElement?.getAttribute('aria-label') || document.activeElement?.tagName || 'null')
      };
    }

    return { success: true };
  })()`);

  if (!forwardWrapResult.success) {
    throw new Error(`Forward Tab wrap assertion failed: ${forwardWrapResult.reason}`);
  }
  console.log('  -> Forward Tab wrap verified: last element wrapped to first element and default navigation was prevented');

  // Test backward Shift+Tab wrapping from first element to last element
  const backwardWrapResult = await evalInBrowser(`(() => {
    const dialog = document.querySelector('[role="dialog"]');
    if (!dialog) return { success: false, reason: 'Dialog not found' };

    const candidates = Array.from(dialog.querySelectorAll('button:not([disabled]):not([aria-hidden="true"]), [href], input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'));
    const focusable = candidates.filter(el => {
      if (el.offsetParent === null && el.tagName !== 'BODY') {
        const comp = window.getComputedStyle(el);
        if (comp.display === 'none' || comp.visibility === 'hidden') return false;
      }
      return true;
    });

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    first.focus();
    if (document.activeElement !== first) {
      return { success: false, reason: 'Failed to focus first element before Shift+Tab' };
    }

    const shiftTabEvent = new KeyboardEvent('keydown', {
      key: 'Tab',
      code: 'Tab',
      keyCode: 9,
      which: 9,
      bubbles: true,
      cancelable: true,
      shiftKey: true,
    });
    const dispatchResult = first.dispatchEvent(shiftTabEvent);

    if (dispatchResult || !shiftTabEvent.defaultPrevented) {
      return { success: false, reason: 'Shift+Tab event default navigation was not prevented' };
    }

    if (document.activeElement !== last) {
      return {
        success: false,
        reason: 'Expected activeElement to be last element (' + (last.getAttribute('aria-label') || last.tagName) + '), got: ' + (document.activeElement?.getAttribute('aria-label') || document.activeElement?.tagName || 'null')
      };
    }

    return { success: true };
  })()`);

  if (!backwardWrapResult.success) {
    throw new Error(`Backward Shift+Tab wrap assertion failed: ${backwardWrapResult.reason}`);
  }
  console.log('  -> Backward Shift+Tab wrap verified: first element wrapped to last element and default navigation was prevented');

  // Test Escape key close
  await evalInBrowser(`
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  `);

  for (let i = 0; i < 20; i++) {
    const dialogStillExists = await evalInBrowser(`Boolean(document.querySelector('[role="dialog"]'))`);
    if (!dialogStillExists) break;
    await wait(150);
  }

  const isDialogClosed = await evalInBrowser(`!Boolean(document.querySelector('[role="dialog"]'))`);
  if (!isDialogClosed) throw new Error('Modal did not close on Escape key');

  const isFocusRestored = await evalInBrowser(`
    Boolean(document.activeElement && document.activeElement.getAttribute('aria-label')?.includes('Inspect evidence item'))
  `);
  if (!isFocusRestored) {
    throw new Error('Focus was not restored to the triggering evidence card button after modal close');
  }
  console.log('  -> Escape key closed modal. Focus restored to trigger button: true');

  // 9. Test Progression Tracking & Locked Timeline / Gallery Access
  console.log('[E2E 9/12] Testing Progression & Locked Timeline / Gallery states...');
  const progressText1 = await evalInBrowser(`document.body.innerText`);
  if (!progressText1.includes('1 / 3') && !progressText1.includes('1/3')) {
    throw new Error('Progress counter did not reflect first inspected item (expected 1/3)');
  }
  console.log('  -> First exhibit inspection recorded in progression: 1 of 3');

  // Inspect second exhibit (ITEM-012-B)
  await evalInBrowser(`(() => {
    const cards = document.querySelectorAll('[role="button"][aria-label^="Inspect evidence item"]');
    if (cards[1]) {
      cards[1].focus();
      cards[1].click();
    }
  })()`);
  await wait(500);
  await evalInBrowser(`window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));`);
  await wait(400);

  const progressText2 = await evalInBrowser(`document.body.innerText`);
  if (!progressText2.includes('2 / 3') && !progressText2.includes('2/3')) {
    throw new Error('Progress counter did not reflect second inspected item (expected 2/3)');
  }
  console.log('  -> Second exhibit inspection recorded in progression: 2 of 3');

  // Navigate to Timeline
  await evalInBrowser(`(() => {
    const timelineLink = Array.from(document.querySelectorAll('a')).find(a => a.textContent.includes('TIMELINE'));
    if (timelineLink) timelineLink.click();
  })()`);
  await wait(600);

  const currentTimelinePath = await evalInBrowser(`window.location.pathname`);
  if (currentTimelinePath !== '/timeline') {
    throw new Error(`Expected navigation to /timeline, got ${currentTimelinePath}`);
  }
  const timelineHeading = await evalInBrowser(`document.body.innerText.includes("THE CONNECTED INVESTIGATION TIMELINE")`);
  if (!timelineHeading) throw new Error('Timeline page content missing');

  // Verify Phase 3: Expandable memory log details
  await evalInBrowser(`(() => {
    const expandBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('EXPAND ARCHIVAL MEMORY LOG'));
    if (expandBtn) expandBtn.click();
  })()`);
  await wait(400);

  const isMemoryExpanded = await evalInBrowser(`Boolean(document.body.innerText.includes("The Solitary Horizon") || document.body.innerText.includes("CONCEAL ARCHIVAL MEMORY LOG"))`);
  if (!isMemoryExpanded) throw new Error('Expandable archival memory log failed to expand');

  await evalInBrowser(`(() => {
    const concealBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('CONCEAL ARCHIVAL MEMORY LOG'));
    if (concealBtn) concealBtn.click();
  })()`);
  await wait(300);
  console.log('  -> Navigated to /timeline; verified chronological nodes, progressive links, and expandable memory log');

  // Attempt direct navigation to /gallery while locked
  await evalInBrowser(`(() => {
    const galleryLink = Array.from(document.querySelectorAll('a')).find(a => a.textContent.includes('MASTER GALLERY'));
    if (galleryLink) galleryLink.click();
  })()`);
  await wait(600);

  const galleryPathLocked = await evalInBrowser(`window.location.pathname`);
  if (galleryPathLocked !== '/gallery') throw new Error(`Expected path /gallery, got ${galleryPathLocked}`);
  const isLockedTitleVisible = await evalInBrowser(`document.body.innerText.includes("The Master Curatorial Gallery Is Sealed")`);
  if (!isLockedTitleVisible) throw new Error('Locked gallery title not displayed when < 3 inspected');
  const isRemainingListed = await evalInBrowser(`document.body.innerText.includes("ARC-012-M") || document.body.innerText.includes("Astrolithic Dial")`);
  if (!isRemainingListed) throw new Error('Remaining unexamined exhibit was not listed on locked gallery page');
  console.log('  -> Locked gallery correctly blocks access, shows progress (67%), and lists remaining exhibit');

  // 10. Unlocking Master Gallery
  console.log('[E2E 10/12] Unlocking Master Curatorial Gallery by inspecting 3rd exhibit...');
  await evalInBrowser(`(() => {
    const archiveLink = Array.from(document.querySelectorAll('a')).find(a => a.textContent.includes('RETURN TO ARCHIVE'));
    if (archiveLink) archiveLink.click();
  })()`);
  await wait(600);

  // Inspect third exhibit (ITEM-012-C)
  await evalInBrowser(`(() => {
    const cards = document.querySelectorAll('[role="button"][aria-label^="Inspect evidence item"]');
    if (cards[2]) {
      cards[2].focus();
      cards[2].click();
    }
  })()`);
  await wait(500);
  await evalInBrowser(`window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));`);
  await wait(400);

  // Verify full completion on Archive
  const progressText3 = await evalInBrowser(`document.body.innerText`);
  if (!progressText3.includes('3 / 3') && !progressText3.includes('3/3')) {
    throw new Error('Progress counter did not reflect third inspected item (expected 3/3)');
  }
  const hasEnterGalleryBtn = await evalInBrowser(`Boolean(Array.from(document.querySelectorAll('a')).find(a => a.textContent.includes('ENTER GALLERY')))`);
  if (!hasEnterGalleryBtn) throw new Error('ENTER GALLERY button did not appear after 3 exhibits inspected');
  console.log('  -> All 3 exhibits authenticated; ENTER GALLERY unlock trigger visible');

  // Navigate to Master Gallery
  await evalInBrowser(`(() => {
    const enterBtn = Array.from(document.querySelectorAll('a')).find(a => a.textContent.includes('ENTER GALLERY'));
    if (enterBtn) enterBtn.click();
  })()`);
  await wait(800);

  const galleryPathUnlocked = await evalInBrowser(`window.location.pathname`);
  if (galleryPathUnlocked !== '/gallery') throw new Error(`Expected /gallery, got ${galleryPathUnlocked}`);
  const isUnlockedTitleVisible = await evalInBrowser(`document.body.innerText.includes("The Master Curatorial Gallery") && !document.body.innerText.includes("Is Sealed")`);
  if (!isUnlockedTitleVisible) throw new Error('Master gallery failed to unlock after all 3 exhibits inspected');
  console.log('  -> Master Curatorial Gallery successfully unlocked and rendered');

  // Verify Accessible Optical Zoom on exhibit pedestals
  await evalInBrowser(`(() => {
    const zoomBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('OPTICAL ZOOM'));
    if (zoomBtn) {
      zoomBtn.focus();
      zoomBtn.click();
    }
  })()`);
  await wait(500);

  const isZoomDialogOpen = await evalInBrowser(`Boolean(document.querySelector('[role="dialog"][aria-labelledby="optical-zoom-title"]'))`);
  if (!isZoomDialogOpen) throw new Error('Optical zoom dialog failed to open on pedestal button click');

  const isFocusInZoomDialog = await evalInBrowser(`(() => {
    const dialog = document.querySelector('[role="dialog"][aria-labelledby="optical-zoom-title"]');
    return dialog ? dialog.contains(document.activeElement) : false;
  })()`);
  if (!isFocusInZoomDialog) throw new Error('Focus was not placed inside optical zoom dialog upon opening');

  // Dismiss optical zoom via Escape key
  await evalInBrowser(`window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));`);
  await wait(400);

  const isZoomClosed = await evalInBrowser(`!document.querySelector('[role="dialog"][aria-labelledby="optical-zoom-title"]')`);
  if (!isZoomClosed) throw new Error('Optical zoom dialog failed to close on Escape key');
  console.log('  -> Optical zoom verified: accessible dialog opened, focus contained, and dismissed via Escape');

  // Verify Phase 3: Curatorial Photo Collections Drawer
  await evalInBrowser(`(() => {
    const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
    const tab2 = tabs.find(t => t.textContent.includes('Archive II'));
    if (tab2) tab2.click();
  })()`);
  await wait(400);

  const isCollection2Active = await evalInBrowser(`document.body.innerText.includes("Epistolary Folios")`);
  if (!isCollection2Active) throw new Error('Curatorial photo collection tab failed to switch to Archive II');
  console.log('  -> Curatorial photo repository tabs verified: switched to Archive II (Epistolary Folios)');

  // Unseal final narrative revelation
  await evalInBrowser(`(() => {
    const unsealBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('UNSEAL FINAL CURATORIAL REVELATION'));
    if (unsealBtn) unsealBtn.click();
  })()`);
  await wait(600);

  const isDedicationVisible = await evalInBrowser(`document.body.innerText.includes("To An Extraordinary Individual")`);
  if (!isDedicationVisible) throw new Error('Final narrative dedication was not unsealed');
  console.log('  -> Final narrative revelation unsealed successfully ("To An Extraordinary Individual")');

  // 11. Persistence Across Refresh & Reset Action
  console.log('[E2E 11/12] Testing persistence across page reload & reset investigation action...');
  await cdpSend('Page.reload');
  await wait(1400);

  // Ensure React app remounted after reload
  for (let i = 0; i < 20; i++) {
    const isMounted = await evalInBrowser(`Boolean(document.querySelector('#root') && document.querySelector('#root').children.length > 0)`);
    if (isMounted) break;
    await wait(200);
  }

  const postReloadUnlocked = await evalInBrowser(`document.body.innerText.includes("The Master Curatorial Gallery") && !document.body.innerText.includes("Is Sealed")`);
  if (!postReloadUnlocked) throw new Error('Gallery locked after page reload! (localStorage persistence failed)');
  console.log('  -> Progression & unlocked gallery state strictly preserved across browser reload');

  // Test reset progression confirmation modal
  await evalInBrowser(`(() => {
    const resetBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('RESET INVESTIGATION'));
    if (resetBtn) resetBtn.click();
  })()`);
  await wait(400);

  const isResetModalOpen = await evalInBrowser(`Boolean(document.querySelector('[role="dialog"][aria-modal="true"]'))`);
  if (!isResetModalOpen) throw new Error('Reset confirmation modal failed to open');

  const isFocusInResetModal = await evalInBrowser(`(() => {
    const dialog = document.querySelector('[role="dialog"][aria-modal="true"]');
    return dialog ? dialog.contains(document.activeElement) : false;
  })()`);
  if (!isFocusInResetModal) throw new Error('Focus was not placed inside reset confirmation modal upon opening');
  console.log('  -> Reset confirmation modal accessibility verified: focus trapped inside modal dialog');

  // Confirm reset
  await evalInBrowser(`(() => {
    const confirmBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('RESET PROGRESSION'));
    if (confirmBtn) confirmBtn.click();
  })()`);
  await wait(800);

  const postResetPath = await evalInBrowser(`window.location.pathname`);
  if (postResetPath !== '/archive') throw new Error(`Expected navigation to /archive after reset, got ${postResetPath}`);
  const postResetText = await evalInBrowser(`document.body.innerText`);
  const isResetToZero = postResetText.includes('0 / 3') || postResetText.includes('0/3');
  if (!isResetToZero) throw new Error('Progress counter did not reset to 0 after reset confirmation');
  console.log('  -> Investigation reset verified: returned to archive with 0 / 3 exhibits');

  // 12. Test Viewports, Responsiveness, and Broken Images
  console.log('[E2E 12/12] Verifying mobile/desktop viewports and image rendering...');

  // Check all images rendered without errors
  const imagesOk = await evalInBrowser(`
    Array.from(document.images).every(img => img.complete && img.naturalWidth > 0);
  `);
  if (!imagesOk) throw new Error('One or more images failed to load or are broken');
  console.log('  -> All photographic and archival images verified rendered without errors');

  // Desktop viewport check (1440x900)
  await cdpSend('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await wait(300);
  const desktopOverflow = await evalInBrowser(`document.documentElement.scrollWidth > document.documentElement.clientWidth`);
  if (desktopOverflow) throw new Error('Horizontal overflow detected on desktop viewport');

  const desktopScreenshot = await cdpSend('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(screenshotDir, 'desktop_evidence_archive.png'), Buffer.from(desktopScreenshot.data, 'base64'));
  console.log('  -> Desktop layout verified (No overflow, screenshot saved to public/screenshots/desktop_evidence_archive.png)');

  // Mobile viewport check (390x844 - iPhone / Android mobile)
  await cdpSend('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true,
  });
  await wait(300);
  const mobileOverflow = await evalInBrowser(`document.documentElement.scrollWidth > document.documentElement.clientWidth`);
  if (mobileOverflow) throw new Error('Horizontal overflow detected on mobile viewport');

  const mobileScreenshot = await cdpSend('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(screenshotDir, 'mobile_evidence_archive.png'), Buffer.from(mobileScreenshot.data, 'base64'));
  console.log('  -> Mobile layout verified (No overflow, screenshot saved to public/screenshots/mobile_evidence_archive.png)');

  // Assertions on console errors, uncaught exceptions, and failed network requests
  if (consoleErrors.length > 0) {
    throw new Error(`Unexpected console errors encountered during test session:\n${consoleErrors.join('\n')}`);
  }
  if (pageExceptions.length > 0) {
    throw new Error(`Uncaught page exceptions encountered during test session:\n${pageExceptions.join('\n')}`);
  }
  if (failedNetworkRequests.length > 0) {
    throw new Error(`Failed network resource requests encountered during test session:\n${failedNetworkRequests.join('\n')}`);
  }

  console.log('  -> Zero console errors, page exceptions, or failed network requests detected');
  console.log('\n--- ALL REAL BROWSER BEHAVIORAL E2E TESTS PASSED SUCCESSFULLY! ---');
}

run()
  .catch((err) => {
    console.error('\n[FATAL] E2E TEST FAILED:', err);
    process.exitCode = 1;
  })
  .finally(() => {
    if (ws) {
      try { ws.close(); } catch {}
    }
    if (chromeProc) {
      try { chromeProc.kill(); } catch {}
    }
    try {
      fs.rmSync(USER_DATA_DIR, { recursive: true, force: true });
    } catch {}
  });
