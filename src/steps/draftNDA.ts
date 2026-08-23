import { callQwen } from '../lib/ollama';

export async function draftNDAStep(role: string, businessType: string): Promise<string> {
  console.log(`[hiring] drafting NDA for ${role} at ${businessType}`);

  const prompt = `You are a high-end corporate lawyer. Draft a standard Mutual Non-Disclosure Agreement (NDA) for a prospective candidate interviewing for the position of "${role}" at a "${businessType}" business.

The NDA should be professional, standard Delaware jurisdiction (or general), and include clauses for:
1. Definition of Confidential Information
2. Obligations of the Candidate (Receiving Party)
3. Return of Materials
4. No Obligation to Hire
5. Term and Governing Law

Output the NDA in clear plain text format. Make it concise but legally sound (around 300-500 words). Do not include placeholders like "[Company Name]", instead use "the Company".`;

  const result = await callQwen(prompt);
  return result;
}
