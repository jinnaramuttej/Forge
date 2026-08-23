const { db } = require('../database/supabase');
const calc = require('../utils/calculations');

async function getExpenses(companyId) {
  const [employees, orders, products] = await Promise.all([
    db.find('employees', { company_id: companyId }),
    db.find('sales_orders', { company_id: companyId }),
    db.find('products', { company_id: companyId })
  ]);

  const expenseData = calc.calculateExpenses(employees, orders, products);
  return expenseData;
}

module.exports = { getExpenses };
