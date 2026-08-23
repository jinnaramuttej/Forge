import { generateObject } from 'ai';
import { getModel } from '../model';
import { z } from 'zod';
import { supabase } from '../supabase';

const serperApiKey = process.env.SERPER_API_KEY;

export async function findCandidatesStep(role: string, location: string, jobId: string): Promise<void> {
  console.log(`[hiring] finding candidates for ${role} in ${location}`);

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
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ q: query, num: 10 })
    });

    if (!searchRes.ok) {
      console.error(`[hiring] Serper API error: ${searchRes.status} ${searchRes.statusText}`);
      return;
    }

    const searchData = await searchRes.json();
    const organicResults = searchData.organic || [];

    if (organicResults.length === 0) {
      console.log('[hiring] No candidates found via Serper.');
      return;
    }

    // Limit to top 3 results to extract
    const topResults = organicResults.slice(0, 3);
    const snippetsContext = topResults.map((r: any, idx: number) => `Candidate ${idx+1}:\nTitle: ${r.title}\nSnippet: ${r.snippet}\nLink: ${r.link}`).join('\n\n');

    console.log('[hiring] parsing Serper results with LLM to build candidates');

    const schema = z.object({
      candidates: z.array(z.object({
        name: z.string().describe('The name of the candidate'),
        experience: z.string().describe('Estimate years of experience, e.g. "5 yrs exp"'),
        skills: z.array(z.string()).describe('List of 3-5 key skills inferred from the snippet'),
        match_score: z.number().describe('A match score between 80 and 99'),
        match_reason: z.string().describe('A short 1-2 sentence reason why they are a fit for the role'),
        current_company: z.string().describe('Their current or most recent company from the snippet'),
        education: z.string().describe('Inferred or plausible education background, e.g. "B.S. CS"'),
        notes: z.string().describe('A short note for the recruiter or founder')
      }))
    });

    const prompt = `You are a technical recruiter. Review the following LinkedIn search snippets for a ${role} in ${location}.
Extract details for up to 3 candidates. If the snippet doesn't contain a detail (like education), invent a plausible one that fits the profile.

Search Snippets:
${snippetsContext}`;

    const { object } = await generateObject({
      model: getModel(),
      schema,
      prompt,
    });

    const candidatesToInsert = object.candidates.map((c, index) => {
      // Map stages randomly across typical stages for variety
      const stages = ['new', 'screening', 'interview'];
      const stage = stages[index % stages.length];
      
      return {
        id: `cand-${jobId.slice(0, 8)}-${index}`,
        name: c.name.split(' - ')[0] || c.name, // clean up name if title is appended
        role_id: jobId,
        role_title: role,
        stage: stage,
        experience: c.experience,
        skills: c.skills,
        match_score: c.match_score,
        match_reason: c.match_reason,
        last_activity: 'Just now',
        rating: c.match_score > 92 ? 'Top Recommendation' : 'Strong Fit',
        current_company: c.current_company,
        education: c.education,
        notes: c.notes,
      };
    });

    const { error } = await supabase
      .from('candidates')
      .insert(candidatesToInsert);

    if (error) {
      console.error('[hiring] Error inserting candidates into db:', error);
    } else {
      console.log(`[hiring] Successfully inserted ${candidatesToInsert.length} candidates for job ${jobId}`);
    }

  } catch (err) {
    console.error('[hiring] ERROR in candidate serper fetch:', err);
  }
}
