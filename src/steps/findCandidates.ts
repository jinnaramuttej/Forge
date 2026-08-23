import { callQwen } from '../lib/ollama';
import { supabase } from '../supabase';

export async function findCandidatesStep(role: string, location: string, jobId: string): Promise<void> {
  console.log(`[hiring] finding candidates for ${role} in ${location}`);

  const serperApiKey = process.env.SERPER_API_KEY;
  if (!serperApiKey) {
    console.warn('SERPER_API_KEY is not set. Skipping candidate search.');
    return;
  }

  const query = `"${role}" "${location}" site:linkedin.com/in`;
  console.log('[hiring] making Serper request for candidates:', query);

  try {
    const searchRes = await fetch('https://google.serper.dev/search', {
      method: 'POST',
      headers: {
        'X-API-KEY': serperApiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ q: query, num: 10 }),
    });

    if (!searchRes.ok) {
      console.error(`[hiring] Serper API error: ${searchRes.status} ${searchRes.statusText}`);
      return;
    }

    const searchData = await searchRes.json();
    const organicResults: any[] = searchData.organic || [];

    if (organicResults.length === 0) {
      console.log('[hiring] No candidates found via Serper.');
      return;
    }

    // Limit to top 3 results
    const topResults = organicResults.slice(0, 3);
    const snippetsContext = topResults
      .map((r: any, idx: number) => `Candidate ${idx + 1}:\nTitle: ${r.title}\nSnippet: ${r.snippet}\nLink: ${r.link}`)
      .join('\n\n');

    console.log('[hiring] parsing Serper results with LLM to build candidates');

    const prompt = `You are a technical recruiter. Review these LinkedIn search snippets for a ${role} in ${location}.

${snippetsContext}

For each snippet, extract the candidate as a JSON object with these fields:
- name (string): just the person's full name from the LinkedIn title
- experience (string): estimated years of experience e.g. "5 yrs exp"  
- skills (array of strings): 3-5 key skills inferred from the snippet
- match_score (number): match score between 80 and 99
- match_reason (string): 1-2 sentences why they fit the ${role} role
- current_company (string): their current/most recent company
- education (string): inferred education e.g. "B.S. CS, IIT Hyderabad"
- notes (string): a short recruiter note

Return a valid JSON array with up to 3 candidate objects. No markdown, no code fences, just raw JSON array.`;

    const rawText = await callQwen(prompt);

    let parsedCandidates: any[] = [];
    try {
      // Extract JSON array from the response
      const match = rawText.match(/\[[\s\S]*\]/);
      if (match) {
        parsedCandidates = JSON.parse(match[0]);
      }
    } catch (parseErr) {
      console.error('[hiring] Failed to parse LLM candidate JSON:', parseErr);
      return;
    }

    if (!Array.isArray(parsedCandidates) || parsedCandidates.length === 0) {
      console.log('[hiring] LLM returned no usable candidates');
      return;
    }

    const stages = ['new', 'screening', 'interview'];
    const candidatesToInsert = parsedCandidates.slice(0, 3).map((c: any, index: number) => ({
      id: `cand-${jobId.slice(0, 8)}-${index}`,
      name: (c.name || `Candidate ${index + 1}`).split(' - ')[0],
      role_id: jobId,
      role_title: role,
      stage: stages[index % stages.length],
      experience: c.experience || 'Unknown',
      skills: Array.isArray(c.skills) ? c.skills : [],
      match_score: typeof c.match_score === 'number' ? c.match_score : 85,
      match_reason: c.match_reason || 'Sourced from LinkedIn via Serper.',
      last_activity: 'Just now',
      rating: (c.match_score || 85) > 92 ? 'Top Recommendation' : 'Strong Fit',
      current_company: c.current_company || 'Unknown',
      education: c.education || 'B.S. Computer Science',
      notes: c.notes || '',
    }));

    const { error } = await supabase.from('candidates').insert(candidatesToInsert);

    if (error) {
      console.error('[hiring] Error inserting candidates into db:', error);
    } else {
      console.log(`[hiring] Successfully inserted ${candidatesToInsert.length} candidates for job ${jobId}`);
    }
  } catch (err) {
    console.error('[hiring] ERROR in findCandidatesStep:', err);
  }
}
