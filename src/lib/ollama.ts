export async function callQwen(prompt: string, systemPrompt?: string): Promise<string> {
  const url = 'https://openrouter.ai/api/v1/chat/completions';
  const model = 'meta-llama/llama-3.1-8b-instruct';
  const timeoutMs = 60000; // 1 minute

  const makeRequest = async (): Promise<string> => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    const messages = [];
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }
    messages.push({ role: 'user', content: prompt });

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        },
        body: JSON.stringify({
          model,
          messages,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } finally {
      clearTimeout(timeout);
    }
  };

  try {
    return await makeRequest();
  } catch (error) {
    console.warn('callQwen: First attempt failed, retrying once...', error);
    return await makeRequest();
  }
}
