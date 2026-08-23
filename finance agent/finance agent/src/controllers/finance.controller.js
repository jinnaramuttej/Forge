const {
  getFinancialSummary,
  getRevenue,
  getExpenses,
  calculateCashFlow,
  calculateRunway,
  getOutstandingInvoices
} = require('../tools');
const env = require('../config/env');

function resolveCompanyId(req) {
  return req.query.companyId || req.headers['x-company-id'] || env.DEFAULT_COMPANY_ID;
}

async function getSummaryHandler(req, res) {
  try {
    const companyId = resolveCompanyId(req);
    const summary = await getFinancialSummary(companyId);
    return res.status(200).json(summary);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve summary', message: err.message });
  }
}

async function getRevenueHandler(req, res) {
  try {
    const companyId = resolveCompanyId(req);
    const { startDate, endDate } = req.query;
    const revenue = await getRevenue(companyId, { startDate, endDate });
    return res.status(200).json(revenue);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve revenue', message: err.message });
  }
}

async function getExpensesHandler(req, res) {
  try {
    const companyId = resolveCompanyId(req);
    const expenses = await getExpenses(companyId);
    return res.status(200).json(expenses);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve expenses', message: err.message });
  }
}

async function getCashflowHandler(req, res) {
  try {
    const companyId = resolveCompanyId(req);
    const cashflow = await calculateCashFlow(companyId);
    return res.status(200).json(cashflow);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve cashflow', message: err.message });
  }
}

async function getRunwayHandler(req, res) {
  try {
    const companyId = resolveCompanyId(req);
    const runway = await calculateRunway(companyId);
    return res.status(200).json(runway);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve runway', message: err.message });
  }
}

async function getInvoicesHandler(req, res) {
  try {
    const companyId = resolveCompanyId(req);
    const overdueOnly = req.query.overdueOnly === 'true';
    const invoices = await getOutstandingInvoices(companyId, { overdueOnly });
    return res.status(200).json(invoices);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve invoices', message: err.message });
  }
}

module.exports = {
  getSummaryHandler,
  getRevenueHandler,
  getExpensesHandler,
  getCashflowHandler,
  getRunwayHandler,
  getInvoicesHandler
};
