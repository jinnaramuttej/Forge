const AYRSHARE_API_KEY = import.meta.env.VITE_AYRSHARE_API_KEY || 'YOUR_AYRSHARE_API_KEY';

/**
 * Publishes a post to social media using the Ayrshare API.
 * @param {string} text - The caption/text of the post.
 * @param {string} imageUrl - The URL of the image to attach.
 * @param {Array<string>} platforms - Array of platforms (e.g., ['facebook', 'instagram']).
 * @returns {Promise<Object>} The API response.
 */
export async function publishViaAyrshare(text, imageUrl, platforms) {
  if (!AYRSHARE_API_KEY || AYRSHARE_API_KEY === 'YOUR_AYRSHARE_API_KEY') {
    console.warn('Ayrshare API key missing or placeholder used. Mocking post...');
    return new Promise(resolve => setTimeout(() => resolve({ status: 'mock_success', id: 'mock_123' }), 1000));
  }

  try {
    const response = await fetch('https://app.ayrshare.com/api/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AYRSHARE_API_KEY}`
      },
      body: JSON.stringify({
        post: text,
        platforms: platforms,
        mediaUrls: [imageUrl]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Ayrshare API Error:', errorText);
      throw new Error(`Ayrshare API Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to post via Ayrshare:', error);
    throw error;
  }
}
