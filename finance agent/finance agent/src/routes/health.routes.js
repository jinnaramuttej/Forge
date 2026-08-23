const express = require('express');
const router = express.Router();
const { getDatabaseHealth } = require('../database/supabase');
const { getLLMStatus } = require('../llm');

router.get('/', async (req, res) => {
  try {
    const dbHealth = await getDatabaseHealth();
    const llmStatus = await getLLMStatus();

    const response = {
      status: 'ok',
      service: 'Autonomous AI Finance Manager Backend',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      database: dbHealth.status === 'connected' ? 'connected' : dbHealth.status,
      gemini: llmStatus.gemini,
      ollama: llmStatus.ollama,
      model: llmStatus.model,
      llmMode: llmStatus.llmMode,
      details: {
        databaseMessage: dbHealth.message,
        llmMessage: llmStatus.message
      }
    };

    return res.status(200).json(response);
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
});

module.exports = router;
