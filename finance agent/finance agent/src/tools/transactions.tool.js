const { db } = require('../database/supabase');

async function getTransactions(companyId, { limit = 20, sourceModule } = {}) {
  let entries = await db.find('journal_entries', { company_id: companyId });

  if (sourceModule) {
    entries = entries.filter(e => e.source_module === sourceModule);
  }

  // Sort descending by entry_number or entry_date
  entries.sort((a, b) => (b.entry_number || 0) - (a.entry_number || 0));

  const sample = entries.slice(0, Number(limit) || 20);

  return {
    totalTransactions: entries.length,
    returnedCount: sample.length,
    transactions: sample
  };
}

module.exports = { getTransactions };
