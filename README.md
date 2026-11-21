# THE DEPARTMENT OF EXTRAORDINARY THINGS
### CASE NO. 012 — CONFIDENTIAL COLLECTION
**Repository:** `celltax_v2`

> *An immersive, confidential investigation archive built with high-fidelity cinematic art direction, archival typography, and forensic interaction design.*

---

## Overview

**The Department of Extraordinary Things** (Case No. 012) is an interactive confidential dossier experience. Investigators enter through an atmospheric narrative terminal node, decrypt classified directives, and conduct forensic examinations of anomalous recovered artefacts.

The project blends atmospheric narrative design, tactile mechanical soundscapes, and editorial archival visual hierarchies with modern web engineering discipline.

> [!NOTE]
> **Narrative Experience Disclosure**: This application is a fictional, cinematic narrative experience, not real authentication. The Access Terminal is an interactive fictional gate designed purely for theatrical storytelling and immersion. Clearance verification is performed entirely on the client side using credentials contained in frontend source code (`012`, `EXTRAORDINARY`, `CASE012`, etc.). This mechanism must not be used or represented as secure server authentication, cryptographic access control, or protected storage.

---

## Architecture & Investigation Experience

The Department of Extraordinary Things is structured as a progressive narrative investigation divided across two integrated phases:

### Phase 1 Environments

#### 1. Screen A: Access Terminal (`/` or `/access`)
- **Atmospheric Terminal Node:** CRT scanlines, subtle radial vignettes, and paced typewriter text reveal.
- **Interactive Controls:** "Skip Intro" control immediately drains typing intervals and reveals the clearance input.
- **Narrative Gate Clearance:** Validates clearance inputs with clear accessible error alerts (`[role="alert"]`) and tactile keyboard feedback.
- **Accepted Codes:** Accepts `EXTRAORDINARY`, `012`, `CASE012`, `CASE 012`, `CONFIDENTIAL`, `ARCHIVE`, `AGENT`, `DIRECTIVE12`, `INVESTIGATOR`, `OPEN`, `START` via shared pure validator (`validateClearanceCode`).
- **Fictional Clearance Sequence:** Decryption animation, auditory chime feedback, and seamless transition into the briefing room.

#### 2. Screen B: Case Briefing (`/briefing`)
- **Confidential Case Dossier:** Archival paper aesthetic, official classification stamps (`TOP SECRET // ULTRA`), and institutional crest.
- **Case Metadata Matrix:**
  - **Case Number:** `CASE NO. 012`
  - **Subject:** *An extraordinary individual.*
  - **Status:** *Under investigation.*
  - **Objective:** *Identify the connection between a collection of unusual artefacts.*
- **Interactive Acceptance:** "Accept Investigation" protocol that unlocks the primary evidence repository.

#### 3. Screen C: Evidence Archive (`/archive`)
- **Forensic Evidence Repository:** High-density catalog of unsealed exhibits with accession numbers, provenance metadata, and category filters.
- **Accessible Category Filters:** Interactive button group (`role="group"`) with `aria-pressed` states for ALL, PHOTOGRAPHS, DISPATCHES, and ARTEFACTS.
- **Exhibits Included:**
  1. **Item 012-A (Photograph):** Gelatin silver print of an unmarked coastal observatory tower.
  2. **Item 012-B (Document):** Weathered dispatch folio in iron gall ink with official seal.
  3. **Item 012-C (Artefact):** Concentric brass astrolithic dial with astronomical markings.
- **Detailed Inspection Overlay:** Modal dialog (`role="dialog"`, `aria-modal="true"`) featuring:
  - Initial focus containment on open.
  - Tab and Shift+Tab focus trap wrapping (excluding hidden and disabled elements).
  - Escape key dismissal.
  - Safe focus restoration to the triggering card button.
  - Optical zoom preview, material specifications, forensic ledger observations, and anomalous markers.
  - Live inspection recording that feeds the progression engine.

---

### Phase 2 Environments & Master Curatorial Gallery

#### 4. Screen D: Connected Investigation Timeline (`/timeline`)
- **Chronological Rail:** Spatial timeline spanning three historical eras:
  1. **1978 Era:** Coastal Observatory transmission (Item 012-A).
  2. **1988 Era:** Weathered Dispatch Folio intercepted in courier transit (Item 012-B).
  3. **Present Era:** Astrolithic Mechanism recovery and astronomical alignment (Item 012-C).
- **Forensic Status Distinction:** Clearly distinguishes established physical facts from investigative hypotheses.
- **Progressive Correlation Links:** Dynamic narrative connections that activate progressively as items are examined:
  - *Link 1 (1+ items inspected):* Temporal alignment between the observatory and dispatch coordinates.
  - *Link 2 (2+ items inspected):* Provenance correlation linking courier paths with celestial gear ratios.
  - *Link 3 (3 items inspected):* Cryptographic convergence confirming all three anomalies point to a single subject.

#### 5. Screen E: Master Curatorial Gallery (`/gallery` or `/museum`)
- **Locked State (< 3 exhibits examined):**
  - Forensic seal lock barrier and encrypted status banner.
  - Live progression bar and percentage indicator.
  - Remaining uninspected exhibits inventory with direct navigation back to the archive.
- **Unlocked State (all 3 exhibits examined):**
  - **Curatorial Editorial Essay:** "The Convergence of Extraordinary Anomalies" curatorial synthesis.
  - **Triple Archival Pedestals:** Elevated museum exhibition mounts featuring spotlight lighting, brass label plaques, provenance metadata, and optical zoom toggles for all three exhibits.
  - **Forensic Synthesis Matrix:** Core forensic deductions unifying the visual, documentary, and mechanical evidence.
  - **Final Curatorial Revelation Drawer:** Interactive unsealing control marked by the Department seal, revealing the classified dedication ("To An Extraordinary Individual").
  - **Accessible Investigation Reset:** Accessible confirmation dialog (`role="dialog"`, `aria-modal="true"`) allowing investigators to clear progression and restart the case.

---

### Investigation Progression Architecture (`src/utils/progression.ts`)

- **State Persistence:** Inspected exhibit IDs are tracked and persisted in browser `localStorage` under `celltax_investigation_progression_v1` with an in-memory fallback.
- **Idempotent Storage:** Duplicate inspection IDs are prevented automatically.
- **Reactive Synchronization:** Exposes a custom `useProgression()` React hook that listens to both native storage events and internal dispatch notifications, ensuring instant synchronization across all routes and header badges without requiring external state management dependencies.
- **Safe Degradation:** Gracefully catches and recovers from quota exhaustion, blocked storage permissions, or corrupt JSON payloads.

---

## Accessibility & Motion Preferences

- **Reduced Motion Support:** Respects `prefers-reduced-motion: reduce` dynamically via live media query listeners and Framer Motion's `useReducedMotion`. When reduced motion is preferred:
  - Spatial translation offsets (`y`, `x`) are eliminated (`0`).
  - Staggered delays and animation durations collapse to `0.01ms`.
  - Terminal text reveals without horizontal sliding.
  - Global CSS animations and scanlines are suppressed.
- **Focus Management:** Comprehensive keyboard accessibility across modal dialogs, cards, filter buttons, and navigation elements.
- **Audio Autoplay Compliance:** Synthesizer defaults to muted; audio output is activated only on user gesture.

---

## Technology Stack

- **Framework:** [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Bundler & Tooling:** [Vite 5](https://vitejs.dev/)
- **Styling & Tokens:** [Tailwind CSS](https://tailwindcss.com/)
- **Motion & Transitions:** [Framer Motion](https://www.framer.com/motion/) (with dynamic `prefers-reduced-motion` compliance)
- **Routing:** [React Router v6](https://reactrouter.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Audio Synthesis:** Zero-dependency procedural Web Audio API engine (synthesized terminal keys, access chimes, and inspection tones; muted by default with toggle control)

---

## Directory Structure

```
celltax_v2/
├── .agents/                    # Agent skills & workflows (git-ignored)
├── .gravitas/                  # GRAVITAS Task Contract & verification ledger
├── public/
│   ├── images/                 # Optimized local archival assets (.jpg and .webp)
│   │   ├── evidence-photograph.jpg
│   │   ├── evidence-photograph.webp
│   │   ├── evidence-dispatch.jpg
│   │   ├── evidence-dispatch.webp
│   │   ├── evidence-artefact.jpg
│   │   └── evidence-artefact.webp
│   ├── screenshots/            # Automated real-browser E2E verification captures
│   │   ├── desktop_evidence_archive.png
│   │   └── mobile_evidence_archive.png
│   └── seal.svg                # Department vector crest & emblem
├── tests/
│   ├── behavioral.test.js      # Direct module behavioral unit tests (Node test runner)
│   ├── browser-e2e.test.js     # Real Chromium DevTools Protocol (CDP) end-to-end suite
│   └── phase1-validation.js    # Architectural & integration validation checks
├── src/
│   ├── components/             # Reusable UI elements (Header, Footer, EvidenceModal)
│   ├── data/                   # Structured case dossiers and evidence collections
│   ├── pages/                  # Terminal, Briefing, EvidenceArchive, InvestigationTimeline, MasterGallery
│   ├── styles/                 # Tailwind base layers, scanline textures, and scrollbars
│   ├── tokens/                 # Investigation & Museum design tokens
│   ├── types/                  # Strict TypeScript domain interfaces
│   ├── utils/                  # Audio, animations, credentials, timers, focus, progression
│   ├── App.tsx                 # Route coordinator & cinematic transition wrapper
│   └── main.tsx                # Application entrypoint
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## Getting Started

### Prerequisites
- Node.js `v18+` (Tested on `v24.11.1`)
- npm `v9+` (Tested on `11.6.2`)

### Installation & Run

```bash
# Clone the repository
git clone https://github.com/HarshParyani33/Celltax_V2.git
cd Celltax_V2

# Install dependencies
npm install

# Start local development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Available Scripts

- `npm run dev` — Launch Vite local development server
- `npm run build` — Run TypeScript compiler check (`tsc`) and create production build (`dist/`)
- `npm run preview` — Locally preview the production build
- `npm run typecheck` — Run TypeScript compiler check without emitting files (`tsc --noEmit`)
- `npm test` — Run automated behavioral unit tests and architectural validations (`tests/behavioral.test.js` & `tests/phase1-validation.js`)
- `npm run test:e2e` — Run real browser end-to-end integration suite via Chrome DevTools Protocol (`tests/browser-e2e.test.js`)

---

## Verification & Test Evidence

All verifications are executed automatically:
1. **TypeScript Typecheck:** `npm run typecheck` passes with zero errors under strict mode.
2. **Production Build:** `npm run build` compiles clean bundles with full route code splitting and asset hashing.
3. **Behavioral Suite (22 Unit Tests across 9 Suites):** `npm test` runs Node test runner against actual module exports:
   - `src/utils/credentials.ts`: Case-insensitive whitespace-tolerant clearance validation.
   - `src/utils/timers.ts`: Active interval and timeout lifecycle tracking and teardown.
   - `src/utils/focus.ts`: Hidden-ancestor DOM filtering, boundary Tab wrapping, and safe focus restoration.
   - `src/utils/animations.ts`: Strict reduced-motion compliance (zeroing translation, suppressing delays).
   - `src/utils/audio.ts`: Autoplay compliance (starts muted by default).
   - `src/data/evidence.ts`: Catalog integrity and media asset parity.
   - `src/utils/progression.ts`: Persistent storage synchronization, duplicate prevention, completion percentage, remaining exhibits calculation, progressive timeline links, reset handler, and corrupted `localStorage` recovery.
4. **Architectural & Integration Checks (32 Tests):** Validates asset generation, non-zero image bytecounts, WebP and SVG links, ARIA dialog roles, skip-intro controls, and alert roles.
5. **Real Browser CDP E2E (12 Stages):** `npm run test:e2e` launches real headless Chromium and validates:
   - Typewriter skip-intro interval cancellation.
   - Narrative clearance gate error handling and navigation.
   - Briefing acceptance.
   - Evidence category filtering.
   - Modal bidirectional Tab focus trapping, Escape key closing, and trigger focus restoration.
   - Progression accumulation across individual exhibit inspections.
   - Investigation Timeline node rendering and progressive correlation links.
   - Locked Master Gallery enforcement (progress bar + remaining uninspected items breakdown).
   - Master Gallery unlocking upon examining all 3 exhibits.
   - Final curatorial revelation unsealing drawer ("To An Extraordinary Individual").
   - LocalStorage progression persistence across full browser reload.
   - Progression reset confirmation dialog and archive return.
   - Desktop (1440px) and Mobile (390px) responsive layout rendering without horizontal overflow.
   - Zero console errors, zero uncaught page exceptions, and zero failed network requests.
