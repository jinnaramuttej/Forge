import { callQwen } from '../lib/ollama';

export async function marketCheckStep(role: string, location: string): Promise<{
  summary: string;
  position: 'below' | 'at' | 'above' | 'unknown';
}> {
  const serperApiKey = process.env.SERPER_API_KEY;
  const query = `${role} salary ${location} India monthly`;

  if (!serperApiKey) {
    console.warn('SERPER_API_KEY is not set. Skipping market check search.');
    return { summary: 'Market data unavailable (missing search API key).', position: 'unknown' };
  }

  let snippets: string[] = [];
  try {
    const searchRes = await fetch('https://google.serper.dev/search', {
      method: 'POST',
      headers: {
        'X-API-KEY': serperApiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ q: query, num: 3 })
    });

    if (searchRes.ok) {
      const searchData = await searchRes.json();
      const organic = searchData.organic || [];
      snippets = organic.slice(0, 3).map((r: any) => r.snippet).filter(Boolean);
    } else {
      console.error(`Serper API error: ${searchRes.status} ${searchRes.statusText}`);
    }
  } catch (err) {
    console.error('Error during web search:', err);
  }

  const searchContext = snippets.length > 0 
    ? snippets.join('\n\n') 
    : 'No search results found for this query.';

  const systemPrompt = `You are a compensation analyst. 
Based on the provided search results, extract a rough monthly salary range. 
You must return your response STRICTLY as a JSON object with this exact format:
{
  "range_estimate": "Extracted range (e.g. 50k-80k INR)",
  "summary": "A 1-2 sentence summary of the market rate."
}
Do not include any markdown blocks, backticks, or any other text outside the JSON object.`;

  const prompt = `Search Results for "${query}":\n\n${searchContext}`;

  try {
    const qwenResponse = await callQwen(prompt, systemPrompt);
    
    // Gracefully handle potential markdown wrapping (e.g., ```json ... ```)
    const jsonStr = qwenResponse.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(jsonStr);

    return {
      summary: parsed.summary || 'Summary unavailable',
      position: 'unknown' // Budget is not available in the parameters to determine 'below' | 'at' | 'above'
    };
  } catch (err) {
    console.error('Failed to parse Qwen JSON response or call Qwen:', err);
    return {
      summary: 'Failed to process market data.',
      position: 'unknown'
    };
  }
}
