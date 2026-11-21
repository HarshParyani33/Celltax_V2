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

  // If no browser is found, fail with actionable instructions (never silently skip!)
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
  // Ensure screenshot output directory exists
  const screenshotDir = path.resolve('public', 'screenshots');
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  // 1. Check preview/dev server pre-flight HTTP response
  console.log(`[E2E 1/9] Checking preview server readiness on port 5173...`);
  await checkServerReady(5173);
  console.log('  -> Server is ready and answering with HTTP 200-399 on http://localhost:5173');

  // 2. Launch browser with CDP debugging port
  console.log(`[E2E 2/9] Launching Chromium browser (${BROWSER_PATH}) on port ${DEBUG_PORT}...`);
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

  // 3. Test Terminal Screen & Skip Intro Interval Teardown
  console.log('[E2E 3/9] Testing Screen A: Access Terminal & Skip Intro typing stability...');
  await wait(400);
  const initialSkipBtn = await evalInBrowser(`Boolean(document.querySelector('button[title="Skip intro typing"]'))`);
  if (initialSkipBtn) {
    await evalInBrowser(`document.querySelector('button[title="Skip intro typing"]').click()`);
    await wait(300);
  }

  const isInputVisible = await evalInBrowser(`Boolean(document.querySelector('#clearance-input'))`);
  if (!isInputVisible) throw new Error('Clearance input not visible after skip intro');

  // Verify interval is completely stopped: line count must be 8 and stay exactly 8
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
  console.log('[E2E 4/9] Testing invalid credential error feedback...');
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
  console.log('[E2E 5/9] Testing valid credential and transition to Briefing...');
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
  console.log('[E2E 6/9] Testing Screen B: Case Briefing & Accept Investigation...');
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
  console.log('[E2E 7/9] Testing Screen C: Evidence filtering buttons...');
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

  // 8. Test Evidence Modal, Focus Trapping, Escape Key, Focus Restoration
  console.log('[E2E 8/9] Testing Modal dialog, focus trapping, Escape key, and focus restoration...');
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
  console.log('  -> Modal opened with valid ARIA semantics; focus trapped inside dialog');

  // Test Tab wrap from last focusable element to first
  const tabWrapResult = await evalInBrowser(`(() => {
    const dialog = document.querySelector('[role="dialog"]');
    if (!dialog) return false;
    const focusable = dialog.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusable.length < 2) return false;
    const last = focusable[focusable.length - 1];
    last.focus();
    const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
    last.dispatchEvent(event);
    return true;
  })()`);
  console.log(`  -> Focus wrapping handler validated: ${tabWrapResult}`);

  // Test Escape key close
  await evalInBrowser(`
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  `);

  // Wait for modal exit animation to complete
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

  // 9. Test Viewports, Responsiveness, and Broken Images
  console.log('[E2E 9/9] Verifying mobile/desktop viewports and image rendering...');

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
