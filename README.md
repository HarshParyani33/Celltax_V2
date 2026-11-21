# THE DEPARTMENT OF EXTRAORDINARY THINGS
### CASE NO. 012 — CONFIDENTIAL COLLECTION
**Repository:** `celltax_v2`

> *An immersive, confidential investigation archive built with high-fidelity cinematic art direction, archival typography, and forensic interaction design.*

---

## Overview

**The Department of Extraordinary Things** (Case No. 012) is an interactive confidential dossier experience. Investigators authenticate through a secured terminal node, decrypt classified directives, and conduct forensic examinations of anomalous recovered artefacts.

The project blends atmospheric narrative design, tactile mechanical soundscapes, and editorial archival visual hierarchies with modern web engineering discipline.

> [!NOTE]
> **Fictional Gate Disclosure**: The Access Terminal is an interactive narrative gate designed purely for theatrical and cinematic immersion. Clearance verification is performed entirely on the client side using credentials contained in frontend source code (`012`, `EXTRAORDINARY`, `CASE012`, etc.). This mechanism does not represent secure server authentication, cryptographic access control, or protected storage.

---

## Phase 1 Architecture & Screens

Phase 1 establishes the core engineering foundation and the first three confidential environments:

### 1. Screen A: Access Terminal (`/` or `/access`)
- **Atmospheric Terminal Node:** CRT scanlines, subtle radial vignettes, and paced typewriter text reveal.
- **Interactive Controls:** "Skip Intro" control immediately drains typing intervals and reveals the clearance input.
- **Narrative Gate Clearance:** Validates clearance inputs with clear accessible error alerts (`[role="alert"]`) and tactile keyboard feedback.
- **Accepted Codes:** Accepts `EXTRAORDINARY`, `012`, `CASE012`, `CASE 012`, `CONFIDENTIAL`, `ARCHIVE`, `AGENT`, `DIRECTIVE12`, `INVESTIGATOR`, `OPEN`, `START`.
- **Authentication Sequence:** Decryption animation, auditory chime feedback, and seamless transition into the briefing room.

### 2. Screen B: Case Briefing (`/briefing`)
- **Confidential Case Dossier:** Archival paper aesthetic, official classification stamps (`TOP SECRET // ULTRA`), and institutional crest.
- **Case Metadata Matrix:**
  - **Case Number:** `CASE NO. 012`
  - **Subject:** *An extraordinary individual.*
  - **Status:** *Under investigation.*
  - **Objective:** *Identify the connection between a collection of unusual artefacts.*
- **Interactive Acceptance:** "Accept Investigation" protocol that unlocks the primary evidence repository.

### 3. Screen C: Evidence Archive (`/archive`)
- **Forensic Evidence Repository:** High-density catalog of unsealed exhibits with accession numbers, provenance metadata, and category filters.
- **Accessible Category Filters:** Interactive button group (`role="group"`) with `aria-pressed` states for ALL, PHOTOGRAPHS, DISPATCHES, and ARTEFACTS.
- **Exhibits Included:**
  1. **Item 012-A (Photograph):** Gelatin silver print of an unmarked coastal observatory tower.
  2. **Item 012-B (Document):** Weathered dispatch folio in iron gall ink with official seal.
  3. **Item 012-C (Artefact):** Concentric brass astrolithic dial with astronomical markings.
- **Detailed Inspection Overlay:** Modal dialog (`role="dialog"`, `aria-modal="true"`) featuring:
  - Initial focus containment on open.
  - Tab and Shift+Tab focus trap wrapping.
  - Escape key dismissal.
  - Safe focus restoration to the triggering card button.
  - Optical zoom preview, material specifications, forensic ledger observations, and anomalous markers.
- **Curatorial Architecture Stubs:** Pre-configured design tokens and state models for Phase 2 museum gallery transformations.

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
│   ├── behavioral.test.js      # Behavioral unit tests (Node test runner, mock-free real module tests)
│   ├── browser-e2e.test.js     # Real Chromium DevTools Protocol (CDP) end-to-end suite
│   └── phase1-validation.js    # Architectural & integration validation checks
├── src/
│   ├── components/             # Reusable UI elements (Header, Footer, EvidenceModal)
│   ├── data/                   # Structured case dossiers and evidence collections
│   ├── pages/                  # Screen A (AccessTerminal), Screen B (CaseBriefing), Screen C (EvidenceArchive)
│   ├── styles/                 # Tailwind base layers, scanline textures, and scrollbars
│   ├── tokens/                 # Investigation & Museum design tokens
│   ├── types/                  # Strict TypeScript domain interfaces
│   ├── utils/                  # Web Audio synthesis & animation variants
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
2. **Production Build:** `npm run build` compiles clean bundles.
3. **Behavioral Suite:** `npm test` exercises animation variants, audio states, skip-intro timers, modal traps, and data structures.
4. **Real Browser CDP E2E:** `npm run test:e2e` validates the entire 3-screen progression, skip-intro line stability, error alerts, modal focus trapping, Escape key closing, trigger focus restoration, mobile (390px) and desktop (1440px) viewport overflow, and image rendering.
