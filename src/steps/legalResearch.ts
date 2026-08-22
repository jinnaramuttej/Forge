import { callQwen } from '../lib/ollama';

export async function legalResearchStep(documentType: string, details: any, location: string): Promise<{
  summary: string;
  key_requirements: string[];
}> {
  console.log('[legal] calling legal research for document:', documentType, 'location:', location);
  
  let query = `${documentType} India statutory requirements ${location}`;
  if (documentType === 'offer_letter') {
    query = `employment offer letter India mandatory clauses ${location}`;
  } else if (documentType === 'nda') {
    query = `NDA confidentiality agreement India enforceability requirements`;
  }

  console.log('[legal] making Serper request for query:', query);
  
  const serperApiKey = process.env.SERPER_API_KEY;
  let snippets: string[] = [];

  try {
    const searchRes = await fetch('https://google.serper.dev/search', {
      method: 'POST',
      headers: {
        'X-API-KEY': serperApiKey || '',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ q: query, num: 3 })
    });

    if (searchRes.ok) {
      console.log('[legal] serper response status:', searchRes.status);
      const searchData = await searchRes.json();
      console.log('[legal] serper raw response:', JSON.stringify(searchData).slice(0, 500));
      const organic = searchData.organic || [];
      snippets = organic.slice(0, 3).map((r: any) => r.snippet).filter(Boolean);
    } else {
      console.error(`[legal] Serper API error: ${searchRes.status} ${searchRes.statusText}`);
    }
  } catch (err) {
    console.error('[legal] ERROR in legal research serper fetch:', err);
  }

  const searchContext = snippets.length > 0 
    ? snippets.join('\n\n')
    : 'No search results found for this query.';

  const systemPrompt = `You are an expert Indian corporate lawyer.
Based on the provided search results and the document context, extract a summary of the statutory requirements and a list of 3-5 key legal requirements or standard clauses this document type must include to be legally compliant in India.
You must return your response STRICTLY as a JSON object with this exact format:
{
  "summary": "A 1-2 sentence summary of the legal requirements.",
  "key_requirements": ["Clause 1", "Clause 2", "Clause 3"]
}
Do not include any markdown blocks, backticks, or any other text outside the JSON object.`;

  const prompt = `Document Type: ${documentType}\nLocation: ${location}\nContext: ${JSON.stringify(details)}\n\nSearch Results for "${query}":\n\n${searchContext}`;

  try {
    const qwenResponse = await callQwen(prompt, systemPrompt);
    console.log('[legal] qwen raw output:', qwenResponse);
    
    // Gracefully handle potential markdown wrapping (e.g., \`\`\`json ... \`\`\`)
    const jsonStr = qwenResponse.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(jsonStr);

    return {
      summary: parsed.summary || 'Summary unavailable',
      key_requirements: Array.isArray(parsed.key_requirements) ? parsed.key_requirements : []
    };
  } catch (err) {
    console.error('[legal] ERROR in legal research qwen processing:', err);
    return {
      summary: 'Failed to process legal research data.',
      key_requirements: []
    };
  }
}
