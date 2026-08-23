const env = require('../config/env');
const RealGeminiLLM = require('./gemini');
const RealOllamaLLM = require('./ollama');
const OpenRouterLLM = require('./openrouter');
const MockLLM = require('./mock');

const geminiInstance = new RealGeminiLLM(env.GEMINI_API_KEY, env.GEMINI_MODEL);
const ollamaInstance = new RealOllamaLLM(env.OLLAMA_BASE_URL, env.OLLAMA_MODEL);
const openrouterInstance = new OpenRouterLLM(env.OPENROUTER_API_KEY, env.OPENROUTER_MODEL);
const mockInstance = new MockLLM();

let activeLLM = env.OPENROUTER_API_KEY ? openrouterInstance : (env.GEMINI_API_KEY ? geminiInstance : mockInstance);
let currentMode = env.OPENROUTER_API_KEY ? 'openrouter' : (env.GEMINI_API_KEY ? 'gemini' : 'mock');

async function checkAndUpdateLLMMode() {
  // Explicit mock mode
  if (env.LLM_MODE === 'mock') {
    activeLLM = mockInstance;
    currentMode = 'mock';
    return { mode: 'mock', provider: 'mock', available: true };
  }

  // Check OpenRouter first if configured or in auto mode with API key
  if ((env.LLM_MODE === 'openrouter' || env.LLM_PROVIDER === 'openrouter' || env.LLM_MODE === 'auto') && env.OPENROUTER_API_KEY) {
    try {
      const orHealth = await openrouterInstance.checkHealth();
      if (orHealth.available) {
        activeLLM = openrouterInstance;
        currentMode = 'openrouter';
        return { mode: 'openrouter', provider: 'openrouter', model: openrouterInstance.model, available: true };
      }
    } catch (err) {
      console.warn('[LLM] OpenRouter check failed:', err.message);
    }
  }

  // Check Gemini if configured or in auto mode with API key
  if ((env.LLM_MODE === 'gemini' || env.LLM_PROVIDER === 'gemini' || env.LLM_MODE === 'auto') && env.GEMINI_API_KEY) {
    try {
      const geminiHealth = await geminiInstance.checkHealth();
      if (geminiHealth.available) {
        activeLLM = geminiInstance;
        currentMode = 'gemini';
        return { mode: 'gemini', provider: 'gemini', model: geminiInstance.model, available: true };
      }
    } catch (err) {
      console.warn('[LLM] Gemini check failed:', err.message);
    }
  }

  // Check Ollama if configured
  if (env.LLM_MODE === 'ollama' || env.LLM_MODE === 'auto') {
    try {
      const ollamaHealth = await ollamaInstance.checkHealth();
      if (ollamaHealth.available && ollamaHealth.modelFound) {
        activeLLM = ollamaInstance;
        currentMode = 'ollama';
        return { mode: 'ollama', provider: 'ollama', model: env.OLLAMA_MODEL, available: true };
      }
    } catch (err) {
      // Ollama not reachable
    }
  }

  // Fallback to MockLLM for local deterministic testing
  activeLLM = mockInstance;
  currentMode = 'mock';
  return { mode: 'mock', provider: 'mock', model: 'mock-qwen3-8b', available: true };
}

// Initial check
checkAndUpdateLLMMode().then((res) => {
  if (res.mode === 'openrouter') {
    console.log(`[LLM] OpenRouter connected. Active mode: OPENROUTER (${res.model})`);
  } else if (res.mode === 'gemini') {
    console.log(`[LLM] Gemini connected. Active mode: GEMINI (${res.model})`);
  } else if (res.mode === 'ollama') {
    console.log(`[LLM] Ollama connected. Active mode: OLLAMA (${res.model})`);
  } else {
    console.log('[LLM] External LLM unavailable. Active mode: MOCK (Test Mode)');
  }
});

async function getLLMStatus() {
  const check = await checkAndUpdateLLMMode();
  return {
    database: 'connected',
    openrouter: check.mode === 'openrouter' ? 'connected' : (env.OPENROUTER_API_KEY ? 'available' : 'unavailable'),
    gemini: check.mode === 'gemini' ? 'connected' : (env.GEMINI_API_KEY ? 'available' : 'unavailable'),
    ollama: check.mode === 'ollama' ? 'connected' : 'unavailable',
    model: check.model || (currentMode === 'openrouter' ? openrouterInstance.model : (currentMode === 'gemini' ? geminiInstance.model : (currentMode === 'mock' ? 'mock-qwen3-8b' : null))),
    llmMode: currentMode,
    message: currentMode === 'openrouter'
      ? `LLM MODE: OPENROUTER (${check.model || openrouterInstance.model} active)`
      : currentMode === 'gemini'
      ? `LLM MODE: GEMINI (${check.model || geminiInstance.model} active)`
      : currentMode === 'ollama'
        ? `LLM MODE: OLLAMA (${env.OLLAMA_MODEL} active)`
        : 'LLM MODE: MOCK (Development test mode - deterministic execution with real Supabase data)'
  };
}

module.exports = {
  getLLM: () => activeLLM,
  getLLMStatus,
  checkAndUpdateLLMMode,
  generatePlan: async (args) => {
    await checkAndUpdateLLMMode();
    console.log(`[LLM MODE] ${currentMode.toUpperCase()}`);
    return activeLLM.generatePlan(args);
  },
  makeDecision: async (args) => {
    await checkAndUpdateLLMMode();
    console.log(`[LLM MODE] ${currentMode.toUpperCase()}`);
    return activeLLM.makeDecision(args);
  },
  generateFinalReport: async (args) => {
    await checkAndUpdateLLMMode();
    console.log(`[LLM MODE] ${currentMode.toUpperCase()}`);
    return activeLLM.generateFinalReport(args);
  }
};
