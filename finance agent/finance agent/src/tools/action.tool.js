const { db } = require('../database/supabase');
const memoryService = require('../memory/memory.service');
const retrievalService = require('../memory/retrieval.service');

// 1. Get Company Policy Tool
async function getCompanyPolicy(companyId, { policyType } = {}) {
  return await memoryService.getCompanyPolicies(companyId, policyType);
}

// 2. Save Memory Tool
async function saveMemoryTool(companyId, { category, key, value, importance }) {
  return await memoryService.saveMemory(companyId, { category, key, value, importance });
}

// 3. Retrieve Memory Tool
async function retrieveMemoryTool(companyId, { query }) {
  return await retrievalService.retrieveRelevantMemory(companyId, query);
}

// 4. Record Agent Action with policy compliance check
async function recordAgentAction(companyId, {
  taskId = null,
  actionType,
  description,
  targetEntityType = null,
  targetEntityId = null,
  amount = 0,
  reason,
  requiresApproval = false
}) {
  const policies = await memoryService.getCompanyPolicies(companyId, 'payment_threshold');
  const policy = policies[0]?.parameters || {
    auto_execute_limit: 100.00,
    review_required_limit: 1000.00,
    founder_approval_limit: 1000.00
  };

  const actionAmount = Number(amount) || 0;
  let mustApprove = requiresApproval;
  let status = 'executed';

  // Apply policy bounds
  if (actionAmount > policy.founder_approval_limit) {
    mustApprove = true;
    status = 'pending_approval';
  } else if (actionAmount > policy.auto_execute_limit) {
    mustApprove = true;
    status = 'prepared';
  } else {
    mustApprove = false;
    status = 'executed';
  }

  const record = {
    company_id: companyId,
    task_id: taskId,
    action_type: actionType,
    description,
    target_entity_type: targetEntityType,
    target_entity_id: targetEntityId,
    amount: actionAmount,
    requires_approval: mustApprove,
    approved: !mustApprove,
    status,
    reason: reason || 'Routine financial policy enforcement'
  };

  const saved = await db.insert('agent_actions', record);
  return saved;
}

module.exports = {
  getCompanyPolicy,
  saveMemoryTool,
  retrieveMemoryTool,
  recordAgentAction
};
