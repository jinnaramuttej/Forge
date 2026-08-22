export async function callQwen(prompt: string, systemPrompt?: string): Promise<string> {
  const url = 'http://localhost:11434/api/generate';
  const model = 'qwen3:8b';
  const timeoutMs = 120000; // 120 seconds

  const makeRequest = async (): Promise<string> => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          prompt,
          system: systemPrompt,
          stream: false,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.response;
    } finally {
      clearTimeout(timeout);
    }
  };

  try {
    return await makeRequest();
  } catch (error) {
    console.warn('callQwen: First attempt failed, retrying once...', error);
    // Retry once on failure
    return await makeRequest();
  }
}
