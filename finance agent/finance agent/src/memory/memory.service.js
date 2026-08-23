const { db } = require('../database/supabase');

async function saveMemory(companyId, { category, key, value, importance = 1 }) {
  if (!companyId || !key || !value) {
    throw new Error('companyId, key, and value are required to save memory.');
  }

  const record = {
    company_id: companyId,
    category: category || 'observation',
    key,
    value,
    importance: Number(importance) || 1
  };

  // Check if existing memory with same company_id and key exists
  const existing = await db.findOne('agent_memory', { company_id: companyId, key });
  if (existing) {
    await db.update('agent_memory', { id: existing.id }, { value, importance, updated_at: new Date().toISOString() });
    return { ...existing, value, importance };
  } else {
    return await db.insert('agent_memory', record);
  }
}

async function getMemories(companyId, { category, limit = 50 } = {}) {
  const filter = { company_id: companyId };
  if (category) {
    filter.category = category;
  }
  const memories = await db.find('agent_memory', filter);
  return memories.slice(0, limit);
}

async function getCompanyPolicies(companyId, policyType = null) {
  const filter = { company_id: companyId, is_active: true };
  if (policyType) {
    filter.policy_type = policyType;
  }
  return await db.find('financial_policies', filter);
}

module.exports = {
  saveMemory,
  getMemories,
  getCompanyPolicies
};
