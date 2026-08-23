const {
  getFinancialSummary,
  getRevenue,
  getExpenses,
  calculateCashFlow,
  calculateBurnRate,
  calculateRunway,
  getOutstandingInvoices
} = require('../tools');

async function getFullFinanceOverview(companyId) {
  const [summary, revenue, expenses, cashflow, runway, invoices] = await Promise.all([
    getFinancialSummary(companyId),
    getRevenue(companyId),
    getExpenses(companyId),
    calculateCashFlow(companyId),
    calculateRunway(companyId),
    getOutstandingInvoices(companyId)
  ]);

  return {
    companyId,
    timestamp: new Date().toISOString(),
    summary,
    revenue,
    expenses,
    cashflow,
    runway,
    invoicesSummary: {
      totalOutstanding: invoices.totalOutstandingAmountGbp,
      overdueCount: invoices.overdueCount,
      totalOverdue: invoices.totalOverdueAmountGbp
    }
  };
}

module.exports = {
  getFullFinanceOverview,
  getFinancialSummary,
  getRevenue,
  getExpenses,
  calculateCashFlow,
  calculateBurnRate,
  calculateRunway,
  getOutstandingInvoices
};
