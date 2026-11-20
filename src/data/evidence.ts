import { EvidenceItem, CaseDossier } from '../types';

export const CASE_DOSSIER_DATA: CaseDossier = {
  caseNumber: "CASE NO. 012",
  caseTitle: "THE EXTRAORDINARY RECOVERY",
  securityClassification: "RESTRICTED // ULTRA-CLASSIFIED",
  assignmentDate: "OCTOBER 14 — ARCHIVE ENTRY",
  leadInvestigator: "FIELD AGENT DESIGNATE",
  status: "ACTIVE",
  subject: "An extraordinary individual whose journey intersects with uncharted anomalies.",
  directive: "Conduct forensic examination of recovered artefacts. Establish contextual timeline and reveal the common origin binding this collection.",
  specialInstructions: [
    "Handle all items with archival care; seal integrity must be maintained.",
    "Do not distribute photographs or translations outside Department clearance.",
    "Cross-reference temporal markers with the Master Curatorial Registry."
  ],
  evidenceIds: ["ITEM-012-A", "ITEM-012-B", "ITEM-012-C"]
};

export const EVIDENCE_COLLECTION: EvidenceItem[] = [
  {
    id: "ITEM-012-A",
    code: "ARC-012-P",
    title: "Gelatin Silver Print: The Coastal Observatory",
    classification: "TOP SECRET // LEVEL 3 CLEARANCE",
    dateDiscovered: "Circa 1978 (Archival Inscription)",
    origin: "Sector 7 Coastal Bluff (Unmapped Coordinates)",
    type: "photograph",
    summary: "Monochrome photographic plate depicting an unmarked maritime observation tower. A singular warm beacon illuminates the sea fog.",
    forensicNotes: [
      "Physical examination reveals silver gelatin emulsion on double-weight rag paper.",
      "Vignette pattern indicates custom optical grinding on the camera lens.",
      "Reverse side bears a faded handwritten inscription: 'Where the horizon bends inward.'",
      "No civilian or government blueprints exist for the architecture shown."
    ],
    dimensions: "180mm x 130mm (Matted Archival Border)",
    material: "Silver Bromide Emulsion on Cold-Pressed Cotton Rag",
    confidenceScore: 98.4,
    imageUrl: "/images/evidence-photograph.jpg",
    anomalies: [
      "Light reflection at coordinate (42.8, -71.2) shows irregular polarization",
      "Signature stamp matches Department Curatorial Seal 1984"
    ]
  },
  {
    id: "ITEM-012-B",
    code: "ARC-012-D",
    title: "Field Dispatch: Decrypted Journal Folio",
    classification: "RESTRICTED // CURATORIAL REVIEW",
    dateDiscovered: "Recovered from Sealed Brass Dispatch Tube",
    origin: "Sub-level Vault Annex 4",
    type: "document",
    summary: "A weathered parchment dispatch penned in archival iron gall ink, sealed with the Department wax insignia. Contains personal coordinates and an extraordinary personal revelation.",
    forensicNotes: [
      "Paper stock tested: 100% rag flax fiber with deckled left perimeter.",
      "Ink chromatography indicates standard Department iron gall with copper sulphate trace.",
      "Text contains subtle ciphers referencing a rare milestone anniversary.",
      "Red stamp ink verified as Department archival pigment 1988."
    ],
    dimensions: "210mm x 297mm (Standard Folio)",
    material: "Weathered Flax Parchment, Archival Gall Ink, Wax Seal",
    confidenceScore: 96.1,
    imageUrl: "/images/evidence-dispatch.jpg",
    anomalies: [
      "Handwriting tempo suggests deliberate, solemn composition",
      "Wax seal contains micro-impression of astronomical constellation"
    ]
  },
  {
    id: "ITEM-012-C",
    code: "ARC-012-M",
    title: "Astrolithic Dial: Unidentified Concentric Mechanism",
    classification: "ANOMALOUS ARTIFACT // HIGHEST CLEARANCE",
    dateDiscovered: "Found inside Locked Cedar Presentation Box",
    origin: "Private Curatorial Chamber B",
    type: "artefact",
    summary: "A heavy brass instrument with nested concentric rings, hand-engraved celestial star tracks, and a convex obsidian viewing lens. The dial mechanisms rotate with silent precision.",
    forensicNotes: [
      "Metallurgical spectral analysis confirms 84% copper, 14% zinc, 2% unidentified stellar alloy.",
      "Three concentric calibrated rings align to planetary positions of an extraordinary milestone date.",
      "Gear teeth exhibit zero mechanical friction or oxidation despite age.",
      "Lens projects faint geometric constellations under warm directional spotlight."
    ],
    dimensions: "145mm diameter x 38mm depth (Weight: 1,420g)",
    material: "Engine-Turned Brass, Obsidian Glass, Precision Jewels",
    confidenceScore: 99.8,
    imageUrl: "/images/evidence-artefact.jpg",
    anomalies: [
      "Internal escapement ticks at exactly 60 beats per minute with no spring wound",
      "Inscriptions along perimeter spell out coordinates to an upcoming private celebration"
    ]
  }
];
