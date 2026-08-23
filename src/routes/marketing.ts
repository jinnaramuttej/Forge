import { Router } from 'express';
import { generateAndPost } from '../lib/marketingClient';

const router = Router();

router.post('/post', async (req, res) => {
  try {
    const input = req.body;
    console.log('[marketing-proxy] Received post request:', {
      captionLength: input.caption?.length,
      platforms: {
        instagram: input.postInstagram,
        facebook: input.postFacebook,
        youtube: input.postYoutube
      }
    });

    const result = await generateAndPost(input);
    res.json(result);
  } catch (error: any) {
    console.error('[marketing-proxy] POST /post failed:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
