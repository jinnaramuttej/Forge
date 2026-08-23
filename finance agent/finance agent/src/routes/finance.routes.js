const express = require('express');
const router = express.Router();
const {
  getSummaryHandler,
  getRevenueHandler,
  getExpensesHandler,
  getCashflowHandler,
  getRunwayHandler,
  getInvoicesHandler
} = require('../controllers/finance.controller');

// GET /api/finance/summary
router.get('/summary', getSummaryHandler);

// GET /api/finance/revenue
router.get('/revenue', getRevenueHandler);

// GET /api/finance/expenses
router.get('/expenses', getExpensesHandler);

// GET /api/finance/cashflow
router.get('/cashflow', getCashflowHandler);

// GET /api/finance/runway
router.get('/runway', getRunwayHandler);

// GET /api/finance/invoices
router.get('/invoices', getInvoicesHandler);

module.exports = router;
