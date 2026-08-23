const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

/**
 * Try Groq first, then OpenRouter, then Ollama
 */
export async function generateWithGroq(prompt, systemPrompt = 'You are a helpful AI marketing assistant.') {
  // Try Groq first
  if (GROQ_API_KEY) {
    try {
      console.log('[AI] Trying Groq API...');
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('[AI] Groq success!');
        return data.choices[0].message.content;
      }
      
      const errText = await response.text();
      console.warn('[AI] Groq failed:', response.status, errText);
    } catch (error) {
      console.warn('[AI] Groq network error:', error.message);
    }
  } else {
    console.warn('[AI] No Groq key found');
  }

  // Try OpenRouter as fallback
  if (OPENROUTER_API_KEY) {
    try {
      console.log('[AI] Trying OpenRouter...');
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-3.1-8b-instruct:free',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('[AI] OpenRouter success!');
        return data.choices[0].message.content;
      }
      
      const errText = await response.text();
      console.warn('[AI] OpenRouter failed:', response.status, errText);
    } catch (error) {
      console.warn('[AI] OpenRouter network error:', error.message);
    }
  }

  // Try Ollama last
  return fallbackToOllama(prompt, systemPrompt);
}

/**
 * Fallback to local Ollama if everything else fails
 */
async function fallbackToOllama(prompt, systemPrompt) {
  try {
    console.log('[AI] Trying local Ollama...');
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3',
        prompt: `${systemPrompt}\n\nUser: ${prompt}`,
        stream: false
      })
    });
    
    if (!response.ok) throw new Error("Ollama not running");
    const data = await response.json();
    console.log('[AI] Ollama success!');
    return data.response;
  } catch (err) {
    console.error('[AI] All AI providers failed. Ollama error:', err.message);
    return "Error: Could not connect to any AI provider (Groq, OpenRouter, or local Ollama).";
  }
}

/**
 * Generate Caption specific logic
 */
export async function generateCaptionText(campaign, platform, tone, length) {
  const prompt = `Write a ${length} length social media caption for a campaign named "${campaign}" targeting ${platform}. The tone should be ${tone}. Include 5 relevant hashtags at the end. Format the output with the caption first, a double newline, and then the hashtags separated by spaces.`;
  const systemPrompt = "You are an expert social media manager and copywriter.";
  
  return generateWithGroq(prompt, systemPrompt);
}

/**
 * AI Assistant specific logic (keeps chat history)
 */
export async function chatWithAssistant(messages) {
  if (!GROQ_API_KEY && !OPENROUTER_API_KEY) return { role: 'ai', text: "API keys are missing." };

  // Convert our simple {role: 'user'|'ai', text: '...'} to OpenAI format
  const formattedMessages = messages.map(m => ({
    role: m.role === 'ai' ? 'assistant' : 'user',
    content: m.text
  }));

  // Add system prompt
  formattedMessages.unshift({
    role: 'system',
    content: "You are an expert AI Marketing Co-Founder. You help startup founders come up with marketing strategies, campaigns, and content ideas. Be concise, enthusiastic, and highly practical."
  });

  // Try Groq first
  if (GROQ_API_KEY) {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: formattedMessages,
          temperature: 0.7,
        })
      });

      if (response.ok) {
        const data = await response.json();
        return { role: 'ai', text: data.choices[0].message.content };
      }
    } catch (e) { console.warn('[Chat] Groq failed'); }
  }

  // Try OpenRouter
  if (OPENROUTER_API_KEY) {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-3.1-8b-instruct:free',
          messages: formattedMessages,
          temperature: 0.7,
        })
      });

      if (response.ok) {
        const data = await response.json();
        return { role: 'ai', text: data.choices[0].message.content };
      }
    } catch (e) { console.warn('[Chat] OpenRouter failed'); }
  }

  return { role: 'ai', text: "Sorry, I couldn't reach any AI service. Check your API keys and try again." };
}

/**
 * AI Poster generation (Text-based, extracting a title and subtitle)
 */
export async function generatePosterContent(campaign, topic, audience) {
  const prompt = `I need a catchy short Title (max 4 words) and a Subtitle (max 8 words) for a marketing poster.
Campaign: ${campaign}
Topic: ${topic}
Target Audience: ${audience}

Reply EXACTLY in this JSON format and nothing else:
{"title": "YOUR TITLE HERE", "subtitle": "YOUR SUBTITLE HERE", "keyword": "one single word for image search"}`;
  
  const systemPrompt = "You are a creative director. Reply with ONLY the JSON object, no extra text.";
  const rawResponse = await generateWithGroq(prompt, systemPrompt);
  
  console.log('[Poster] Raw AI response:', rawResponse);
  
  if (rawResponse.startsWith('Error:')) {
    console.error('[Poster] AI returned error:', rawResponse);
    return { title: "LAUNCH YOUR IDEA", subtitle: "AI-powered tools for modern startups", keyword: "startup" };
  }

  try {
    const match = rawResponse.match(/\{[\s\S]*\}/);
    if (match) {
      const parsed = JSON.parse(match[0]);
      console.log('[Poster] Parsed successfully:', parsed);
      return parsed;
    }
    return JSON.parse(rawResponse);
  } catch (e) {
    console.error("[Poster] Failed to parse JSON:", rawResponse);
    return { title: "LAUNCH YOUR IDEA", subtitle: "AI-powered tools for modern startups", keyword: "startup" };
  }
}
