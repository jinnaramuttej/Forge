const { db } = require('../database/supabase');
const calc = require('../utils/calculations');

async function calculateCashFlow(companyId) {
  const [orders, employees, products] = await Promise.all([
    db.find('sales_orders', { company_id: companyId }),
    db.find('employees', { company_id: companyId }),
    db.find('products', { company_id: companyId })
  ]);

  const revenue = calc.calculateRevenue(orders);
  const expenses = calc.calculateExpenses(employees, orders, products);
  const cashFlow = calc.calculateCashFlow(revenue, expenses);

  return {
    ...cashFlow,
    monthlyBreakdown: revenue.monthlyBreakdown
  };
}

module.exports = { calculateCashFlow };
