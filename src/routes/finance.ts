import { Router, Request, Response } from 'express';
import { getFinanceSummary, runFinanceAgent } from '../lib/financeClient';

const router = Router();

router.get('/summary', async (req: Request, res: Response): Promise<void> => {
  try {
    const summary = await getFinanceSummary();
    res.status(200).json(summary);
  } catch (error: any) {
    res.status(503).json({ error: error.message });
  }
});

router.post('/agent', async (req: Request, res: Response): Promise<void> => {
  try {
    const { query } = req.body;
    if (!query) {
      res.status(400).json({ error: 'Missing required field: query' });
      return;
    }
    const result = await runFinanceAgent(query);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(503).json({ error: error.message });
  }
});

export default router;
