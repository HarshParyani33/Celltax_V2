import type { EvidenceItem, CaseDossier } from '../types/index.ts';

export const CASE_DOSSIER_DATA: CaseDossier = {
  caseNumber: "CASE NO. 012",
  caseTitle: "OPERATION: FIND HER — THE MISSING PERSON INVESTIGATION",
  securityClassification: "RESTRICTED // ULTRA-CLASSIFIED",
  assignmentDate: "CASE BRIEFING // IMMEDIATE DISPATCH",
  leadInvestigator: "FIELD INVESTIGATOR (YOU)",
  status: "ACTIVE",
  subject: "[HER NAME] — Last seen being unnecessarily adorable and radiating extraordinary warmth.",
  directive: "Investigate the mysterious disappearance of our favorite person. Examine the photographic evidence, decrypt witness letters, review suspect alibis, and follow the trail to the final scenic location.",
  specialInstructions: [
    "Handle all memory exhibits with affection; emotional resonance is exceptionally high.",
    "Do not reveal the final scenic destination until all clues have been thoroughly examined.",
    "Prepare for an overwhelming concentration of cuteness, inside jokes, and heartfelt celebrations."
  ],
  evidenceIds: ["ITEM-012-A", "ITEM-012-B", "ITEM-012-C"]
};

export const EVIDENCE_COLLECTION: EvidenceItem[] = [
  {
    id: "ITEM-012-A",
    code: "ARC-012-P",
    title: "Polaroid Exhibit A: The Scenic Lookout Sighting",
    classification: "TOP SECRET // LEVEL 3 CLEARANCE",
    dateDiscovered: "Documented at Golden Hour",
    origin: "The Scenic Bluff (Favorite Overlook Trail)",
    type: "photograph",
    summary: "Monochrome photographic plate depicting an unmarked scenic lookout tower. A warm beacon of golden sunlight pierces through the morning mist where she was last seen laughing.",
    forensicNotes: [
      "Physical examination reveals silver gelatin emulsion on double-weight rag paper.",
      "Vignette pattern indicates custom optical grinding on the camera lens.",
      "Reverse side bears a faded handwritten inscription: 'Evidence suggests an unusually high concentration of cuteness.'",
      "Witness testimony confirms she paused here to take photos of the horizon and smile at puppies."
    ],
    dimensions: "180mm x 130mm (Matted Archival Border)",
    material: "Silver Bromide Emulsion on Cold-Pressed Cotton Rag",
    confidenceScore: 98.4,
    imageUrl: "/images/evidence-photograph.jpg",
    webpUrl: "/images/evidence-photograph.webp",
    anomalies: [
      "Smile brightness at coordinate (42.8, -71.2) exceeds normal safety regulations",
      "Reverse inscription confirms subject radiates joy in all weather conditions"
    ]
  },
  {
    id: "ITEM-012-B",
    code: "ARC-012-D",
    title: "Document Exhibit B: The Handwritten Dispatch",
    classification: "RESTRICTED // CURATORIAL REVIEW",
    dateDiscovered: "Recovered from Sealed Brass Dispatch Tube",
    origin: "Sub-level Vault Annex 4",
    type: "document",
    summary: "A weathered parchment dispatch penned in archival iron gall ink, sealed with a crimson wax seal. Contains handwritten messages from friends and personal clues pointing toward the grand celebration.",
    forensicNotes: [
      "Paper stock tested: 100% rag flax fiber with deckled left perimeter.",
      "Ink chromatography indicates heartfelt notes written by those who love her most.",
      "Text contains subtle ciphers referencing her favorite snacks, coffee habits, and birthday milestones.",
      "Red wax seal verified intact: contains micro-impression of a heart and compass star."
    ],
    dimensions: "210mm x 297mm (Standard Folio)",
    material: "Weathered Flax Parchment, Archival Gall Ink, Wax Seal",
    confidenceScore: 96.1,
    imageUrl: "/images/evidence-dispatch.jpg",
    webpUrl: "/images/evidence-dispatch.webp",
    anomalies: [
      "Handwriting tempo suggests deliberate, joyful composition by loving friends",
      "Wax seal contains micro-impression of an astronomical constellation"
    ]
  },
  {
    id: "ITEM-012-C",
    code: "ARC-012-M",
    title: "Artefact Exhibit C: The Keepsake Astrolithic Compass",
    classification: "ANOMALOUS ARTIFACT // HIGHEST CLEARANCE",
    dateDiscovered: "Found inside Locked Cedar Presentation Box",
    origin: "Private Curatorial Chamber B",
    type: "artefact",
    summary: "A heavy brass instrument with nested concentric rings, hand-engraved celestial star tracks, and a convex obsidian viewing lens. Calibrated to point directly toward the scenic birthday reunion site.",
    forensicNotes: [
      "Metallurgical spectral analysis confirms 84% copper, 14% zinc, 2% stellar birthday magic.",
      "Three concentric calibrated rings align to planetary positions of an extraordinary milestone date.",
      "Gear teeth rotate smoothly without friction, vibrating with gentle excitement.",
      "Lens projects faint geometric constellations leading to the final scenic coordinates."
    ],
    dimensions: "145mm diameter x 38mm depth (Weight: 1,420g)",
    material: "Engine-Turned Brass, Obsidian Glass, Precision Jewels",
    confidenceScore: 99.8,
    imageUrl: "/images/evidence-artefact.jpg",
    webpUrl: "/images/evidence-artefact.webp",
    anomalies: [
      "Internal escapement ticks at exactly 60 beats per minute with no spring wound",
      "Inscriptions along perimeter spell out coordinates to an upcoming private celebration"
    ]
  }
];
