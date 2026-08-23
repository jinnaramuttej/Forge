import { Router, Request, Response } from 'express';
import { supabase } from '../supabase';

const router = Router();

router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('candidates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error fetching candidates:', error);
      res.status(500).json({ error: 'Database error' });
      return;
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
