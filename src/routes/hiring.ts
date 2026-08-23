import { Router, Request, Response } from 'express';
import { supabase } from '../supabase';
import { orchestrateHiringJob } from '../jobs/orchestrateHiringJob';

const router = Router();

router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('hiring_jobs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error fetching jobs:', error);
      res.status(500).json({ error: 'Database error' });
      return;
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/generate', async (req: Request, res: Response): Promise<void> => {
  const { role, business_type, budget, location, work_mode } = req.body;

  // Validate all required fields
  if (!role || !business_type || !budget || !location || !work_mode) {
    res.status(400).json({ 
      error: 'Missing required fields: role, business_type, budget, location, work_mode' 
    });
    return;
  }

  try {
    const { data, error } = await supabase
      .from('hiring_jobs')
      .insert([
        {
          business_id: business_type, // Map business_type from body to business_id in table
          role,
          budget,
          location,
          work_mode,
          status: 'pending'
        }
      ])
      .select('id')
      .single();

    if (error) {
      console.error('Error inserting job:', error);
      res.status(500).json({ error: 'Failed to create job entry' });
      return;
    }

    const jobId = data.id;

    // Fire and forget orchestration
    orchestrateHiringJob(jobId, { role, business_type, budget, location, work_mode }).catch((err) => {
      console.error(`Unhandled error in orchestrator for job ${jobId}:`, err);
    });

    res.status(200).json({ job_id: jobId });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from('hiring_jobs')
      .select('id, status, error_message, market_data, jd_content, screening_questions, nda_content, created_at')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        res.status(404).json({ error: 'Job not found' });
      } else {
        res.status(500).json({ error: 'Database error' });
      }
      return;
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.patch('/:id/approve', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { decision } = req.body;

  if (decision !== 'approved' && decision !== 'rejected') {
    res.status(400).json({ error: "decision must be 'approved' or 'rejected'" });
    return;
  }

  try {
    // Check if the job is 'done'
    const { data: job, error: fetchError } = await supabase
      .from('hiring_jobs')
      .select('status')
      .eq('id', id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        res.status(404).json({ error: 'Job not found' });
      } else {
        console.error('Error fetching job for approval:', fetchError);
        res.status(500).json({ error: 'Database error' });
      }
      return;
    }

    if (job.status !== 'done') {
      res.status(400).json({ error: `Cannot approve a job with status: ${job.status}. Job must be 'done'.` });
      return;
    }

    // Update approval status
    const updateData: any = { approval_status: decision };
    if (decision === 'approved') {
      updateData.approved_at = new Date().toISOString();
    }

    const { data: updatedJob, error: updateError } = await supabase
      .from('hiring_jobs')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating approval status:', updateError);
      res.status(500).json({ error: 'Failed to update approval status' });
      return;
    }

    res.status(200).json(updatedJob);
  } catch (error) {
    console.error('Server error during approval:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
