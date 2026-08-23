const { getFinancialSummary } = require('./financialSummary.tool');
const { getRevenue } = require('./revenue.tool');
const { getExpenses } = require('./expenses.tool');
const { getTransactions } = require('./transactions.tool');
const { getSales, getOutstandingInvoices } = require('./invoices.tool');
const { calculateCashFlow } = require('./cashflow.tool');
const { calculateBurnRate } = require('./burnRate.tool');
const { calculateRunway } = require('./runway.tool');
const { detectAnomalies } = require('./anomaly.tool');
const { compareBudget } = require('./budget.tool');
const { validateFinancialReport } = require('./validation.tool');
const {
  getCompanyPolicy,
  saveMemoryTool,
  retrieveMemoryTool,
  recordAgentAction
} = require('./action.tool');

const TOOL_REGISTRY = {
  getFinancialSummary: {
    fn: getFinancialSummary,
    description: 'Get comprehensive overview of revenue, expenses, net cash, and runway.'
  },
  getRevenue: {
    fn: getRevenue,
    description: 'Get revenue totals and monthly breakdown from sales orders.'
  },
  getExpenses: {
    fn: getExpenses,
    description: 'Get annualized payroll, estimated COGS, and operating expense breakdown.'
  },
  getTransactions: {
    fn: getTransactions,
    description: 'Get general ledger journal entries and audit trail.'
  },
  getSales: {
    fn: getSales,
    description: 'Get confirmed and pending sales orders.'
  },
  getOutstandingInvoices: {
    fn: getOutstandingInvoices,
    description: 'Get receivables, aging analysis, and overdue invoices.'
  },
  calculateCashFlow: {
    fn: calculateCashFlow,
    description: 'Calculate inflows, outflows, and net operating cash flow.'
  },
  calculateBurnRate: {
    fn: calculateBurnRate,
    description: 'Calculate monthly gross and net cash burn rates.'
  },
  calculateRunway: {
    fn: calculateRunway,
    description: 'Assess runway months and evaluate 60-day safety criteria.'
  },
  compareBudget: {
    fn: compareBudget,
    description: 'Compare departmental headcount and budget variance.'
  },
  detectAnomalies: {
    fn: detectAnomalies,
    description: 'Detect statistical outlier orders and customer credit limit breaches.'
  },
  validateFinancialReport: {
    fn: validateFinancialReport,
    description: 'Validate financial document/pitch deck/grant claims against actual Supabase accounting data.'
  },
  getCompanyPolicy: {
    fn: getCompanyPolicy,
    description: 'Retrieve active financial rules, reserve policies, and action thresholds.'
  },
  saveMemory: {
    fn: saveMemoryTool,
    description: 'Save persistent fact, preference, or decision to company memory.'
  },
  retrieveMemory: {
    fn: retrieveMemoryTool,
    description: 'Retrieve company preferences, policies, and historical decisions.'
  },
  recordAgentAction: {
    fn: recordAgentAction,
    description: 'Record an autonomous action or approval request under company policy.'
  }
};

async function executeTool(toolName, companyId, args = {}) {
  const tool = TOOL_REGISTRY[toolName];
  if (!tool) {
    throw new Error(`Tool '${toolName}' is not registered.`);
  }

  console.log(`[TOOL] ${toolName}(${Object.keys(args).length > 0 ? JSON.stringify(args) : ''})`);
  const startTime = Date.now();
  try {
    const result = await tool.fn(companyId, args);
    const duration = Date.now() - startTime;
    return {
      tool: toolName,
      success: true,
      durationMs: duration,
      result
    };
  } catch (err) {
    const duration = Date.now() - startTime;
    console.error(`[TOOL ERROR] ${toolName} failed:`, err.message);
    return {
      tool: toolName,
      success: false,
      durationMs: duration,
      error: err.message
    };
  }
}

function listAvailableTools() {
  return Object.entries(TOOL_REGISTRY).map(([name, meta]) => ({
    name,
    description: meta.description
  }));
}

module.exports = {
  TOOL_REGISTRY,
  executeTool,
  listAvailableTools,
  getFinancialSummary,
  getRevenue,
  getExpenses,
  getTransactions,
  getSales,
  getOutstandingInvoices,
  calculateCashFlow,
  calculateBurnRate,
  calculateRunway,
  compareBudget,
  detectAnomalies,
  validateFinancialReport,
  getCompanyPolicy,
  saveMemoryTool,
  retrieveMemoryTool,
  recordAgentAction
};
