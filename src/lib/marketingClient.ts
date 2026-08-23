export async function generateAndPost(input: {
  image: string;
  caption: string;
  postInstagram: boolean;
  postFacebook: boolean;
  postYoutube: boolean;
}): Promise<any> {
  const MARKETING_SERVICE_URL = process.env.MARKETING_SERVICE_URL || 'http://localhost:5050';
  
  try {
    const res = await fetch(`${MARKETING_SERVICE_URL}/api/post-to-social-media`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(input)
    });

    if (!res.ok) {
      throw new Error(`Marketing service responded with status ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error('[marketing-proxy] generateAndPost error:', error);
    throw new Error('Marketing service is unreachable or failed to post.');
  }
}
