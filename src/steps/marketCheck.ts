import { callQwen } from '../lib/ollama';

export async function marketCheckStep(role: string, location: string, budget: string): Promise<{
  summary: string;
  position: 'below' | 'at' | 'above' | 'unknown';
}> {
  console.log('[hiring] calling market check for role:', role, 'location:', location, 'budget:', budget);
  const serperApiKey = process.env.SERPER_API_KEY;
  const query = `${role} salary ${location} India monthly`;

  if (!serperApiKey) {
    console.warn('SERPER_API_KEY is not set. Skipping market check search.');
    return { summary: 'Market data unavailable (missing search API key).', position: 'unknown' };
  }

  let snippets: string[] = [];
  try {
    console.log('[hiring] making Serper request:', query);
    const searchRes = await fetch('https://google.serper.dev/search', {
      method: 'POST',
      headers: {
        'X-API-KEY': serperApiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ q: query, num: 3 })
    });

    if (searchRes.ok) {
      console.log('[hiring] serper response status:', searchRes.status);
      const searchData = await searchRes.json();
      console.log('[hiring] serper raw response:', JSON.stringify(searchData).slice(0, 500));
      const organic = searchData.organic || [];
      snippets = organic.slice(0, 3).map((r: any) => r.snippet).filter(Boolean);
    } else {
      console.error(`[hiring] Serper API error: ${searchRes.status} ${searchRes.statusText}`);
    }
  } catch (err) {
    console.error('[hiring] ERROR in market check serper fetch:', err);
  }

  const searchContext = snippets.length > 0 
    ? snippets.join('\n\n') 
    : 'No search results found for this query.';

  const systemPrompt = `You are a compensation analyst. 
Based on the provided search results and the company's budget, extract a rough monthly salary range. 
Then, compare the company's budget to this range and determine if the budget is 'below', 'at', or 'above' market rate.
You must return your response STRICTLY as a JSON object with this exact format:
{
  "range_estimate": "Extracted range (e.g. 50k-80k INR)",
  "position": "below" | "at" | "above",
  "summary": "A 1-2 sentence summary of the market rate."
}
Do not include any markdown blocks, backticks, or any other text outside the JSON object.`;

  const prompt = `Role: ${role}\nLocation: ${location}\nCompany Budget: ${budget}\n\nSearch Results for "${query}":\n\n${searchContext}`;

  try {
    const qwenResponse = await callQwen(prompt, systemPrompt);
    console.log('[hiring] qwen raw output:', qwenResponse);
    
    // Gracefully handle potential markdown wrapping (e.g., ```json ... ```)
    const jsonStr = qwenResponse.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(jsonStr);

    return {
      summary: parsed.summary || 'Summary unavailable',
      position: parsed.position || 'unknown'
    };
  } catch (err) {
    console.error('[hiring] ERROR in market check qwen processing:', err);
    return {
      summary: 'Failed to process market data.',
      position: 'unknown'
    };
  }
}
