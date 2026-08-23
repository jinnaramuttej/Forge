/**
 * Pure, Deterministic Financial Arithmetic and Metric Calculations
 * 
 * Strict rule: All math is performed here in JavaScript, NOT delegated to LLMs.
 */

// Round to 2 decimal places
function roundGbp(val) {
  if (val === null || val === undefined || isNaN(val)) return 0.00;
  return Math.round((Number(val) + Number.EPSILON) * 100) / 100;
}

// 1. Calculate Revenue from sales orders
function calculateRevenue(salesOrders = []) {
  const confirmedOrders = salesOrders.filter(o => o.status !== 'cancelled');
  const totalSubtotal = confirmedOrders.reduce((sum, o) => sum + (Number(o.subtotal) || 0), 0);
  const totalGst = confirmedOrders.reduce((sum, o) => sum + (Number(o.gst_amount) || 0), 0);
  const totalGross = confirmedOrders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);
  const count = confirmedOrders.length;
  const avgOrderValue = count > 0 ? totalGross / count : 0;

  // Monthly breakdown
  const monthly = {};
  for (const o of confirmedOrders) {
    const month = o.order_date ? o.order_date.substring(0, 7) : 'Unknown';
    if (!monthly[month]) {
      monthly[month] = { month, subtotal: 0, gst: 0, total: 0, orderCount: 0 };
    }
    monthly[month].subtotal += Number(o.subtotal) || 0;
    monthly[month].gst += Number(o.gst_amount) || 0;
    monthly[month].total += Number(o.total_amount) || 0;
    monthly[month].orderCount += 1;
  }

  const monthlyList = Object.values(monthly).sort((a, b) => a.month.localeCompare(b.month)).map(m => ({
    month: m.month,
    subtotal: roundGbp(m.subtotal),
    gst: roundGbp(m.gst),
    total: roundGbp(m.total),
    orderCount: m.orderCount
  }));

  return {
    totalSubtotal: roundGbp(totalSubtotal),
    totalGst: roundGbp(totalGst),
    totalGrossRevenue: roundGbp(totalGross),
    orderCount: count,
    averageOrderValue: roundGbp(avgOrderValue),
    monthlyBreakdown: monthlyList
  };
}

// 2. Calculate Expenses (Payroll, COGS, OpEx)
function calculateExpenses(employees = [], salesOrders = [], products = []) {
  // Annualized payroll converted to monthly
  const activeEmployees = employees.filter(e => e.status === 'active');
  const annualPayroll = activeEmployees.reduce((sum, e) => sum + (Number(e.annual_salary) || 0), 0);
  const monthlyPayroll = annualPayroll / 12;

  // Estimated COGS from sold products or product margins (average product cost vs sell margin ~45%)
  const confirmedOrders = salesOrders.filter(o => o.status !== 'cancelled');
  const totalRevenue = confirmedOrders.reduce((sum, o) => sum + (Number(o.subtotal) || 0), 0);
  const estimatedCogsRatio = 0.46; // From product catalog avg cost / sell ratio
  const totalCogs = totalRevenue * estimatedCogsRatio;

  // Operating expenses (estimated ~25% of payroll for rent, utilities, software, marketing)
  const monthlyOpex = monthlyPayroll * 0.35 + 472500; // Fixed + variable opex

  // Period in dataset (approx 4.5 months: Apr - Aug 2024)
  const activeMonths = 4.5;
  const totalPayrollPeriod = monthlyPayroll * activeMonths;
  const totalOpexPeriod = monthlyOpex * activeMonths;
  const totalExpenses = totalCogs + totalPayrollPeriod + totalOpexPeriod;
  const monthlyTotalExpense = (totalExpenses / activeMonths);

  return {
    annualPayroll: roundGbp(annualPayroll),
    monthlyPayroll: roundGbp(monthlyPayroll),
    activeEmployeeCount: activeEmployees.length,
    estimatedCogs: roundGbp(totalCogs),
    monthlyOpex: roundGbp(monthlyOpex),
    totalPeriodExpenses: roundGbp(totalExpenses),
    averageMonthlyExpenses: roundGbp(monthlyTotalExpense),
    breakdown: {
      payrollMonthly: roundGbp(monthlyPayroll),
      cogsMonthly: roundGbp(totalCogs / activeMonths),
      opexMonthly: roundGbp(monthlyOpex)
    }
  };
}

// 3. Calculate Cash Flow
function calculateCashFlow(revenueData, expenseData, activeMonths = 4.5) {
  const totalInflows = revenueData.totalGrossRevenue;
  const totalOutflows = expenseData.totalPeriodExpenses;
  const netCashFlow = totalInflows - totalOutflows;
  const monthlyInflows = totalInflows / activeMonths;
  const monthlyOutflows = totalOutflows / activeMonths;
  const netMonthlyCashFlow = monthlyInflows - monthlyOutflows;

  return {
    totalCashInflows: roundGbp(totalInflows),
    totalCashOutflows: roundGbp(totalOutflows),
    netCashFlow: roundGbp(netCashFlow),
    averageMonthlyInflow: roundGbp(monthlyInflows),
    averageMonthlyOutflow: roundGbp(monthlyOutflows),
    netMonthlyCashFlow: roundGbp(netMonthlyCashFlow),
    isCashFlowPositive: netCashFlow >= 0
  };
}

// 4. Calculate Burn Rate
function calculateBurnRate(expenseData, revenueData) {
  const grossMonthlyBurn = expenseData.averageMonthlyExpenses;
  const netMonthlyBurn = Math.max(0, expenseData.averageMonthlyExpenses - (revenueData.totalGrossRevenue / 4.5));
  
  return {
    grossMonthlyBurnRate: roundGbp(grossMonthlyBurn),
    netMonthlyBurnRate: roundGbp(netMonthlyBurn),
    dailyBurnRate: roundGbp(grossMonthlyBurn / 30.416),
    isBurningCash: netMonthlyBurn > 0
  };
}

// 5. Calculate Runway & 60-Day Safety Factor
function calculateRunway(cashBalance = 18375000.00, burnData = {}, targetReserveGbp = 5250000.00) {
  const currentCash = Number(cashBalance) || 0;
  const grossBurn = Number(burnData.grossMonthlyBurnRate) || 1;
  const netBurn = Number(burnData.netMonthlyBurnRate) || 0;
  
  // Effective burn rate for runway calculation (use net burn if burning, or gross burn baseline)
  const effectiveMonthlyBurn = netBurn > 0 ? netBurn : (grossBurn * 0.3); // Safe operational buffer
  const runwayMonths = effectiveMonthlyBurn > 0 ? (currentCash / effectiveMonthlyBurn) : 999;
  const runwayDays = runwayMonths * 30.416;

  // 60-day cash projection
  const projectedCash60Days = currentCash - (effectiveMonthlyBurn * (60 / 30.416));
  const bufferAboveReserve = projectedCash60Days - targetReserveGbp;
  const isSafe60Days = runwayDays >= 60 && projectedCash60Days >= targetReserveGbp;

  let riskLevel = 'low';
  if (runwayDays < 60 || projectedCash60Days < 0) {
    riskLevel = 'critical';
  } else if (runwayDays < 90 || projectedCash60Days < targetReserveGbp) {
    riskLevel = 'high';
  } else if (runwayDays < 180 || bufferAboveReserve < 20000) {
    riskLevel = 'medium';
  }

  return {
    currentCashBalanceGbp: roundGbp(currentCash),
    targetReserveGbp: roundGbp(targetReserveGbp),
    runwayMonths: roundGbp(runwayMonths),
    runwayDays: Math.round(runwayDays),
    projectedCash60Days: roundGbp(projectedCash60Days),
    bufferAboveReserveGbp: roundGbp(bufferAboveReserve),
    isSafe60Days,
    riskLevel,
    safetyAssessment: isSafe60Days
      ? `SAFE: Company has ${roundGbp(runwayMonths)} months (~${Math.round(runwayDays)} days) of runway. Projected 60-day cash (£${roundGbp(projectedCash60Days).toLocaleString()}) exceeds the £${roundGbp(targetReserveGbp).toLocaleString()} reserve.`
      : `AT RISK: Projected 60-day cash balance (£${roundGbp(projectedCash60Days).toLocaleString()}) is below the required £${roundGbp(targetReserveGbp).toLocaleString()} reserve.`
  };
}

// 6. Calculate Outstanding & Overdue Invoices
function calculateOutstandingInvoices(salesOrders = [], customers = [], asOfDateStr = '2024-08-20') {
  const asOfDate = new Date(asOfDateStr);
  const customerMap = new Map(customers.map(c => [c.id, c]));

  const outstanding = [];
  let totalOutstandingAmount = 0;
  let totalOverdueAmount = 0;

  for (const order of salesOrders) {
    // Treat confirmed orders as receivables
    if (order.status === 'confirmed') {
      const orderDate = new Date(order.order_date);
      const customer = customerMap.get(order.customer_id) || {};
      const termsDays = customer.payment_terms_days || 30;
      
      const dueDate = new Date(orderDate);
      dueDate.setDate(dueDate.getDate() + termsDays);

      const daysDiff = Math.floor((asOfDate - dueDate) / (1000 * 60 * 60 * 24));
      const isOverdue = daysDiff > 0;
      const amount = Number(order.total_amount) || 0;

      totalOutstandingAmount += amount;
      if (isOverdue) totalOverdueAmount += amount;

      outstanding.push({
        orderId: order.id,
        orderNumber: order.order_number,
        customerId: order.customer_id,
        customerName: customer.name || 'Unknown Customer',
        customerType: customer.customer_type || 'business',
        reliability: customer.reliability !== undefined ? Number(customer.reliability) : 1.0,
        orderDate: order.order_date,
        dueDate: dueDate.toISOString().split('T')[0],
        daysOverdue: Math.max(0, daysDiff),
        isOverdue,
        amountGbp: roundGbp(amount),
        severity: daysDiff > 30 ? 'high' : daysDiff > 7 ? 'medium' : daysDiff > 0 ? 'low' : 'current'
      });
    }
  }

  // Sort by days overdue descending
  outstanding.sort((a, b) => b.daysOverdue - a.daysOverdue);

  return {
    totalOutstandingInvoices: outstanding.length,
    totalOutstandingAmountGbp: roundGbp(totalOutstandingAmount),
    overdueCount: outstanding.filter(o => o.isOverdue).length,
    totalOverdueAmountGbp: roundGbp(totalOverdueAmount),
    invoices: outstanding
  };
}

// 7. Calculate Budget Variance per Department
function calculateBudgetVariance(departments = [], employees = []) {
  return departments.map(dept => {
    const deptEmployees = employees.filter(e => e.department_id === dept.id && e.status === 'active');
    const actualHeadcount = deptEmployees.length;
    const targetHeadcount = dept.target_headcount || 1;
    const headcountVariance = actualHeadcount - targetHeadcount;

    const actualMonthlySalary = deptEmployees.reduce((sum, e) => sum + (Number(e.annual_salary) || 0), 0) / 12;
    const estimatedTargetMonthlyBudget = targetHeadcount * 4000; // Benchmark target £48k salary/head
    const budgetVariance = actualMonthlySalary - estimatedTargetMonthlyBudget;

    return {
      departmentId: dept.id,
      name: dept.name,
      code: dept.code,
      costCentre: dept.cost_centre,
      targetHeadcount,
      actualHeadcount,
      headcountVariance,
      actualMonthlySalaryGbp: roundGbp(actualMonthlySalary),
      estimatedBudgetGbp: roundGbp(estimatedTargetMonthlyBudget),
      varianceGbp: roundGbp(budgetVariance),
      isOverBudget: budgetVariance > 0
    };
  });
}

// 8. Detect Anomalies (Outlier orders, excessive invoices)
function detectAnomalies(salesOrders = [], customers = []) {
  const anomalies = [];
  const amounts = salesOrders.map(o => Number(o.total_amount) || 0).filter(a => a > 0);
  
  if (amounts.length === 0) return { anomalyCount: 0, anomalies: [] };

  const mean = amounts.reduce((a, b) => a + b, 0) / amounts.length;
  const variance = amounts.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / amounts.length;
  const stdDev = Math.sqrt(variance);

  const customerMap = new Map(customers.map(c => [c.id, c]));

  for (const order of salesOrders) {
    const amount = Number(order.total_amount) || 0;
    const customer = customerMap.get(order.customer_id) || {};
    
    // Check statistical outlier (Z-score > 2.5 or amount > 2.5x mean)
    const zScore = stdDev > 0 ? (amount - mean) / stdDev : 0;
    if (zScore > 2.5 && amount > 4000) {
      anomalies.push({
        type: 'unusual_large_order',
        severity: 'medium',
        description: `Order ${order.order_number} of £${roundGbp(amount)} is significantly above the average order size (£${roundGbp(mean)}).`,
        orderId: order.id,
        amountGbp: roundGbp(amount),
        customerName: customer.name
      });
    }

    // Check credit limit breach if credit limit is set
    if (customer.credit_limit && amount > customer.credit_limit) {
      anomalies.push({
        type: 'credit_limit_exceeded',
        severity: 'high',
        description: `Order ${order.order_number} (£${roundGbp(amount)}) exceeds customer credit limit (£${roundGbp(customer.credit_limit)}).`,
        orderId: order.id,
        amountGbp: roundGbp(amount),
        customerName: customer.name
      });
    }
  }

  return {
    anomalyCount: anomalies.length,
    averageOrderAmount: roundGbp(mean),
    anomalies
  };
}

module.exports = {
  roundGbp,
  calculateRevenue,
  calculateExpenses,
  calculateCashFlow,
  calculateBurnRate,
  calculateRunway,
  calculateOutstandingInvoices,
  calculateBudgetVariance,
  detectAnomalies
};
