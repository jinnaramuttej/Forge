import { supabase } from '../supabase';
import { marketCheckStep } from '../steps/marketCheck';
import { draftJDStep, JobInput, MarketData } from '../steps/draftJD';
import { screeningQuestionsStep } from '../steps/screeningQuestions';

export async function orchestrateHiringJob(jobId: string, input: JobInput): Promise<void> {
  try {
    // 1. Market Check
    await updateJobStatus(jobId, 'market_check');
    const marketData = await marketCheckStep(input.role, input.location);
    await updateJobData(jobId, { market_data: marketData });

    // 2. Draft JD
    await updateJobStatus(jobId, 'drafting');
    const jdContent = await draftJDStep(input, marketData as MarketData);
    await updateJobData(jobId, { jd_content: jdContent });

    // 3. Screening Questions
    await updateJobStatus(jobId, 'questions');
    // Ensure we are only passing { position } as required by the signature
    const questions = await screeningQuestionsStep(input.role, { position: marketData.position }, jdContent);
    await updateJobData(jobId, { screening_questions: questions });

    // 4. Done
    await updateJobStatus(jobId, 'done');

  } catch (error) {
    console.error(`Error orchestrating job ${jobId}:`, error);
    
    // Set status to error and save the error message
    const errorMessage = error instanceof Error ? error.message : String(error);
    await updateJobError(jobId, errorMessage);
  }
}

async function updateJobStatus(jobId: string, status: string) {
  const { error } = await supabase
    .from('hiring_jobs')
    .update({ status })
    .eq('id', jobId);

  if (error) {
    throw new Error(`Failed to update job status to ${status}: ${error.message}`);
  }
}

async function updateJobData(jobId: string, data: any) {
  const { error } = await supabase
    .from('hiring_jobs')
    .update(data)
    .eq('id', jobId);

  if (error) {
    throw new Error(`Failed to update job data: ${error.message}`);
  }
}

async function updateJobError(jobId: string, errorMessage: string) {
  const { error } = await supabase
    .from('hiring_jobs')
    .update({ 
      status: 'error',
      error_message: errorMessage 
    })
    .eq('id', jobId);

  if (error) {
    console.error(`CRITICAL: Failed to update error status for job ${jobId}:`, error);
  }
}
