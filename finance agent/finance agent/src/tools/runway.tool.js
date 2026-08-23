const { db } = require('../database/supabase');
const calc = require('../utils/calculations');

async function calculateRunway(companyId, { currentCashBalance = 18375000.00, targetReserveGbp = 5250000.00 } = {}) {
  const [orders, employees, products, policies] = await Promise.all([
    db.find('sales_orders', { company_id: companyId }),
    db.find('employees', { company_id: companyId }),
    db.find('products', { company_id: companyId }),
    db.find('financial_policies', { company_id: companyId, policy_type: 'min_cash_reserve', is_active: true })
  ]);

  const reservePolicy = policies[0];
  const requiredReserve = reservePolicy?.parameters?.target_reserve_gbp || targetReserveGbp;

  const revenue = calc.calculateRevenue(orders);
  const expenses = calc.calculateExpenses(employees, orders, products);
  const burn = calc.calculateBurnRate(expenses, revenue);

  const runwayData = calc.calculateRunway(currentCashBalance, burn, requiredReserve);

  return runwayData;
}

module.exports = { calculateRunway };
