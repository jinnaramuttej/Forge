const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../../.env') });

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.FINANCE_PORT || '5000', 10),
  
  // Supabase Configuration
  SUPABASE_URL: process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  SUPABASE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  
  // Gemini Configuration
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '',
  GEMINI_MODEL: process.env.GEMINI_MODEL || 'gemini-flash-latest',
  LLM_PROVIDER: (process.env.LLM_PROVIDER || '').toLowerCase(),

  // OpenRouter Configuration
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY || '',
  OPENROUTER_MODEL: process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.1-8b-instruct',
  
  // Ollama Configuration
  OLLAMA_BASE_URL: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
  OLLAMA_MODEL: process.env.OLLAMA_MODEL || 'qwen3:8b',
  
  // LLM Mode: 'auto' | 'gemini' | 'ollama' | 'openrouter' | 'mock'
  LLM_MODE: (process.env.LLM_MODE || process.env.LLM_PROVIDER || 'auto').toLowerCase(),

  // Fallback / default company ID for UK synthetic SME dataset
  DEFAULT_COMPANY_ID: process.env.DEFAULT_COMPANY_ID || 'dd6f7306-36ed-4c9f-9996-6c5ab35d6628'
};

// Validate critical configuration
function validateEnv() {
  const warnings = [];
  if (!env.SUPABASE_URL) {
    warnings.push('SUPABASE_URL is not set in environment.');
  }
  if (!env.SUPABASE_KEY) {
    warnings.push('SUPABASE_KEY is not set in environment.');
  }
  if (warnings.length > 0) {
    console.warn('[CONFIG WARNING]', warnings.join(' '));
  }
}

validateEnv();

module.exports = env;
