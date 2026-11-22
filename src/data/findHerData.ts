/**
 * OPERATION: FIND HER — CORE NARRATIVE & INVESTIGATION DATA MATRIX
 * 
 * Fictional Missing-Person Birthday Experience.
 * Contains editable placeholders for:
 * - Subject profile & humorous case briefing
 * - Real witness statements (Friends)
 * - Fictional suspects with ridiculous alibis & interrogations
 * - Interactive letters & envelopes
 * - Scrapbook pages with polaroids, tape, and handwritten notes
 * - Vintage audio recording evidence
 * - Personal quirks & cute investigator field notes
 * - The Final Clue Letter
 * - Act III: "Subject Found" scenic celebration & curated birthday gallery
 * 
 * NOTE: All personal details, names, and photos are clearly marked placeholders.
 */

export interface SubjectProfile {
  namePlaceholder: string;
  codename: string;
  caseNumber: string;
  status: string;
  threatLevel: string;
  lastSeenLocation: string;
  lastSeenDoing: string;
  distinguishingFeatures: string[];
  investigatorNotes: string[];
  primaryPhotoUrl: string;
  primaryPhotoWebp: string;
}

export interface WitnessProfile {
  id: string;
  name: string;
  relationship: string;
  avatarUrl: string;
  statement: string;
  keyClue: string;
  revealedEvidenceId?: string;
  locationMentioned: string;
  credibilityRating: string;
}

export interface SuspectProfile {
  id: string;
  codename: string;
  realName: string;
  aliasDescription: string;
  avatarUrl: string;
  suspiciousBehavior: string;
  ridiculousAlibi: string;
  interrogationTranscript: string;
  unlockedClue: string;
  isInterrogated?: boolean;
}

export interface ScrapbookPageData {
  id: string;
  pageNumber: number;
  chapterTitle: string;
  imageUrl: string;
  webpUrl?: string;
  photoDate: string;
  caption: string;
  handwrittenAnnotation: string;
  stickers: string[];
  tapeColor: string;
  rotationDegree: number;
}

export interface LetterData {
  id: string;
  title: string;
  sender: string;
  senderRole: string;
  envelopeColor: string;
  sealColor: string;
  sealText: string;
  unfoldedDate: string;
  previewSnippet: string;
  contentParagraphs: string[];
  investigatorAnnotation?: string;
  isFinalLetter?: boolean;
}

export interface AudioEvidenceItem {
  id: string;
  title: string;
  witnessIdentifier: string;
  durationString: string;
  durationSeconds: number;
  cassetteLabel: string;
  statusText: string;
  transcript: string;
  forensicObservation: string;
  isPlaceholderAudio: boolean;
}

export interface PersonalQuirkNote {
  id: string;
  color: 'yellow' | 'pink' | 'cyan' | 'green';
  title: string;
  content: string;
  annotation: string;
  pinColor: string;
  tiltDegree: number;
}

// ---------------------------------------------------------------------------
// 1. SUBJECT CASE PROFILE
// ---------------------------------------------------------------------------
export const SUBJECT_CASE_DATA: SubjectProfile = {
  namePlaceholder: "[HER NAME / THE BIRTHDAY GIRL]",
  codename: "SUBJECT 01 // OPERATION: FIND HER",
  caseNumber: "CASE NO. 012",
  status: "MISSING — LAST SEEN BEING UNNECESSARILY ADORABLE",
  threatLevel: "DEFCON 1 (WEAPONIZED CUTENESS)",
  lastSeenLocation: "Laughing at her own joke before finishing the punchline",
  lastSeenDoing: "Radiating warm energy and lighting up the entire room",
  distinguishingFeatures: [
    "A smile documented to cause spontaneous joy in a 50-meter radius.",
    "Weaponized, highly expressive eye rolls when teased.",
    "Uncontrollable giggle fits that make everyone around her start laughing.",
    "Physical inability to walk past any dog without making baby noises.",
    "An oversized heart that cares far too deeply about the people in her life."
  ],
  investigatorNotes: [
    "NOTE #1: Subject is not in any danger. In fact, evidence suggests she is being celebrated.",
    "NOTE #2: Several witnesses have reported sighting her near cozy cafes, bookstores, and scenic outlooks.",
    "NOTE #3: The investigator (YOU) has been officially deputized to piece together the clues."
  ],
  primaryPhotoUrl: "/images/evidence-photograph.jpg",
  primaryPhotoWebp: "/images/evidence-photograph.webp"
};

// ---------------------------------------------------------------------------
// 2. WITNESS PROFILES (FRIENDS)
// ---------------------------------------------------------------------------
export const WITNESS_PROFILES: WitnessProfile[] = [
  {
    id: "WITNESS-01",
    name: "[Friend #1: The Best Friend]",
    relationship: "Chief Confidante & Partner-in-Crime",
    avatarUrl: "/images/evidence-photograph.jpg",
    statement: "I swear she was right next to me five minutes ago! We were debating whether to get iced matcha or warm pastries, and the next second she vanished. If you find her, please tell her she still owes me a three-hour phone call about nothing in particular.",
    keyClue: "Recovered a handwritten coffee shop napkin with an arrow pointing toward the scenic hills.",
    locationMentioned: "The Corner Bakery & Coffee Haven",
    credibilityRating: "High (Except when defending her own snack theft)"
  },
  {
    id: "WITNESS-02",
    name: "[Friend #2: The Adventure Instigator]",
    relationship: "Travel & Roadtrip Accomplice",
    avatarUrl: "/images/evidence-dispatch.jpg",
    statement: "Look, if she's missing, she's definitely outside somewhere breathtaking with great lighting. She has a strict policy: never take the direct highway if there's a scenic detour with pretty trees.",
    keyClue: "Found a marked hiking map with coordinates circled in purple pen.",
    locationMentioned: "The Scenic Ridge Highway Overlook",
    credibilityRating: "Very High (She helped plan the route)"
  },
  {
    id: "WITNESS-03",
    name: "[Friend #3: The Group Chat Anchor]",
    relationship: "Emotional Support & Meme Specialist",
    avatarUrl: "/images/evidence-artefact.jpg",
    statement: "She was smiling that special, knowing smile she gets when she knows everyone is scheming a surprise for her. She pretends she doesn't know, but her eyes gave it away immediately.",
    keyClue: "A scribbled receipt on the back of which was written: 'See you at sunset.'",
    locationMentioned: "The Sunset Overlook Point",
    credibilityRating: "100% Reliable"
  }
];

// ---------------------------------------------------------------------------
// 3. FICTIONAL SUSPECTS (PLAYFUL & ABSURD)
// ---------------------------------------------------------------------------
export const SUSPECT_PROFILES: SuspectProfile[] = [
  {
    id: "SUSPECT-01",
    codename: "The Cozy Blanket Bandit",
    realName: "Professor Hibernation",
    aliasDescription: "Known to steal oversized fuzzy throws and disappear into couch cushions.",
    avatarUrl: "/images/evidence-artefact.jpg",
    suspiciousBehavior: "Was spotted loitering near her favorite reading chair carrying 4 extra blankets.",
    ridiculousAlibi: "I was asleep! I am always asleep! You cannot convict me of kidnapping when I haven't been vertically conscious since yesterday afternoon!",
    interrogationTranscript: "INVESTIGATOR: 'Did you lure the subject away with promises of an 11-hour nap?'\nSUSPECT: 'I offered her warm socks and chamomile tea! That is a public service, not a crime!'\nINVESTIGATOR: 'Where did she go afterwards?'\nSUSPECT: 'She took a Polaroid camera and headed for the observation summit!'",
    unlockedClue: "A discarded travel brochure to the Scenic Overlook found tucked into a wool throw blanket."
  },
  {
    id: "SUSPECT-02",
    codename: "The Snack Phantom",
    realName: "The Midnight Fridge Goblin",
    aliasDescription: "Infamous for stealing French fries while declaring 'I just want one bite.'",
    avatarUrl: "/images/evidence-dispatch.jpg",
    suspiciousBehavior: "Found with chocolate crumbs on their collar near the primary evidence locker.",
    ridiculousAlibi: "I don't even like pastries! Okay, that's a lie. But I was 20 miles away buying an emergency iced latte. I have witnesses!",
    interrogationTranscript: "INVESTIGATOR: 'We found your fingerprints on her favorite coffee mug.'\nSUSPECT: 'I was testing it for temperature integrity!'\nINVESTIGATOR: 'What was her last message to you?'\nSUSPECT: 'She said she was going somewhere where the sky turns gold at sunset.'",
    unlockedClue: "A bakery order receipt marked: 'Birthday Cake Delivery — Hold for the Grand Reveal.'"
  },
  {
    id: "SUSPECT-03",
    codename: "The Secret Celebration Architect",
    realName: "The Surprise Planner",
    aliasDescription: "Seen whispering in corners and hiding party decorations behind their back.",
    avatarUrl: "/images/evidence-photograph.jpg",
    suspiciousBehavior: "Aggressively checked their phone every 40 seconds with a suspicious grin.",
    ridiculousAlibi: "I was merely doing confidential detective research! I definitely wasn't coordinating a birthday surprise!",
    interrogationTranscript: "INVESTIGATOR: 'The jig is up. Who authorized Operation: Find Her?'\nSUSPECT: 'Everyone who loves her! You've solved the puzzle, investigator. Now go open the final letter!'",
    unlockedClue: "The gold seal key unlocking the Final Sealed Envelope."
  }
];

// ---------------------------------------------------------------------------
// 4. SCRAPBOOK PAGES (TACTILE MULTIPAGE MEMORY ALBUM)
// ---------------------------------------------------------------------------
export const SCRAPBOOK_PAGES: ScrapbookPageData[] = [
  {
    id: "SCRAP-01",
    pageNumber: 1,
    chapterTitle: "Chapter I — The Origins of Cute",
    imageUrl: "/images/evidence-photograph.jpg",
    webpUrl: "/images/evidence-photograph.webp",
    photoDate: "Archival Era // Early Days",
    caption: "Subject in her earliest documented moments: already mastering the delicate art of looking innocent while plotting something mischievous.",
    handwrittenAnnotation: "Forensic note: Subject has possessed weaponized charm since day one. No defense exists.",
    stickers: ["Vintage Star", "Golden Heart", "Pastel Washi Tape"],
    tapeColor: "#c5a059",
    rotationDegree: -1.5
  },
  {
    id: "SCRAP-02",
    pageNumber: 2,
    chapterTitle: "Chapter II — Scenic Detours & Wild Horizons",
    imageUrl: "/images/evidence-dispatch.jpg",
    webpUrl: "/images/evidence-dispatch.webp",
    photoDate: "The Wandering Years // Roadtrips",
    caption: "Caught in transit: Refusing to take the highway when there was a winding mountain road with wild flowers and pretty vistas.",
    handwrittenAnnotation: "Observation: 80% sunshine, 20% stubborn curiosity, 100% unforgettable.",
    stickers: ["Compass Rose", "Travel Stamp", "Vintage Ticket Stub"],
    tapeColor: "#71877c",
    rotationDegree: 2
  },
  {
    id: "SCRAP-03",
    pageNumber: 3,
    chapterTitle: "Chapter III — Unfiltered Smiles & Golden Hours",
    imageUrl: "/images/evidence-artefact.jpg",
    webpUrl: "/images/evidence-artefact.webp",
    photoDate: "Candid Moments // Endless Summers",
    caption: "Evidence of spontaneous laughter: zero posing, zero hesitation, pure radiance.",
    handwrittenAnnotation: "Warning: Direct exposure to subject's laughter may cause immediate happiness in all bystanders.",
    stickers: ["Pressed Daisy", "Heart Stamp", "Golden Border"],
    tapeColor: "#dfbf7a",
    rotationDegree: -2.5
  },
  {
    id: "SCRAP-04",
    pageNumber: 4,
    chapterTitle: "Chapter IV — The Ordinary Made Extraordinary",
    imageUrl: "/images/evidence-photograph.jpg",
    webpUrl: "/images/evidence-photograph.webp",
    photoDate: "Present Era // Daily Magic",
    caption: "The quiet magic: Cozy mornings, warm cups held with two hands, books, and late-night talks that make hours feel like minutes.",
    handwrittenAnnotation: "Final verdict: Life is simply better, warmer, and sweeter whenever she is around.",
    stickers: ["Wax Seal", "Floral Wreath", "Love Note"],
    tapeColor: "#991b1b",
    rotationDegree: 1.2
  }
];

// ---------------------------------------------------------------------------
// 5. INTERACTIVE LETTERS (ENVELOPES & FOLDED MANUSCRIPTS)
// ---------------------------------------------------------------------------
export const INTERACTIVE_LETTERS: LetterData[] = [
  {
    id: "LETTER-01",
    title: "Letter from the Inner Circle",
    sender: "[Her Best Friends]",
    senderRole: "Eye-Witness Allies",
    envelopeColor: "#162820",
    sealColor: "#c5a059",
    sealText: "FRIENDS",
    unfoldedDate: "CONFIDENTIAL DISPATCH // RECOVERED IN ARCHIVE",
    previewSnippet: "To the Investigator: If you are reading this, our operation is succeeding...",
    contentParagraphs: [
      "Dearest [Name],",
      "If the investigator has discovered this envelope, it means our search is reaching its destination. We wanted you to know how deeply you are appreciated by everyone in this circle.",
      "You are the one who listens when everyone else is distracted. You are the one who remembers the tiny things people say in passing. And you are the one who turns ordinary days into stories we laugh about for years.",
      "Even when you take 45 minutes to pick an outfit (which is every single time), we wouldn't change a single thing about you. Keep looking... the biggest surprise is waiting."
    ],
    investigatorAnnotation: "Field Note: High emotional resonance. The witnesses are clearly devoted to the subject."
  },
  {
    id: "LETTER-02",
    title: "Intercepted Suspect Confession",
    sender: "The Snack Phantom",
    senderRole: "Reformed Pastry Thief",
    envelopeColor: "#1a1e24",
    sealColor: "#881b1b",
    sealText: "CONFESSION",
    unfoldedDate: "EXHIBIT B-9 // EVIDENCE LOCKER",
    previewSnippet: "I admit nothing! Except that her laugh is completely contagious...",
    contentParagraphs: [
      "Official Confession Statement:",
      "I hereby confess that I am guilty of eating three of her fries last month. But more importantly, I confess that being around her makes it impossible to stay in a bad mood.",
      "She has this ridiculous, wonderful talent of making everyone around her feel safe and joyful. You can't stay grumpy when she smiles at you like you just told the funniest joke in the world.",
      "If you locate her at the scenic overlook, please make sure she gets a huge slice of birthday cake immediately."
    ],
    investigatorAnnotation: "Forensic Note: Even the suspects have surrendered to her charm."
  },
  {
    id: "LETTER-03",
    title: "The Investigator's Field Ledger",
    sender: "Lead Investigator",
    senderRole: "Special Agent on Case 012",
    envelopeColor: "#122019",
    sealColor: "#dfbf7a",
    sealText: "DOSSIER",
    unfoldedDate: "OFFICIAL DISPATCH // SUMMARY RECORD",
    previewSnippet: "Subject Behavioral Matrix: Why this case is unlike any other...",
    contentParagraphs: [
      "INVESTIGATOR'S PERSONAL FIELD NOTES:",
      "Subject Profile: A rare individual who carries more warmth, empathy, and joy than should legally fit in one human being.",
      "Documented Habits: She laughs with her entire face. She notices when someone is quiet in a room. She makes ordinary moments feel cinematic.",
      "Conclusion: We didn't launch Operation: Find Her because she was lost. We launched it because she deserves to be celebrated like the miracle she is."
    ],
    investigatorAnnotation: "Verified & Approved by the Investigative Committee."
  },
  {
    id: "LETTER-FINAL",
    title: "THE FINAL CLUE: THE SEALED LETTER",
    sender: "With All Our Love",
    senderRole: "The Grand Birthday Dedication",
    envelopeColor: "#221a12",
    sealColor: "#d4af37",
    sealText: "HER",
    unfoldedDate: "TO BE OPENED ONLY WHEN ALL CLUES ARE GATHERED",
    previewSnippet: "We were looking for someone. But with every clue, we discovered something else...",
    contentParagraphs: [
      "CASE CONCLUSION // FINAL REPORT",
      "We started this investigation with a playful missing-person case file. We collected the photographs, interrogated the suspects, examined the scrapbooks, and gathered the witness statements.",
      "But with every single photograph, every little message, and every silly clue... we discovered something so much bigger.",
      "We discovered how deeply you are loved. How your laugh can turn any gloomy Tuesday into an unforgettable memory. And how everyone in your life was searching for you not because you were gone—but because life is simply brighter whenever you are there.",
      "The final coordinates lead to a scenic overlook of golden light, open skies, and quiet beauty. The search is over. She is waiting for you there."
    ],
    investigatorAnnotation: "STATUS: PROCEED TO SCENIC REUNION // SUBJECT FOUND",
    isFinalLetter: true
  }
];

// ---------------------------------------------------------------------------
// 6. AUDIO EVIDENCE RECORDINGS (VINTAGE TAPE DECK)
// ---------------------------------------------------------------------------
export const AUDIO_EVIDENCE_ITEMS: AudioEvidenceItem[] = [
  {
    id: "AUDIO-01",
    title: "TAPE 01: The Best Friend's Voicemail",
    witnessIdentifier: "Witness #01 (The Partner-in-Crime)",
    durationString: "0:38",
    durationSeconds: 38,
    cassetteLabel: "CASE-012 // VOICEMAIL RECOVERY",
    statusText: "VINTAGE CASSETTE LOADED [DEMO SYNTHESIZED AUDIO]",
    transcript: "Hey! If this is the investigator... yes, she was here! She had that enormous, radiant smile on her face and kept talking about how excited she was for today. She had a basket of pastries and said she was meeting everyone at the scenic lookout. Stop interrogating suspects and go find her already!",
    forensicObservation: "Audio analysis confirms genuine affection and unmistakable background coffee shop ambiance.",
    isPlaceholderAudio: true
  },
  {
    id: "AUDIO-02",
    title: "TAPE 02: Ambient Surveillance — The Laughter Frequency",
    witnessIdentifier: "Subject & Friends Field Recording",
    durationString: "0:25",
    durationSeconds: 25,
    cassetteLabel: "CASE-012 // FREQUENCY SWEEP",
    statusText: "VINTAGE CASSETTE LOADED [DEMO SYNTHESIZED AUDIO]",
    transcript: "[Sound of wind blowing over a scenic overlook, followed by distant giggles and the subject's unmistakable, joyous laugh as friends cheer in the background: 'Happy Birthday!']",
    forensicObservation: "Decibel levels of pure happiness peak beyond safe scientific thresholds.",
    isPlaceholderAudio: true
  }
];

// ---------------------------------------------------------------------------
// 7. PERSONAL QUIRKS & PINNED NOTES (STICKY NOTES)
// ---------------------------------------------------------------------------
export const PERSONAL_QUIRK_NOTES: PersonalQuirkNote[] = [
  {
    id: "NOTE-01",
    color: "yellow",
    title: "CLUE #1: The Dog Reflex",
    content: "Physical inability to pass within 10 feet of a golden retriever without making high-pitched baby noises and asking 'whose good boy is that?!'",
    annotation: "Documented 14 times this week alone.",
    pinColor: "#991b1b",
    tiltDegree: -2.5
  },
  {
    id: "NOTE-02",
    color: "pink",
    title: "CLUE #2: The Coffee Order",
    content: "Her coffee order has more specific qualifiers than a NASA launch checklist: oat milk, half sweet, extra hot, exactly 2 ice cubes if iced.",
    annotation: "Baristas know her name by heart.",
    pinColor: "#c5a059",
    tiltDegree: 3
  },
  {
    id: "NOTE-03",
    color: "cyan",
    title: "CLUE #3: The Contagious Giggle",
    content: "Has been known to laugh so hard at her own joke that she cannot physically finish telling it, causing everyone else to laugh at her laughing.",
    annotation: "100% infection rate in room.",
    pinColor: "#2f5442",
    tiltDegree: -1.8
  },
  {
    id: "NOTE-04",
    color: "green",
    title: "CLUE #4: The Heart of Gold",
    content: "Will text you 3 hours after you mentioned having a headache just to check if you drank water and took medicine.",
    annotation: "Genuinely, impossibly sweet.",
    pinColor: "#8e7137",
    tiltDegree: 2.2
  }
];

// ---------------------------------------------------------------------------
// 8. ACT III: "SUBJECT FOUND" FINAL BIRTHDAY REVELATION & CURATED GALLERY
// ---------------------------------------------------------------------------
export interface CuratedGalleryPhoto {
  id: string;
  title: string;
  category: 'adventures' | 'candids' | 'moments';
  date: string;
  imageUrl: string;
  webpUrl?: string;
  caption: string;
  heartfeltNote: string;
  location: string;
}

export const SUBJECT_FOUND_DATA = {
  heroTitle: "SUBJECT FOUND.",
  heroSubtitle: "At the Scenic Lookout // Bathed in Golden Light",
  heroImage: "/images/evidence-photograph.jpg",
  heroImageWebp: "/images/evidence-photograph.webp",
  birthdayCelebrationHeadline: "HAPPY BIRTHDAY, YOU EXTRAORDINARY HUMAN!",
  birthdayParagraphs: [
    "The investigation is officially closed. You were never really missing—we just needed an adventure grand enough to celebrate everything that makes you so completely unforgettable.",
    "Thank you for being the person who brings kindness into stressful days, warmth into quiet evenings, and uncontrollable laughter into every single adventure.",
    "May this upcoming year be filled with scenic mountain roads, warm coffee mornings, sweet surprises, and all the love your big heart can hold."
  ],
  galleryCollections: [
    {
      id: "adventures",
      title: "Adventures & Roadtrips",
      description: "Scenic overlooks, windy highways, and places that took our breath away."
    },
    {
      id: "candids",
      title: "Unfiltered Smiles & Giggles",
      description: "Zero staging, pure happiness, and that laugh we love so much."
    },
    {
      id: "moments",
      title: "The Little Magic Moments",
      description: "Cozy days, warm conversations, and the quiet beauty of ordinary days with you."
    }
  ],
  photos: [
    {
      id: "FOUND-01",
      title: "The Summit Viewpoint",
      category: "adventures",
      date: "Golden Hour // Overlook Point",
      imageUrl: "/images/evidence-photograph.jpg",
      webpUrl: "/images/evidence-photograph.webp",
      caption: "Standing at the edge of the world, where the sky meets the sea.",
      heartfeltNote: "You make every destination feel twice as beautiful.",
      location: "The Maritime Bluff"
    },
    {
      id: "FOUND-02",
      title: "The Dispatches of Friendship",
      category: "moments",
      date: "Late Evening Talks",
      imageUrl: "/images/evidence-dispatch.jpg",
      webpUrl: "/images/evidence-dispatch.webp",
      caption: "A keepsake note sealed in friendship and memories that never fade.",
      heartfeltNote: "Every word written with so much genuine love for you.",
      location: "The Coffee Archive"
    },
    {
      id: "FOUND-03",
      title: "The Compass of Tomorrow",
      category: "candids",
      date: "Celebration Converged",
      imageUrl: "/images/evidence-artefact.jpg",
      webpUrl: "/images/evidence-artefact.webp",
      caption: "Pointing directly toward another incredible year of your life.",
      heartfeltNote: "Here is to you, today and every single day.",
      location: "The Celebration Circle"
    }
  ] as CuratedGalleryPhoto[]
};
