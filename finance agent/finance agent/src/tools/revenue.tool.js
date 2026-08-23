const { db } = require('../database/supabase');
const calc = require('../utils/calculations');

async function getRevenue(companyId, { startDate, endDate } = {}) {
  let orders = await db.find('sales_orders', { company_id: companyId });

  if (startDate) {
    orders = orders.filter(o => o.order_date >= startDate);
  }
  if (endDate) {
    orders = orders.filter(o => o.order_date <= endDate);
  }

  const revenueData = calc.calculateRevenue(orders);
  return {
    period: {
      startDate: startDate || '2024-04-01',
      endDate: endDate || '2024-08-31'
    },
    ...revenueData
  };
}

module.exports = { getRevenue };
