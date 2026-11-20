export interface EvidenceItem {
  id: string;
  code: string;
  title: string;
  classification: string;
  dateDiscovered: string;
  origin: string;
  type: 'photograph' | 'document' | 'artefact';
  summary: string;
  forensicNotes: string[];
  dimensions?: string;
  material?: string;
  confidenceScore: number;
  imageUrl: string;
  webpUrl?: string;
  anomalies: string[];
}

export interface CaseDossier {
  caseNumber: string;
  caseTitle: string;
  securityClassification: string;
  assignmentDate: string;
  leadInvestigator: string;
  status: 'ACTIVE' | 'ARCHIVED' | 'CLASSIFIED';
  subject: string;
  directive: string;
  specialInstructions: string[];
  evidenceIds: string[];
}

export interface SoundSettings {
  soundEnabled: boolean;
  masterVolume: number;
}
