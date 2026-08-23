const { db } = require('../src/database/supabase');

const DEFAULT_COMPANY_ID = 'dd6f7306-36ed-4c9f-9996-6c5ab35d6628';

// Initial company financial policies
const DEFAULT_POLICIES = [
  {
    company_id: DEFAULT_COMPANY_ID,
    policy_name: 'Autonomous Payment & Routine Action Threshold',
    policy_type: 'payment_threshold',
    parameters: {
      auto_execute_limit: 100.00,        // Actions <= £100 execute automatically
      review_required_limit: 1000.00,    // Actions £100 - £1,000 prepared with approval request
      founder_approval_limit: 1000.00    // Actions > £1,000 require explicit founder approval
    },
    is_active: true
  },
  {
    company_id: DEFAULT_COMPANY_ID,
    policy_name: 'Minimum Cash Reserve Policy',
    policy_type: 'min_cash_reserve',
    parameters: {
      target_reserve_gbp: 50000.00,      // Maintain at least £50,000 reserve
      critical_threshold_gbp: 25000.00,  // Critical alert if below £25,000
      currency: 'GBP'
    },
    is_active: true
  },
  {
    company_id: DEFAULT_COMPANY_ID,
    policy_name: 'Runway Warning Policy',
    policy_type: 'runway_warning',
    parameters: {
      safe_runway_months: 6.0,
      warning_runway_months: 3.0,
      critical_runway_days: 60           // 60-day safety horizon
    },
    is_active: true
  },
  {
    company_id: DEFAULT_COMPANY_ID,
    policy_name: 'Customer Credit & Overdue Invoice Policy',
    policy_type: 'credit_limit_breach',
    parameters: {
      grace_period_days: 7,
      high_risk_overdue_days: 30,
      auto_reminder_enabled: true
    },
    is_active: true
  }
];

// Initial founder preferences and persistent company memory
const DEFAULT_MEMORIES = [
  {
    company_id: DEFAULT_COMPANY_ID,
    category: 'founder_preference',
    key: 'cash_reserve_rule',
    value: {
      preference: 'Founder wants to maintain at least £50,000 in cash reserve for unexpected supply chain delays.',
      context: 'Established in Q2 2024 strategic board meeting',
      targetGbp: 50000
    },
    importance: 5
  },
  {
    company_id: DEFAULT_COMPANY_ID,
    category: 'founder_preference',
    key: 'overdue_invoice_followup',
    value: {
      preference: 'Automatically generate polite payment reminders for invoices overdue by more than 7 days, but flag corporate accounts for manual review.',
      autoRemind: true,
      graceDays: 7
    },
    importance: 4
  },
  {
    company_id: DEFAULT_COMPANY_ID,
    category: 'recurring_expense',
    key: 'monthly_payroll_cadence',
    value: {
      observation: 'Monthly payroll runs on the 15th and end of each month, averaging ~£35,000 - £40,000 per month across 10 staff members.',
      frequency: 'bi-weekly/monthly'
    },
    importance: 4
  },
  {
    company_id: DEFAULT_COMPANY_ID,
    category: 'decision',
    key: 'inventory_reorder_restraint',
    value: {
      decision: 'Preserve working capital in Q3 2024 by reordering stock only when quantity on hand falls strictly below reorder point.',
      date: '2024-05-01'
    },
    importance: 3
  },
  {
    company_id: DEFAULT_COMPANY_ID,
    category: 'observation',
    key: 'seasonal_revenue_trend',
    value: {
      observation: 'Outdoor equipment sales peak in summer (June-August). Higher cash inflows during summer should buffer Q4 winter slowdown.',
      seasonality: 'high_summer'
    },
    importance: 3
  }
];

async function seedPoliciesAndMemory(companyId = DEFAULT_COMPANY_ID) {
  let seededPolicies = 0;
  let seededMemories = 0;

  for (const policy of DEFAULT_POLICIES) {
    policy.company_id = companyId;
    await db.insert('financial_policies', policy);
    seededPolicies++;
  }

  for (const memory of DEFAULT_MEMORIES) {
    memory.company_id = companyId;
    await db.insert('agent_memory', memory);
    seededMemories++;
  }

  return { seededPolicies, seededMemories };
}

module.exports = {
  DEFAULT_POLICIES,
  DEFAULT_MEMORIES,
  seedPoliciesAndMemory
};
