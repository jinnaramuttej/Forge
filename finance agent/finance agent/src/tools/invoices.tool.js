const { db } = require('../database/supabase');
const calc = require('../utils/calculations');

async function getSales(companyId, { limit = 20, status } = {}) {
  let orders = await db.find('sales_orders', { company_id: companyId });

  if (status) {
    orders = orders.filter(o => o.status === status);
  }

  // Sort descending by order_date
  orders.sort((a, b) => (b.order_date || '').localeCompare(a.order_date || ''));

  return {
    totalOrders: orders.length,
    returnedCount: Math.min(orders.length, limit),
    salesOrders: orders.slice(0, Number(limit) || 20)
  };
}

async function getOutstandingInvoices(companyId, { overdueOnly = false } = {}) {
  const [orders, customers] = await Promise.all([
    db.find('sales_orders', { company_id: companyId }),
    db.find('customers', { company_id: companyId })
  ]);

  const invoiceData = calc.calculateOutstandingInvoices(orders, customers);

  if (overdueOnly) {
    return {
      ...invoiceData,
      invoices: invoiceData.invoices.filter(i => i.isOverdue)
    };
  }

  return invoiceData;
}

module.exports = {
  getSales,
  getOutstandingInvoices
};
