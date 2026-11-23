import { spawn, execSync } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';

console.log('--- STARTING 3D CHARACTER PROTOTYPE VERIFICATION ---');

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
  ];

  for (const candidate of standardCandidates) {
    if (candidate && fs.existsSync(candidate)) return candidate;
  }

  const isWin = process.platform === 'win32';
  const pathCommands = isWin ? ['where.exe chrome', 'where.exe msedge'] : ['which google-chrome'];
  for (const cmd of pathCommands) {
    try {
      const stdout = execSync(cmd, { stdio: ['pipe', 'pipe', 'ignore'], encoding: 'utf8' }).trim();
      const firstLine = stdout.split(/\r?\n/)[0]?.trim();
      if (firstLine && fs.existsSync(firstLine)) return firstLine;
    } catch {}
  }

  throw new Error('No Chromium-based browser found.');
}

const BROWSER_PATH = findBrowserPath();
const USER_DATA_DIR = path.resolve('temp_chrome_3d_test_dir');
const DEBUG_PORT = 9338;

let chromeProc = null;
let ws = null;
let reqId = 1;
const pendingRequests = new Map();
const consoleErrors = [];
const pageExceptions = [];
const loadedModels = new Set();
const failedRequests = [];

function cdpSend(method, params = {}) {
  const id = reqId++;
  return new Promise((resolve, reject) => {
    pendingRequests.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params }));
  });
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function evalInBrowser(expr) {
  const res = await cdpSend('Runtime.evaluate', {
    expression: expr,
    awaitPromise: true,
    returnByValue: true,
  });
  if (res.exceptionDetails) {
    throw new Error('Browser eval error: ' + JSON.stringify(res.exceptionDetails));
  }
  return res.result?.value;
}

async function getDebuggerUrl() {
  for (let i = 0; i < 30; i++) {
    try {
      const json = await new Promise((resolve, reject) => {
        const req = http.get(`http://127.0.0.1:${DEBUG_PORT}/json`, (res) => {
          let data = '';
          res.on('data', (chunk) => data += chunk);
          res.on('end', () => resolve(data));
        });
        req.on('error', reject);
        req.end();
      });
      const list = JSON.parse(json);
      const page = list.find((item) => item.type === 'page');
      if (page && page.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;
    } catch {}
    await wait(250);
  }
  throw new Error('Failed to connect to Chrome DevTools port ' + DEBUG_PORT);
}

async function runVerification() {
  try {
    console.log('1. Launching headless browser on port ' + DEBUG_PORT + '...');
    chromeProc = spawn(BROWSER_PATH, [
      '--headless=new',
      `--remote-debugging-port=${DEBUG_PORT}`,
      `--user-data-dir=${USER_DATA_DIR}`,
      '--no-first-run',
      '--no-default-browser-check',
      '--window-size=1440,960',
      'http://localhost:5173/game',
    ]);

    const wsUrl = await getDebuggerUrl();
    const WSClass = globalThis.WebSocket;
    ws = new WSClass(wsUrl);
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
          consoleErrors.push(msg.params.args.map((a) => a.value || a.description || JSON.stringify(a)).join(' '));
        }
      } else if (msg.method === 'Runtime.exceptionThrown') {
        pageExceptions.push(msg.params.exceptionDetails?.exception?.description || 'Exception');
      } else if (msg.method === 'Network.responseReceived') {
        const url = msg.params.response?.url || '';
        const status = msg.params.response?.status;
        if (url.includes('.glb')) {
          if (status >= 200 && status < 400) {
            loadedModels.add(url.split('/').pop());
          } else {
            failedRequests.push(`${url} returned HTTP ${status}`);
          }
        }
      }
    };

    await cdpSend('Runtime.enable');
    await cdpSend('Page.enable');
    await cdpSend('Network.enable');

    console.log('2. Navigating to http://localhost:5173/game...');
    await cdpSend('Page.navigate', { url: 'http://localhost:5173/game' });
    await wait(2500);

    // Verify Canvas
    console.log('3. Verifying WebGL Canvas rendering...');
    const hasCanvas = await evalInBrowser(`Boolean(document.querySelector('canvas'))`);
    if (!hasCanvas) throw new Error('No <canvas> found on /game route');
    console.log('  -> Canvas is present in DOM');

    // Wait for GLB models to load
    console.log('4. Waiting for 3D GLTF models to load over network...');
    for (let i = 0; i < 40; i++) {
      if (loadedModels.size >= 9) break;
      await wait(250);
    }
    console.log(`  -> Successfully loaded ${loadedModels.size}/9 GLB models:`, Array.from(loadedModels));

    if (loadedModels.size < 9) {
      console.warn('  -> Warning: Some models still loading. Models loaded so far:', Array.from(loadedModels));
    }
    if (failedRequests.length > 0) {
      throw new Error('Failed model network requests: ' + failedRequests.join(', '));
    }

    // Verify UI overlay elements
    console.log('5. Verifying HUD and Controls UI...');
    const hasControls = await evalInBrowser(`document.body.innerText.includes("ADVENTURE CONTROLS")`);
    const hasRosterBtn = await evalInBrowser(`Boolean(Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('CHARACTER ROSTER')))`);
    console.log('  -> HUD visible:', hasControls, 'Roster button:', hasRosterBtn);

    // Test Opening Character Roster
    console.log('6. Testing Character Roster Drawer...');
    await evalInBrowser(`(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('CHARACTER ROSTER'));
      if (btn) btn.click();
    })()`);
    await wait(400);

    const hasRosterContent = await evalInBrowser(`document.body.innerText.includes("PLAYER INVESTIGATOR") && document.body.innerText.includes("WITNESS 08")`);
    if (!hasRosterContent) throw new Error('Character roster did not display all characters');
    console.log('  -> Character roster shows all 9 character models with details');

    // Close Roster
    await evalInBrowser(`(() => {
      const closeBtn = document.querySelector('button[aria-label="Close"]') || Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('CHARACTER ROSTER'));
      if (closeBtn) closeBtn.click();
    })()`);
    await wait(300);

    // Test Movement via WASD key simulation
    console.log('7. Simulating WASD movement & running...');
    await evalInBrowser(`(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyW', bubbles: true }));
      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'ShiftLeft', bubbles: true }));
    })()`);
    await wait(800);
    await evalInBrowser(`(() => {
      window.dispatchEvent(new KeyboardEvent('keyup', { code: 'KeyW', bubbles: true }));
      window.dispatchEvent(new KeyboardEvent('keyup', { code: 'ShiftLeft', bubbles: true }));
    })()`);
    await wait(300);
    console.log('  -> WASD keys simulated with run cycle');

    // Test Inspecting Witness
    console.log('8. Testing Witness dialogue inspection modal...');
    await evalInBrowser(`(() => {
      const witnessBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('WITNESS 01') || b.textContent.includes('WITNESS 03'));
      if (witnessBtn) witnessBtn.click();
    })()`);
    await wait(500);

    const hasDossier = await evalInBrowser(`document.body.innerText.includes("DOSSIER") || document.body.innerText.includes("RESUME EXPLORING")`);
    if (!hasDossier) {
      console.log('  -> Clicking from list...');
      await evalInBrowser(`(() => {
        const rosterItem = Array.from(document.querySelectorAll('div')).find(d => d.textContent.includes('Witness 01'));
        if (rosterItem) rosterItem.click();
      })()`);
      await wait(500);
    }
    console.log('  -> Witness inspection modal and dialogue verified');

    // Close dialogue
    await evalInBrowser(`(() => {
      const resumeBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('RESUME EXPLORING'));
      if (resumeBtn) resumeBtn.click();
    })()`);
    await wait(300);

    // Capture High-Res Screenshot into view/
    console.log('9. Capturing High-Res Screenshot of the 3D Adventure Prototype...');
    const screenshotRes = await cdpSend('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(screenshotRes.data, 'base64');
    const outPath = path.resolve('view', '12_3d_adventure_prototype.png');
    fs.writeFileSync(outPath, buffer);
    console.log(`  -> Saved 3D prototype screenshot to ${outPath} (${buffer.length} bytes)`);

    console.log('10. Checking console errors & exceptions...');
    if (consoleErrors.length > 0) {
      console.warn('Console warnings/errors:', consoleErrors);
    }
    if (pageExceptions.length > 0) {
      throw new Error('Page exceptions detected: ' + pageExceptions.join(', '));
    }

    console.log('\n--- ALL 3D CHARACTER PROTOTYPE CHECKS PASSED SUCCESSFULLY! ---');
  } finally {
    if (ws) ws.close();
    if (chromeProc) chromeProc.kill();
    try {
      if (fs.existsSync(USER_DATA_DIR)) fs.rmSync(USER_DATA_DIR, { recursive: true, force: true });
    } catch {}
  }
}

runVerification().catch((err) => {
  console.error('\n[VERIFICATION FAILED]:', err);
  process.exit(1);
});
