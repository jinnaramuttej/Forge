const { runFinanceAgent } = require('../agent/graph');
const { validateFinancialDocument } = require('../services/reportValidation.service');
const { db } = require('../database/supabase');
const env = require('../config/env');

async function handleAgentRequest(req, res) {
  try {
    const { companyId, message, userId, document, title } = req.body;

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return res.status(400).json({
        error: 'Invalid request: "message" is required and must be a non-empty string.'
      });
    }

    const targetCompanyId = companyId || env.DEFAULT_COMPANY_ID;

    console.log(`\n====================================================`);
    console.log(`[AGENT API] Invoking Autonomous Finance Agent`);
    console.log(`Message: "${message}"`);
    console.log(`Company: ${targetCompanyId}`);
    if (document) {
      console.log(`Document Payload Attached: ${typeof document === 'string' ? `${document.substring(0, 80)}...` : JSON.stringify(document).substring(0, 80)}`);
    }
    console.log(`====================================================`);

    const result = await runFinanceAgent({
      companyId: targetCompanyId,
      userId: userId || 'founder-1',
      message: message.trim()
    });

    return res.status(200).json(result);
  } catch (err) {
    console.error('[AGENT CONTROLLER ERROR]', err);
    return res.status(500).json({
      error: 'Agent execution failed',
      message: err.message
    });
  }
}

async function handleValidateReport(req, res) {
  try {
    const { companyId, document, text, content, title } = req.body;
    const documentData = document || text || content;

    if (!documentData) {
      return res.status(400).json({
        error: 'Invalid request: "document", "text", or "content" is required.'
      });
    }

    const targetCompanyId = companyId || env.DEFAULT_COMPANY_ID;
    const documentTitle = title || 'Funding & Financial Proposal';

    console.log(`\n====================================================`);
    console.log(`[VALIDATION API] Validating Financial Document / Report`);
    console.log(`Title: "${documentTitle}"`);
    console.log(`Company: ${targetCompanyId}`);
    console.log(`====================================================`);

    const validationResult = await validateFinancialDocument(targetCompanyId, documentData, documentTitle);

    return res.status(200).json(validationResult);
  } catch (err) {
    console.error('[VALIDATION CONTROLLER ERROR]', err);
    return res.status(500).json({
      error: 'Financial report validation failed',
      message: err.message
    });
  }
}

async function getTaskStatus(req, res) {
  try {
    const { id } = req.params;
    const task = await db.findOne('agent_tasks', { id });

    if (!task) {
      return res.status(404).json({ error: `Task with id '${id}' not found.` });
    }

    return res.status(200).json({
      taskId: task.id,
      companyId: task.company_id,
      status: task.status,
      goal: task.goal,
      plan: task.plan,
      toolCalls: task.tool_calls,
      findings: task.findings,
      decisions: task.decisions,
      actions: task.actions,
      memoryUsed: task.memory_used,
      finalResponse: task.final_response,
      createdAt: task.created_at,
      updatedAt: task.updated_at
    });
  } catch (err) {
    console.error('[TASK CONTROLLER ERROR]', err);
    return res.status(500).json({ error: 'Failed to retrieve task status', message: err.message });
  }
}

module.exports = {
  handleAgentRequest,
  handleValidateReport,
  getTaskStatus
};
