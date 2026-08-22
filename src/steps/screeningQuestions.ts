import { callQwen } from '../lib/ollama';

export interface MarketDataShort {
  position: 'below' | 'at' | 'above' | 'unknown';
}

export async function screeningQuestionsStep(
  role: string,
  marketData: MarketDataShort,
  jdContent: string
): Promise<string[]> {
  console.log('[hiring] calling screening questions for role:', role);
  const motivationPrompt = marketData.position === 'below'
    ? "\nCRITICAL REQUIREMENT: Since the budget for this role is 'below' market rate, you MUST include at least one question explicitly probing the candidate's motivation, retention risk, and alignment with non-monetary perks (such as growth, learning, flexibility)."
    : "";

  const systemPrompt = `You are an expert technical recruiter.
Based on the provided Role and Job Description (JD), generate EXACTLY 5 screening questions to ask candidates during an initial phone screen.${motivationPrompt}

Output your response STRICTLY as a JSON array of 5 strings. 
Do not include any other text, markdown blocks (like \`\`\`json), or conversational filler.
Format Example:
[
  "Question 1?",
  "Question 2?",
  "Question 3?",
  "Question 4?",
  "Question 5?"
]`;

  const prompt = `Role: ${role}\n\nJob Description:\n${jdContent}`;

  const makeAttempt = async (): Promise<string[]> => {
    const qwenResponse = await callQwen(prompt, systemPrompt);
    console.log('[hiring] screening questions qwen raw output:', qwenResponse);
    
    // Clean up potential markdown formatting
    const jsonStr = qwenResponse.replace(/```json/g, '').replace(/```/g, '').trim();
    
    let parsed: any;
    try {
      parsed = JSON.parse(jsonStr);
    } catch (err) {
      throw new Error(`Failed to parse JSON: ${(err as Error).message}`);
    }
    
    if (!Array.isArray(parsed)) {
      throw new Error('Response is not a JSON array.');
    }
    
    if (parsed.length !== 5) {
      throw new Error(`Expected exactly 5 questions, but got ${parsed.length}.`);
    }

    if (!parsed.every(q => typeof q === 'string')) {
      throw new Error('All items in the array must be strings.');
    }

    return parsed as string[];
  };

  try {
    return await makeAttempt();
  } catch (error) {
    console.error('[hiring] ERROR in screening questions (attempt 1):', error);
    console.warn('[hiring] screeningQuestionsStep: Validation failed on first attempt, retrying once...', (error as Error).message);
    // Retry once if validation or JSON parsing fails
    try {
      return await makeAttempt();
    } catch (err2) {
      console.error('[hiring] ERROR in screening questions (attempt 2):', err2);
      throw err2;
    }
  }
}
