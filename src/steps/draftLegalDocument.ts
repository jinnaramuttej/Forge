import { callQwen } from '../lib/ollama';
import { appendLegalDisclaimer } from '../lib/disclaimer';

export async function draftLegalDocumentStep(
  documentType: string,
  details: any,
  research: { summary: string; key_requirements: string[] }
): Promise<string> {
  console.log('[legal] entering draftLegalDocumentStep for:', documentType);
  console.log('[legal] research context being passed:', JSON.stringify(research));
  console.log('[legal] details context being passed:', JSON.stringify(details));

  const systemPrompt = `You are an expert Indian corporate lawyer.
Your task is to draft a professional ${documentType} incorporating the provided statutory requirements and specific details.
Write the document in standard Indian contract/document format with clear section headers.
You must explicitly incorporate the following legal requirements into the draft:
- ${research.key_requirements.join('\n- ')}

IMPORTANT: DO NOT include any legal disclaimers, waivers of liability, or "this is not legal advice" statements anywhere in your response. The system will append the official legal disclaimer automatically at the code level. Your ONLY job is to draft the core document content.
Output the raw text of the document in markdown format.`;

  const prompt = `Document Type: ${documentType}\n\nSpecific Details:\n${JSON.stringify(details, null, 2)}\n\nStatutory Summary:\n${research.summary}\n\nPlease draft the full document now.`;

  try {
    const qwenOutput = await callQwen(prompt, systemPrompt);
    console.log('[legal] qwen raw output (before disclaimer):', qwenOutput.slice(0, 500) + '...');
    
    const finalDocument = appendLegalDisclaimer(qwenOutput);
    console.log('[legal] successfully appended legal disclaimer.');
    
    return finalDocument;
  } catch (err) {
    console.error('[legal] ERROR in drafting document qwen processing:', err);
    throw new Error('Failed to generate legal document draft');
  }
}
