import { supabase } from '../supabase';
import { legalResearchStep } from '../steps/legalResearch';
import { draftLegalDocumentStep } from '../steps/draftLegalDocument';

export async function orchestrateLegalDocument(
  jobId: string,
  input: { document_type: string; business_id: string; details: any }
): Promise<void> {
  console.log('[legal] job started:', jobId, input);

  const updateStatus = async (status: string, extra: any = {}) => {
    const { error } = await supabase
      .from('legal_documents')
      .update({ status, ...extra })
      .eq('id', jobId);
    
    if (error) {
      console.error(`[legal] CRITICAL: Failed to update status for document ${jobId}:`, error);
      throw error; // Let the outer catch handle it
    }
  };

  try {
    // 1. Research
    console.log('[legal] entering research step');
    await updateStatus('researching');
    
    const location = input.details?.location || 'India';
    let statutoryData;
    
    try {
      statutoryData = await legalResearchStep(input.document_type, input.details, location);
      await updateStatus('researching', { statutory_data: statutoryData });
    } catch (err) {
      console.error('[legal] Error in legalResearchStep:', err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      await updateStatus('error', { error_message: errorMessage });
      return;
    }

    // 2. Draft
    console.log('[legal] entering drafting step');
    await updateStatus('drafting');
    
    let draftContent;
    try {
      draftContent = await draftLegalDocumentStep(input.document_type, input.details, statutoryData);
      await updateStatus('drafting', { draft_content: draftContent });
    } catch (err) {
      console.error('[legal] Error in draftLegalDocumentStep:', err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      await updateStatus('error', { error_message: errorMessage });
      return;
    }

    // 3. Done
    console.log('[legal] marking document job as done');
    await updateStatus('done');
    
    console.log('[legal] job done:', jobId);
  } catch (error) {
    console.error(`[legal] Error orchestrating legal document ${jobId}:`, error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    await supabase
      .from('legal_documents')
      .update({ status: 'error', error_message: errorMessage })
      .eq('id', jobId);
  }
}
