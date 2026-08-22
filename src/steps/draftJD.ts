import { callQwen } from '../lib/ollama';

export interface JobInput {
  role: string;
  business_type: string;
  budget: string;
  location: string;
  work_mode: string;
}

export interface MarketData {
  summary: string;
  position: 'below' | 'at' | 'above' | 'unknown';
}

export async function draftJDStep(input: JobInput, marketData: MarketData): Promise<string> {
  console.log('[hiring] calling draft JD for role:', input.role, 'with marketData:', marketData);
  const toneAdjustment = marketData.position === 'below'
    ? "Since our budget is 'below' market rate, aggressively emphasize flexibility, learning opportunities, growth potential, and non-monetary perks. Frame this as a high-growth opportunity for ambitious individuals."
    : "Use a standard, professional framing highlighting our competitive compensation, strong company stability, and solid career path.";

  const systemPrompt = `You are an expert technical recruiter and copywriter.
Your task is to write a compelling Job Description (JD) based on the provided requirements and market context.

Market Context:
- Market Rate Summary: ${marketData.summary}
- Our Budget Position Relative to Market: ${marketData.position}

Instructions:
1. Write a professional, well-structured JD in Markdown format.
2. Include standard sections: About the Role, Responsibilities, Requirements, and Perks/Benefits.
3. ADAPT YOUR TONE AND FRAMING based on the budget position:
   - ${toneAdjustment}
4. Output ONLY the Job Description markdown. Do not include any meta-commentary or conversational filler.`;

  const prompt = `Please draft a Job Description for the following position:
- Role: ${input.role}
- Business Type: ${input.business_type}
- Budget: ${input.budget}
- Location: ${input.location}
- Work Mode: ${input.work_mode}`;

  try {
    const jdContent = await callQwen(prompt, systemPrompt);
    console.log('[hiring] draftJD qwen raw output:', jdContent);
    return jdContent.trim();
  } catch (error) {
    console.error('[hiring] ERROR in draft JD processing:', error);
    throw new Error('Failed to generate Job Description');
  }
}
