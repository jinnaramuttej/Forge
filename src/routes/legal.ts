import { Router, Request, Response } from 'express';
import { supabase } from '../supabase';
import { orchestrateLegalDocument } from '../jobs/orchestrateLegalDocument';

const router = Router();
const ALLOWED_DOC_TYPES = ['nda', 'freelancer_agreement', 'offer_letter'];

router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('legal_documents')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error fetching legal docs:', error);
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
  const { document_type, business_id, details } = req.body;

  if (!document_type || !business_id || !details) {
    res.status(400).json({ error: 'Missing required fields: document_type, business_id, details' });
    return;
  }

  if (!ALLOWED_DOC_TYPES.includes(document_type)) {
    res.status(400).json({ error: `document_type must be one of: ${ALLOWED_DOC_TYPES.join(', ')}` });
    return;
  }

  try {
    const { data, error } = await supabase
      .from('legal_documents')
      .insert([
        {
          document_type,
          business_id,
          input_context: details,
          status: 'pending'
        }
      ])
      .select('id')
      .single();

    if (error) {
      console.error('Error inserting legal document:', error);
      res.status(500).json({ error: 'Failed to create legal document entry' });
      return;
    }

    const jobId = data.id;

    // Fire and forget orchestration
    orchestrateLegalDocument(jobId, { document_type, business_id, details }).catch((err) => {
      console.error(`Unhandled error in legal orchestrator for job ${jobId}:`, err);
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
      .from('legal_documents')
      .select('id, business_id, document_type, input_context, statutory_data, draft_content, status, error_message, approval_status, approved_at, created_at')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        res.status(404).json({ error: 'Document not found' });
      } else {
        console.error('Database error fetching legal doc:', error);
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
    // Check if the document is 'done'
    const { data: job, error: fetchError } = await supabase
      .from('legal_documents')
      .select('status')
      .eq('id', id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        res.status(404).json({ error: 'Document not found' });
      } else {
        console.error('Error fetching document for approval:', fetchError);
        res.status(500).json({ error: 'Database error' });
      }
      return;
    }

    if (job.status !== 'done') {
      res.status(400).json({ error: `Cannot approve a document with status: ${job.status}. Document must be 'done'.` });
      return;
    }

    // Update approval status
    const updateData: any = { approval_status: decision };
    if (decision === 'approved') {
      updateData.approved_at = new Date().toISOString();
    }

    const { data: updatedDoc, error: updateError } = await supabase
      .from('legal_documents')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating approval status:', updateError);
      res.status(500).json({ error: 'Failed to update approval status' });
      return;
    }

    res.status(200).json(updatedDoc);
  } catch (error) {
    console.error('Server error during approval:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
