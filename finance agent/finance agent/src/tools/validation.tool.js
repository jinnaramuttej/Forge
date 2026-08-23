const { validateFinancialDocument } = require('../services/reportValidation.service');

async function validateFinancialReport(companyId, { document, title = 'Financial Report' } = {}) {
  if (!document) {
    throw new Error('Document content is required for financial report validation.');
  }

  return await validateFinancialDocument(companyId, document, title);
}

module.exports = { validateFinancialReport };
