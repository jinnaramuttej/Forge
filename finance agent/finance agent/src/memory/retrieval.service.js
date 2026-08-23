const { getMemories, getCompanyPolicies } = require('./memory.service');

async function retrieveRelevantMemory(companyId, query = '') {
  const allMemories = await getMemories(companyId);
  const policies = await getCompanyPolicies(companyId);

  const queryTerms = (query || '').toLowerCase().split(/\s+/).filter(t => t.length > 2);

  // Score memories by query term matches + importance
  const scoredMemories = allMemories.map(m => {
    let score = (m.importance || 1) * 2;
    const content = `${m.key} ${m.category} ${JSON.stringify(m.value)}`.toLowerCase();
    for (const term of queryTerms) {
      if (content.includes(term)) {
        score += 5;
      }
    }
    return { memory: m, score };
  });

  scoredMemories.sort((a, b) => b.score - a.score);

  return {
    memories: scoredMemories.map(s => s.memory),
    policies
  };
}

module.exports = {
  retrieveRelevantMemory
};
