const express = require('express');
const router = express.Router();
const {
  handleAgentRequest,
  handleValidateReport,
  getTaskStatus
} = require('../controllers/agent.controller');

// POST /api/agent (Main Autonomous Agent Endpoint)
router.post('/', handleAgentRequest);

// POST /api/agent/validate-report (Demo 2: Financial Report & Funding Validation)
router.post('/validate-report', handleValidateReport);

// GET /api/agent/tasks/:id (Task Status & Execution Trace)
router.get('/tasks/:id', getTaskStatus);

module.exports = router;
