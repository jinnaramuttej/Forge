const { describe, it, before } = require('node:test');
const assert = require('node:assert');
const { saveMemory, getMemories, getCompanyPolicies } = require('../src/memory/memory.service');
const { retrieveRelevantMemory } = require('../src/memory/retrieval.service');
const { seedPoliciesAndMemory } = require('../scripts/seedMemory');

const COMPANY_ID = 'dd6f7306-36ed-4c9f-9996-6c5ab35d6628';

describe('Persistent Memory and Policy Retrieval Tests', () => {
  before(async () => {
    await seedPoliciesAndMemory(COMPANY_ID);
  });

  it('should save and update persistent memories', async () => {
    const memory = await saveMemory(COMPANY_ID, {
      category: 'founder_preference',
      key: 'tax_advisor_contact',
      value: { email: 'tax@peakdistrict.co.uk', preferredMonth: 'March' },
      importance: 5
    });

    assert.strictEqual(memory.key, 'tax_advisor_contact');
    assert.strictEqual(memory.importance, 5);

    // Update memory
    const updated = await saveMemory(COMPANY_ID, {
      category: 'founder_preference',
      key: 'tax_advisor_contact',
      value: { email: 'tax_lead@peakdistrict.co.uk', preferredMonth: 'April' },
      importance: 5
    });

    assert.strictEqual(updated.value.preferredMonth, 'April');
  });

  it('should retrieve memories by category and relevance score', async () => {
    const memories = await getMemories(COMPANY_ID, { category: 'founder_preference' });
    assert.ok(memories.length > 0);

    const search = await retrieveRelevantMemory(COMPANY_ID, 'cash reserve');
    assert.ok(search.memories.length > 0);
    assert.ok(search.memories[0].key.includes('cash_reserve') || search.memories[0].importance >= 4);
  });

  it('should retrieve active company financial policies', async () => {
    const policies = await getCompanyPolicies(COMPANY_ID);
    assert.ok(policies.length >= 4);

    const paymentPolicy = await getCompanyPolicies(COMPANY_ID, 'payment_threshold');
    assert.strictEqual(paymentPolicy.length, 1);
    assert.strictEqual(paymentPolicy[0].parameters.auto_execute_limit, 100);
  });
});
