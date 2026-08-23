const { db } = require('../database/supabase');
const calc = require('../utils/calculations');

async function detectAnomalies(companyId) {
  const [orders, customers] = await Promise.all([
    db.find('sales_orders', { company_id: companyId }),
    db.find('customers', { company_id: companyId })
  ]);

  return calc.detectAnomalies(orders, customers);
}

module.exports = { detectAnomalies };
