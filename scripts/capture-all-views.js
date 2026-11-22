import { spawn, execSync } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';

console.log('--- STARTING COMPREHENSIVE VIEW CAPTURE SCRIPT ---');

function findBrowserPath() {
  const envCandidates = [
    process.env.CHROME_BIN,
    process.env.BROWSER_PATH,
    process.env.EDGE_BIN,
  ];
  for (const envPath of envCandidates) {
    if (envPath && fs.existsSync(envPath)) return envPath;
  }

  const standardCandidates = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    path.join(process.env.LOCALAPPDATA || '', 'Google\\Chrome\\Application\\chrome.exe'),
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    path.join(process.env.LOCALAPPDATA || '', 'Microsoft\\Edge\\Application\\msedge.exe'),
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
  ];

  for (const candidate of standardCandidates) {
    if (candidate && fs.existsSync(candidate)) return candidate;
  }

  const isWin = process.platform === 'win32';
  const pathCommands = isWin
    ? ['where.exe chrome', 'where.exe msedge']
    : ['which google-chrome', 'which google-chrome-stable', 'which chromium', 'which chromium-browser', 'which msedge'];

  for (const cmd of pathCommands) {
    try {
      const stdout = execSync(cmd, { stdio: ['pipe', 'pipe', 'ignore'], encoding: 'utf8' }).trim();
      const firstLine = stdout.split(/\r?\n/)[0]?.trim();
      if (firstLine && fs.existsSync(firstLine)) return firstLine;
    } catch {}
  }

  throw new Error('No Chromium-based browser found.');
}

function checkServerReady(port = 5173, timeoutMs = 8000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    function ping() {
      const req = http.get(`http://127.0.0.1:${port}/`, (res) => {
        res.resume();
        const status = res.statusCode || 0;
        if (status >= 200 && status < 400) resolve(true);
        else {
          if (Date.now() - start > timeoutMs) reject(new Error(`Server returned HTTP ${status}`));
          else setTimeout(ping, 300);
        }
      });
      req.on('error', (err) => {
        if (Date.now() - start > timeoutMs) reject(err);
        else setTimeout(ping, 300);
      });
      req.end();
    }
    ping();
  });
}

const BROWSER_PATH = findBrowserPath();
const USER_DATA_DIR = path.resolve('temp_chrome_capture_dir');
const DEBUG_PORT = 9335;

let chromeProc = null;
let ws = null;
let messageId = 1;
const pendingRequests = new Map();

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

async function captureFullPage(outPath) {
  // Reset viewport to standard 1440 width and get full content height
  await cdpSend('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await wait(300);

  const metrics = await cdpSend('Page.getLayoutMetrics');
  const height = Math.max(900, Math.ceil(metrics.cssContentSize ? metrics.cssContentSize.height : metrics.contentSize.height));

  await cdpSend('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: height,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await wait(400);

  const screenshot = await cdpSend('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: true,
    fromSurface: true,
  });

  fs.writeFileSync(outPath, Buffer.from(screenshot.data, 'base64'));
  console.log(`  -> Captured [FULL-PAGE]: ${path.basename(outPath)} (${height}px height)`);
}

async function captureViewport(outPath, width = 1440, height = 900) {
  await cdpSend('Emulation.setDeviceMetricsOverride', {
    width: width,
    height: height,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await wait(300);

  const screenshot = await cdpSend('Page.captureScreenshot', {
    format: 'png',
    fromSurface: true,
  });

  fs.writeFileSync(outPath, Buffer.from(screenshot.data, 'base64'));
  console.log(`  -> Captured [VIEWPORT]: ${path.basename(outPath)} (${width}x${height})`);
}

async function run() {
  const viewDir = path.resolve('view');
  if (!fs.existsSync(viewDir)) {
    fs.mkdirSync(viewDir, { recursive: true });
  }

  console.log('1. Checking server readiness on port 5173...');
  await checkServerReady(5173);

  console.log(`2. Launching headless browser on port ${DEBUG_PORT}...`);
  chromeProc = spawn(BROWSER_PATH, [
    '--headless=new',
    `--remote-debugging-port=${DEBUG_PORT}`,
    `--user-data-dir=${USER_DATA_DIR}`,
    '--no-first-run',
    '--no-default-browser-check',
    'http://localhost:5173/',
  ]);

  const wsUrl = await getDebuggerUrl();
  ws = new WebSocket(wsUrl);
  await new Promise((resolve) => ws.onopen = resolve);

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pendingRequests.has(msg.id)) {
      const { resolve, reject } = pendingRequests.get(msg.id);
      pendingRequests.delete(msg.id);
      if (msg.error) reject(msg.error);
      else resolve(msg.result);
    }
  };

  await cdpSend('Runtime.enable');
  await cdpSend('Page.enable');
  await cdpSend('Network.enable');

  // --- PAGE 1: ACCESS TERMINAL ---
  console.log('\nCapturing Page 1: Access Terminal...');
  await cdpSend('Page.navigate', { url: 'http://localhost:5173/' });
  await wait(1500);
  // Click skip typewriter to have full text rendered cleanly
  await evalInBrowser(`(() => {
    const skipBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('SKIP'));
    if (skipBtn) skipBtn.click();
  })()`);
  await wait(400);
  await captureFullPage(path.join(viewDir, '01_access_terminal.png'));

  // --- PAGE 2: CASE BRIEFING ---
  console.log('\nCapturing Page 2: Case Briefing...');
  await cdpSend('Page.navigate', { url: 'http://localhost:5173/briefing' });
  await wait(1200);
  await captureFullPage(path.join(viewDir, '02_case_briefing.png'));

  // --- PAGE 3: CENTRAL INVESTIGATION BOARD ---
  console.log('\nCapturing Page 3: Investigation Board...');
  await cdpSend('Page.navigate', { url: 'http://localhost:5173/archive' });
  await wait(1500);
  await captureFullPage(path.join(viewDir, '03_investigation_board.png'));

  // --- MODAL: LETTER ENVELOPE MODAL ---
  console.log('\nCapturing Modal: Wax-Sealed Letter Modal...');
  await evalInBrowser(`(() => {
    const letterBtns = Array.from(document.querySelectorAll('button')).filter(b => b.textContent.includes('EXAMINE LETTER') || b.textContent.includes('LETTER'));
    if (letterBtns.length > 0) letterBtns[0].click();
  })()`);
  await wait(800);
  await captureViewport(path.join(viewDir, '04_wax_sealed_letter_modal.png'), 1440, 960);
  // Close letter modal
  await evalInBrowser(`window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));`);
  await wait(400);

  // --- PAGE 4: PHYSICAL SCRAPBOOK ---
  console.log('\nCapturing Page 4: Physical Scrapbook...');
  await cdpSend('Page.navigate', { url: 'http://localhost:5173/scrapbook' });
  await wait(1200);
  await captureFullPage(path.join(viewDir, '05_physical_scrapbook.png'));

  // --- PAGE 5: WITNESSES & SUSPECTS HUB ---
  console.log('\nCapturing Page 5: Witnesses & Suspects Hub...');
  await cdpSend('Page.navigate', { url: 'http://localhost:5173/witnesses' });
  await wait(1200);
  await captureFullPage(path.join(viewDir, '06_witnesses_and_suspects.png'));

  // --- MODAL: SUSPECT INTERROGATION MODAL ---
  console.log('\nCapturing Modal: Suspect Interrogation Dialog...');
  await evalInBrowser(`(() => {
    const interrogateBtns = Array.from(document.querySelectorAll('button')).filter(b => b.textContent.includes('INTERROGATE') || b.textContent.includes('REVIEW ALIBI'));
    if (interrogateBtns.length > 0) interrogateBtns[0].click();
  })()`);
  await wait(800);
  await captureViewport(path.join(viewDir, '07_suspect_interrogation_modal.png'), 1440, 960);
  // Close suspect modal
  await evalInBrowser(`window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));`);
  await wait(400);

  // --- PAGE 6: INVESTIGATION TIMELINE ---
  console.log('\nCapturing Page 6: Investigation Timeline...');
  await cdpSend('Page.navigate', { url: 'http://localhost:5173/timeline' });
  await wait(1200);
  await captureFullPage(path.join(viewDir, '08_investigation_timeline.png'));

  // --- PAGE 7: MASTER GALLERY (LOCKED GATE) ---
  console.log('\nCapturing Page 7: Master Gallery (Locked Gate)...');
  await evalInBrowser(`window.localStorage.removeItem('celltax_investigation_progression_v1')`);
  await cdpSend('Page.navigate', { url: 'http://localhost:5173/gallery' });
  await wait(1200);
  await captureFullPage(path.join(viewDir, '09_master_gallery_locked.png'));

  // --- PAGE 8: MASTER GALLERY (UNLOCKED / SUBJECT FOUND) ---
  console.log('\nCapturing Page 8: Master Curatorial Gallery (Unlocked / Subject Found)...');
  await evalInBrowser(`(() => {
    window.localStorage.setItem('celltax_investigation_progression_v1', JSON.stringify(['ITEM-012-A', 'ITEM-012-B', 'ITEM-012-C']));
  })()`);
  await cdpSend('Page.navigate', { url: 'http://localhost:5173/gallery' });
  await wait(1500);
  await captureFullPage(path.join(viewDir, '10_master_gallery_unlocked_subject_found.png'));

  // --- ACT III: UNSEALED BIRTHDAY DEDICATION REVELATION ---
  console.log('\nCapturing Act III: Unsealed Birthday Dedication Revelation...');
  await evalInBrowser(`(() => {
    const unsealBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('UNSEAL FINAL CURATORIAL REVELATION'));
    if (unsealBtn) {
      unsealBtn.scrollIntoView({ behavior: 'instant', block: 'center' });
      unsealBtn.click();
    }
  })()`);
  await wait(800);
  await captureFullPage(path.join(viewDir, '11_birthday_celebration_revelation.png'));

  console.log('\n--- ALL VIEW SCREENSHOTS SUCCESSFULLY CAPTURED IN view/ ---');
}

try {
  await run();
} catch (err) {
  console.error('[FATAL ERROR IN CAPTURE SCRIPT]', err);
  process.exitCode = 1;
} finally {
  if (ws) {
    try { ws.close(); } catch {}
  }
  if (chromeProc) {
    try {
      if (process.platform === 'win32') {
        execSync(`taskkill /pid ${chromeProc.pid} /T /F`, { stdio: 'ignore' });
      } else {
        chromeProc.kill('SIGKILL');
      }
    } catch {}
  }
  if (fs.existsSync(USER_DATA_DIR)) {
    try { fs.rmSync(USER_DATA_DIR, { recursive: true, force: true }); } catch {}
  }
}
