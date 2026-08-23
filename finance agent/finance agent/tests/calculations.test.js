const { describe, it } = require('node:test');
const assert = require('node:assert');
const calc = require('../src/utils/calculations');

describe('Deterministic Financial Calculations', () => {
  it('should round numbers to 2 decimal places properly', () => {
    assert.strictEqual(calc.roundGbp(10.555), 10.56);
    assert.strictEqual(calc.roundGbp(10.554), 10.55);
    assert.strictEqual(calc.roundGbp(null), 0.00);
  });

  it('should calculate revenue from sales orders accurately', () => {
    const orders = [
      { order_number: 'SO-1', order_date: '2024-04-10', subtotal: 100, gst_amount: 20, total_amount: 120, status: 'confirmed' },
      { order_number: 'SO-2', order_date: '2024-04-15', subtotal: 200, gst_amount: 40, total_amount: 240, status: 'confirmed' },
      { order_number: 'SO-3', order_date: '2024-04-20', subtotal: 50, gst_amount: 10, total_amount: 60, status: 'cancelled' }
    ];

    const result = calc.calculateRevenue(orders);
    assert.strictEqual(result.orderCount, 2);
    assert.strictEqual(result.totalSubtotal, 300);
    assert.strictEqual(result.totalGst, 60);
    assert.strictEqual(result.totalGrossRevenue, 360);
    assert.strictEqual(result.averageOrderValue, 180);
    assert.strictEqual(result.monthlyBreakdown.length, 1);
    assert.strictEqual(result.monthlyBreakdown[0].month, '2024-04');
  });

  it('should calculate expenses from employee payroll and sales data', () => {
    const employees = [
      { annual_salary: 60000, status: 'active' },
      { annual_salary: 48000, status: 'active' },
      { annual_salary: 50000, status: 'terminated' }
    ];
    const orders = [
      { subtotal: 10000, status: 'confirmed' }
    ];

    const result = calc.calculateExpenses(employees, orders);
    assert.strictEqual(result.activeEmployeeCount, 2);
    assert.strictEqual(result.annualPayroll, 108000);
    assert.strictEqual(result.monthlyPayroll, 9000);
    assert.ok(result.averageMonthlyExpenses > 9000);
  });

  it('should calculate cash flow correctly', () => {
    const rev = { totalGrossRevenue: 100000 };
    const exp = { totalPeriodExpenses: 80000 };
    const result = calc.calculateCashFlow(rev, exp, 4);

    assert.strictEqual(result.totalCashInflows, 100000);
    assert.strictEqual(result.totalCashOutflows, 80000);
    assert.strictEqual(result.netCashFlow, 20000);
    assert.strictEqual(result.isCashFlowPositive, true);
    assert.strictEqual(result.netMonthlyCashFlow, 5000);
  });

  it('should calculate burn rate correctly', () => {
    const exp = { averageMonthlyExpenses: 25000 };
    const rev = { totalGrossRevenue: 90000 }; // 90000 / 4.5 = 20000/mo
    const result = calc.calculateBurnRate(exp, rev);

    assert.strictEqual(result.grossMonthlyBurnRate, 25000);
    assert.strictEqual(result.netMonthlyBurnRate, 5000);
    assert.strictEqual(result.isBurningCash, true);
  });

  it('should evaluate 60-day financial safety accurately', () => {
    const burn = { grossMonthlyBurnRate: 20000, netMonthlyBurnRate: 5000 };
    
    // Safe scenario: £150,000 cash balance vs £5,000 net burn -> ~30 months runway
    const safeResult = calc.calculateRunway(150000, burn, 50000);
    assert.strictEqual(safeResult.isSafe60Days, true);
    assert.strictEqual(safeResult.riskLevel, 'low');
    assert.ok(safeResult.runwayDays >= 60);
    assert.ok(safeResult.projectedCash60Days >= 50000);

    // Unsafe scenario: £40,000 cash balance vs £25,000 net burn
    const unsafeBurn = { grossMonthlyBurnRate: 30000, netMonthlyBurnRate: 25000 };
    const unsafeResult = calc.calculateRunway(40000, unsafeBurn, 50000);
    assert.strictEqual(unsafeResult.isSafe60Days, false);
    assert.strictEqual(unsafeResult.riskLevel, 'critical');
  });

  it('should calculate outstanding invoices and identify overdue receivables', () => {
    const customers = [
      { id: 'c-1', name: 'Acme Corp', payment_terms_days: 14 }
    ];
    const orders = [
      { id: 'o-1', order_number: 'SO-101', customer_id: 'c-1', order_date: '2024-07-01', total_amount: 1500, status: 'confirmed' }
    ];

    const result = calc.calculateOutstandingInvoices(orders, customers, '2024-08-01');
    assert.strictEqual(result.totalOutstandingInvoices, 1);
    assert.strictEqual(result.overdueCount, 1);
    assert.strictEqual(result.totalOverdueAmountGbp, 1500);
    assert.strictEqual(result.invoices[0].isOverdue, true);
    assert.strictEqual(result.invoices[0].daysOverdue, 17);
  });

  it('should detect anomalies and outlier orders', () => {
    const customers = [{ id: 'c-1', name: 'Test Co', credit_limit: 1000 }];
    const orders = [
      { id: 'o-1', order_number: 'SO-1', customer_id: 'c-1', total_amount: 200 },
      { id: 'o-2', order_number: 'SO-2', customer_id: 'c-1', total_amount: 250 },
      { id: 'o-3', order_number: 'SO-3', customer_id: 'c-1', total_amount: 300 },
      { id: 'o-4', order_number: 'SO-4', customer_id: 'c-1', total_amount: 8500 } // Outlier & credit breach
    ];

    const result = calc.detectAnomalies(orders, customers);
    assert.ok(result.anomalyCount > 0);
    assert.ok(result.anomalies.some(a => a.type === 'credit_limit_exceeded'));
  });
});
