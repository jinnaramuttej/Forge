import { supabase } from '../supabase';

export async function orchestrateLegalDocument(jobId: string, input: any): Promise<void> {
  console.log('[legal] job started:', jobId, input);
  try {
    // Placeholder for orchestration logic
    // 1. Research (statutory_data)
    // 2. Draft (draft_content)
    // 3. Append Legal Disclaimer
    
    // For now, just mark it as done as a placeholder so the process doesn't hang
    const { error } = await supabase
      .from('legal_documents')
      .update({ status: 'done' })
      .eq('id', jobId);
      
    if (error) throw error;
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
