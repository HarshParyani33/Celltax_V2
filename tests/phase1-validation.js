import fs from 'fs';
import path from 'path';

console.log('--- RUNNING PHASE 1 AUTOMATED INTEGRATION & INTEGRITY CHECKS ---');

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`[PASS] ${message}`);
    passCount++;
  } else {
    console.error(`[FAIL] ${message}`);
    failCount++;
  }
}

// 1. Check Dist Output
const distDir = path.resolve('dist');
assert(fs.existsSync(distDir), 'dist directory exists');
const distIndex = path.join(distDir, 'index.html');
assert(fs.existsSync(distIndex), 'dist/index.html generated');

if (fs.existsSync(distIndex)) {
  const indexHtml = fs.readFileSync(distIndex, 'utf8');
  assert(indexHtml.includes('THE DEPARTMENT OF EXTRAORDINARY THINGS'), 'index.html contains Department title');
  assert(!indexHtml.includes('birthday'), 'No birthday spoilers in production HTML');
  assert(!indexHtml.includes('user-scalable=no'), 'Pinch-to-zoom is NOT disabled (accessibility passed)');
}

// 2. Check Static Assets
const assetsDir = path.join(distDir, 'assets');
assert(fs.existsSync(assetsDir), 'dist/assets directory exists');

const requiredPublicImages = [
  'evidence-photograph.jpg',
  'evidence-photograph.webp',
  'evidence-dispatch.jpg',
  'evidence-dispatch.webp',
  'evidence-artefact.jpg',
  'evidence-artefact.webp',
];

requiredPublicImages.forEach((img) => {
  const imgPath = path.resolve('public', 'images', img);
  assert(fs.existsSync(imgPath), `Image asset exists: ${img}`);
  if (fs.existsSync(imgPath)) {
    const size = fs.statSync(imgPath).size;
    assert(size > 10000, `Image asset ${img} has valid non-zero content (${size} bytes)`);
  }
});

const sealPath = path.resolve('public', 'seal.svg');
assert(fs.existsSync(sealPath), 'Seal SVG exists in public/');

// 3. Verify Codebase Integrity
const srcData = fs.readFileSync(path.resolve('src/data/evidence.ts'), 'utf8');
assert(srcData.includes('ITEM-012-A') && srcData.includes('ITEM-012-B') && srcData.includes('ITEM-012-C'), 'All 3 evidence items present');
assert(srcData.includes('evidence-photograph.webp'), 'WebP image references wired');

const terminalSrc = fs.readFileSync(path.resolve('src/pages/AccessTerminal.tsx'), 'utf8');
assert(!terminalSrc.includes('Demo Clearance:'), 'Visible demo clearance hints removed from public UI');
assert(terminalSrc.includes('handleSkipIntro'), 'Skip intro functionality implemented for accessibility');
assert(terminalSrc.includes('role="alert"'), 'Accessible alert roles implemented for error feedback');

const modalSrc = fs.readFileSync(path.resolve('src/components/EvidenceModal.tsx'), 'utf8');
assert(modalSrc.includes('role="dialog"'), 'Accessible dialog role implemented');
assert(modalSrc.includes('aria-modal="true"'), 'aria-modal attribute implemented');
assert(modalSrc.includes('Escape'), 'Escape key closing supported');
assert(modalSrc.includes('previousFocusRef'), 'Focus restoration implemented');

const archiveSrc = fs.readFileSync(path.resolve('src/pages/EvidenceArchive.tsx'), 'utf8');
assert(archiveSrc.includes('<AnimatePresence>'), 'AnimatePresence wraps EvidenceModal in Archive');
assert(archiveSrc.includes('aria-pressed='), 'Accessible filter buttons with aria-pressed state implemented');
assert(archiveSrc.includes('role="group"'), 'Filter container grouped with accessible role');

const audioSrc = fs.readFileSync(path.resolve('src/utils/audio.ts'), 'utf8');
assert(audioSrc.includes('private isMuted: boolean = true'), 'Audio engine starts muted by default per policy');

console.log(`\nVALIDATION COMPLETE: ${passCount} passed, ${failCount} failed.`);
if (failCount > 0) {
  process.exit(1);
}
