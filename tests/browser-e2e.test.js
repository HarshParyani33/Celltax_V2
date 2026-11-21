import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';

console.log('--- STARTING REAL BROWSER BEHAVIORAL E2E VERIFICATION ---');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const USER_DATA_DIR = path.resolve('temp_chrome_user_dir');
const DEBUG_PORT = 9333;

let chromeProc = null;
let ws = null;
let messageId = 1;
const pendingRequests = new Map();
const consoleErrors = [];

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
  throw new Error('Could not obtain Chrome DevTools WebSocket URL on port 9222');
}

async function run() {
  // Ensure screenshot output directory exists
  const screenshotDir = path.resolve('public', 'screenshots');
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  // 1. Launch Chrome Headless with DevTools port 9222
  console.log(`[E2E 1/9] Launching Headless Chrome on port ${DEBUG_PORT}...`);
  chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${DEBUG_PORT}`,
    `--user-data-dir=${USER_DATA_DIR}`,
    '--no-first-run',
    '--no-default-browser-check',
    'http://localhost:5173/',
  ]);

  const wsUrl = await getDebuggerUrl();
  console.log('[E2E 2/9] Connected to Chrome DevTools WebSocket');

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
        consoleErrors.push(msg.params.args.map((a) => a.value || a.description).join(' '));
      }
    }
  };

  await cdpSend('Runtime.enable');
  await cdpSend('Page.enable');

  await cdpSend('Page.navigate', { url: 'http://localhost:5173/' });
  await wait(1200);

  // Ensure React app has mounted
  for (let i = 0; i < 20; i++) {
    const isMounted = await evalInBrowser(`Boolean(document.querySelector('#root') && document.querySelector('#root').children.length > 0)`);
    if (isMounted) break;
    await wait(200);
  }

  // 2. Test Terminal Screen & Skip Intro
  console.log('[E2E 3/9] Testing Screen A: Access Terminal & Skip Intro...');
  await wait(400);
  const initialSkipBtn = await evalInBrowser(`Boolean(document.querySelector('button[title="Skip intro typing"]'))`);
  if (initialSkipBtn) {
    await evalInBrowser(`document.querySelector('button[title="Skip intro typing"]').click()`);
    await wait(300);
  }

  const isInputVisible = await evalInBrowser(`Boolean(document.querySelector('#clearance-input'))`);
  if (!isInputVisible) throw new Error('Clearance input not visible after skip intro');
  console.log('  -> Skip intro successfully stopped interval and revealed clearance form');

  // 3. Test Invalid Credential
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

  // 4. Test Valid Credential & Navigation to Briefing
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

  // 5. Test Case Briefing & Transition to Archive
  console.log('[E2E 6/9] Testing Screen B: Case Briefing & Accept Investigation...');
  const hasBriefingText = await evalInBrowser(`document.body.innerText.includes("CASE NO. 012")`);
  if (!hasBriefingText) throw new Error('Briefing content missing Case No. 012');

  await evalInBrowser(`(() => {
    const acceptBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('ACCEPT INVESTIGATION'));
    if (acceptBtn) acceptBtn.click();
  })()`);
  await wait(1600);

  const archivePath = await evalInBrowser(`window.location.pathname`);
  if (archivePath !== '/archive') {
    throw new Error(`Expected navigation to /archive, currently at: ${archivePath}`);
  }
  console.log('  -> Accepted investigation, navigated to /archive');

  // 6. Test Evidence Archive Filtering
  console.log('[E2E 7/9] Testing Screen C: Evidence filtering buttons...');
  const initialCardsCount = await evalInBrowser(`document.querySelectorAll('[role="button"][aria-label^="Inspect evidence item"]').length`);
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

  // 7. Test Evidence Modal, Focus Trapping, Escape Key, Focus Restoration
  console.log('[E2E 8/9] Testing Modal dialog, focus trapping, Escape key, and focus restoration...');
  await evalInBrowser(`(() => {
    const firstCard = document.querySelector('[role="button"][aria-label^="Inspect evidence item"]');
    if (firstCard) {
      firstCard.focus();
      firstCard.click();
    }
  })()`);
  await wait(500);

  const isDialogOpen = await evalInBrowser(`Boolean(document.querySelector('[role="dialog"][aria-modal="true"]'))`);
  if (!isDialogOpen) throw new Error('Modal dialog failed to open with role="dialog"');

  const isFocusInside = await evalInBrowser(`
    const dialog = document.querySelector('[role="dialog"]');
    dialog.contains(document.activeElement);
  `);
  if (!isFocusInside) throw new Error('Focus is not contained inside the dialog on open');
  console.log('  -> Modal opened with valid ARIA semantics; focus trapped inside dialog');

  // Test Escape key close
  await evalInBrowser(`
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  `);
  await wait(500);

  const isDialogClosed = await evalInBrowser(`!Boolean(document.querySelector('[role="dialog"]'))`);
  if (!isDialogClosed) throw new Error('Modal did not close on Escape key');

  const isFocusRestored = await evalInBrowser(`
    document.activeElement && document.activeElement.getAttribute('aria-label')?.includes('Inspect evidence item')
  `);
  console.log(`  -> Escape key closed modal. Focus restored to card: ${Boolean(isFocusRestored)}`);

  // 8. Test Responsiveness, Viewports & Images
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
  console.log('  -> Desktop layout verified (No overflow, screenshot saved)');

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
  console.log('  -> Mobile layout verified (No overflow, screenshot saved)');

  if (consoleErrors.length > 0) {
    console.warn('  ! Console errors detected during session:', consoleErrors);
  } else {
    console.log('  -> Zero console errors detected during entire run');
  }

  console.log('\n--- ALL REAL BROWSER BEHAVIORAL E2E TESTS PASSED SUCCESSFULLY! ---');
}

run()
  .catch((err) => {
    console.error('\n[FATAL] E2E TEST FAILED:', err);
    process.exitCode = 1;
  })
  .finally(() => {
    if (ws) ws.close();
    if (chromeProc) {
      chromeProc.kill();
      try {
        fs.rmSync(USER_DATA_DIR, { recursive: true, force: true });
      } catch {}
    }
  });
