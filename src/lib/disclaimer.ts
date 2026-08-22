export const LEGAL_DISCLAIMER = `---
This is an AI-generated draft for reference only. It is not legal advice and has not been reviewed by a lawyer. Consult a qualified professional before using this document.`;

export function appendLegalDisclaimer(draftContent: string): string {
  if (!draftContent) return LEGAL_DISCLAIMER;
  return `${draftContent.trim()}\n\n${LEGAL_DISCLAIMER}`;
}
