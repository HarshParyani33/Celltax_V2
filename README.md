# THE DEPARTMENT OF EXTRAORDINARY THINGS
### CASE NO. 012 — CONFIDENTIAL COLLECTION
**Repository:** `celltax_v2`

> *An immersive, confidential investigation archive built with high-fidelity cinematic art direction, archival typography, and forensic interaction design.*

---

## Overview

**The Department of Extraordinary Things** (Case No. 012) is an interactive confidential dossier experience. Investigators authenticate through a secured terminal node, decrypt classified directives, and conduct forensic examinations of anomalous recovered artefacts.

The project blends atmospheric narrative design, tactile mechanical soundscapes, and editorial archival visual hierarchies with modern web engineering discipline.

---

## Phase 1 Architecture & Screens

Phase 1 establishes the core engineering foundation and the first three confidential environments:

### 1. Screen A: Access Terminal (`/` or `/access`)
- **Atmospheric Terminal Node:** CRT scanlines, subtle radial vignettes, and paced typewriter text reveal.
- **Credential Verification:** Input field with validation, error states, and configurable access codes.
- **Configurable Access Codes:** Accepts `EXTRAORDINARY`, `012`, `CASE012`, `CONFIDENTIAL`, or `AGENT`.
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
- **Forensic Evidence Repository:** High-density catalog of unsealed exhibits with accession numbers and provenance metadata.
- **Exhibits Included:**
  1. **Item 012-A (Photograph):** Gelatin silver print of an unmarked coastal observatory tower.
  2. **Item 012-B (Document):** Weathered dispatch folio in iron gall ink with official seal.
  3. **Item 012-C (Artefact):** Concentric brass astrolithic dial with astronomical markings.
- **Detailed Inspection Overlay:** Modal dialog featuring optical zoom preview, material specifications, forensic ledger observations, and anomalous markers.
- **Curatorial Architecture Stubs:** Pre-configured design tokens and state models for Phase 2 museum gallery transformations.

---

## Technology Stack

- **Framework:** [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Bundler & Tooling:** [Vite 5](https://vitejs.dev/)
- **Styling & Tokens:** [Tailwind CSS](https://tailwindcss.com/)
- **Motion & Cinematic Transitions:** [Framer Motion](https://www.framer.com/motion/) (with `prefers-reduced-motion` compliance)
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
│   ├── images/                 # Locally stored, optimized archival assets
│   │   ├── evidence-photograph.jpg
│   │   ├── evidence-dispatch.jpg
│   │   └── evidence-artefact.jpg
│   └── seal.svg                # Department vector crest & emblem
├── tests/
│   └── phase1-validation.js    # Automated integration & accessibility validation checks
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
- `npm run build` — Run TypeScript check (`tsc`) and create production build (`dist/`)
- `npm run preview` — Locally preview the production build
- `npm run typecheck` — Run TypeScript compiler check without emitting files
- `npm test` — Run automated integration and accessibility verification suite

---

## Design Principles & Visual Ambition

The aesthetic reflects a classified intelligence archive and a prestigious private curatorial institution:
- **Palette:** Deep forest noir (`#070d0a`), charcoal slate (`#121619`), weathered parchment (`#f4ebd8`), and polished brass (`#c5a059`).
- **Typography:** Archival monospace (`Courier Prime`), high-contrast editorial serif (`Cinzel`), and curatorial body typography (`Inter` / `Cormorant Garamond`).
- **Tactility:** Layered vignettes, subtle scanning lines, realistic physical shadows, and evidence stamps.

---

## Engineering Quality & Verification

Governed by the **GRAVITAS Reliability Runtime**:
- Zero compiler errors under strict TypeScript.
- Clean production bundle (`npm run build`).
- Full viewport responsiveness across desktop, tablet, and mobile.
- Zero external unverified network image dependencies.
