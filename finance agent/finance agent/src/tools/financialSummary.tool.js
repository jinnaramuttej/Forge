const { db } = require('../database/supabase');
const calc = require('../utils/calculations');

async function getFinancialSummary(companyId) {
  const [company, orders, employees, products, customers] = await Promise.all([
    db.findOne('companies', { id: companyId }),
    db.find('sales_orders', { company_id: companyId }),
    db.find('employees', { company_id: companyId }),
    db.find('products', { company_id: companyId }),
    db.find('customers', { company_id: companyId })
  ]);

  const revenue = calc.calculateRevenue(orders);
  const expenses = calc.calculateExpenses(employees, orders, products);
  const cashFlow = calc.calculateCashFlow(revenue, expenses);
  const burn = calc.calculateBurnRate(expenses, revenue);
  const runway = calc.calculateRunway(18375000.00, burn, 5250000.00); // Baseline operating cash £18.3M

  return {
    companyName: company?.name || 'Peak District Outdoor Supplies Ltd',
    industry: company?.industry || 'retail',
    currency: 'GBP',
    totalGrossRevenue: revenue.totalGrossRevenue,
    totalSubtotalRevenue: revenue.totalSubtotal,
    totalPeriodExpenses: expenses.totalPeriodExpenses,
    averageMonthlyExpenses: expenses.averageMonthlyExpenses,
    netCashFlow: cashFlow.netCashFlow,
    isCashFlowPositive: cashFlow.isCashFlowPositive,
    monthlyGrossBurnRate: burn.grossMonthlyBurnRate,
    runwayMonths: runway.runwayMonths,
    runwayDays: runway.runwayDays,
    isSafe60Days: runway.isSafe60Days,
    totalSalesOrders: revenue.orderCount,
    activeEmployees: expenses.activeEmployeeCount,
    totalCustomers: customers.length
  };
}

module.exports = { getFinancialSummary };
