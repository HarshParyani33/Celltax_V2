/**
 * Investigation clearance designations for the fictional client-side narrative gate.
 * This is an interactive storytelling experience; client-side validation only.
 */
export const ACCEPTED_CLEARANCE_CODES = [
  "EXTRAORDINARY",
  "012",
  "CASE012",
  "CASE 012",
  "CONFIDENTIAL",
  "ARCHIVE",
  "AGENT",
  "DIRECTIVE12",
  "INVESTIGATOR",
  "OPEN",
  "START",
  "FINDHER",
  "FIND HER",
  "HER",
  "BIRTHDAY",
  "OPERATION",
] as const;

export type ClearanceCode = typeof ACCEPTED_CLEARANCE_CODES[number];

/**
 * Pure function to validate clearance credential inputs.
 * Normalizes input by trimming whitespace and converting to uppercase.
 */
export function validateClearanceCode(input: string | null | undefined): boolean {
  if (!input || typeof input !== 'string') return false;
  const normalized = input.trim().toUpperCase();
  return (ACCEPTED_CLEARANCE_CODES as readonly string[]).includes(normalized);
}
