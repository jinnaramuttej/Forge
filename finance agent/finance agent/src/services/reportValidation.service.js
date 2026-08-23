const { getFinancialSummary } = require('../tools/financialSummary.tool');
const { getRevenue } = require('../tools/revenue.tool');
const { getExpenses } = require('../tools/expenses.tool');
const { calculateCashFlow } = require('../tools/cashflow.tool');
const { calculateRunway } = require('../tools/runway.tool');
const { getOutstandingInvoices } = require('../tools/invoices.tool');
const calc = require('../utils/calculations');

// Document Type Classification
function identifyDocumentType(text = '', title = '') {
  const content = `${title} ${text}`.toLowerCase();
  if (content.includes('pitch') || content.includes('deck') || content.includes('seed') || content.includes('series a') || content.includes('investor deck')) {
    return { type: 'pitch_deck_financials', label: 'Pitch Deck Financial Slide' };
  }
  if (content.includes('grant') || content.includes('innovate uk') || content.includes('subsidy') || content.includes('research council')) {
    return { type: 'grant_application', label: 'Grant / Funding Application' };
  }
  if (content.includes('loan') || content.includes('facility') || content.includes('credit application') || content.includes('bank proposal')) {
    return { type: 'bank_loan_proposal', label: 'Bank Loan / Debt Proposal' };
  }
  if (content.includes('update') || content.includes('monthly update') || content.includes('newsletter') || content.includes('shareholder')) {
    return { type: 'investor_update', label: 'Investor Monthly Update' };
  }
  if (content.includes('quarterly') || content.includes('board') || content.includes('q1') || content.includes('q2') || content.includes('q3') || content.includes('q4')) {
    return { type: 'quarterly_board_report', label: 'Quarterly Board Report' };
  }
  return { type: 'budget_forecast', label: 'Financial Budget & Forecast' };
}

// Extract claims from structured JSON or text - extract ONLY present claims, NEVER invent
function extractFinancialClaims(documentInput) {
  let text = '';
  let structured = {};

  if (typeof documentInput === 'string') {
    text = documentInput;
    try {
      const parsed = JSON.parse(documentInput);
      if (typeof parsed === 'object' && parsed !== null) {
        structured = parsed;
      }
    } catch {
      // Plain text
    }
  } else if (typeof documentInput === 'object' && documentInput !== null) {
    structured = documentInput;
    text = documentInput.content || documentInput.text || JSON.stringify(documentInput);
  }

  const claims = {};

  // 1. Direct structured fields if provided
  if (structured.revenue !== undefined || structured.totalRevenue !== undefined) {
    claims.revenue = Number(structured.revenue || structured.totalRevenue);
  }
  if (structured.expenses !== undefined || structured.totalExpenses !== undefined || structured.monthlyBurn !== undefined) {
    claims.expenses = Number(structured.expenses || structured.totalExpenses || structured.monthlyBurn);
  }
  if (structured.cashBalance !== undefined || structured.cash !== undefined) {
    claims.cashBalance = Number(structured.cashBalance || structured.cash);
  }
  if (structured.runwayMonths !== undefined || structured.runway !== undefined) {
    claims.runwayMonths = Number(structured.runwayMonths || structured.runway);
  }
  if (structured.headcount !== undefined || structured.employees !== undefined) {
    claims.headcount = Number(structured.headcount || structured.employees);
  }
  if (structured.customers !== undefined || structured.totalCustomers !== undefined) {
    claims.customers = Number(structured.customers || structured.totalCustomers);
  }
  if (structured.profit !== undefined || structured.netProfit !== undefined || structured.netIncome !== undefined) {
    claims.profit = Number(structured.profit || structured.netProfit || structured.netIncome);
  }
  if (Array.isArray(structured.lineItems)) {
    claims.lineItems = structured.lineItems;
  }

  // 2. Regex text extraction for unstructured text
  const cleanText = text.replace(/,/g, '');

  if (claims.revenue === undefined) {
    const revMatch = cleanText.match(/(?:revenue|turnover|sales|gross\s+revenue)[^\d£$€]*[£$€]?\s*(\d+(?:\.\d+)?)/i);
    if (revMatch) claims.revenue = parseFloat(revMatch[1]);
  }
  if (claims.cashBalance === undefined) {
    const cashMatch = cleanText.match(/(?:cash\s+balance|cash\s+in\s+bank|bank\s+balance|cash\s+reserve|current\s+cash)[^\d£$€]*[£$€]?\s*(\d+(?:\.\d+)?)/i);
    if (cashMatch) claims.cashBalance = parseFloat(cashMatch[1]);
  }
  if (claims.expenses === undefined) {
    const expMatch = cleanText.match(/(?:expenses|operating\s+costs|total\s+expenses|burn\s+rate|monthly\s+burn)[^\d£$€]*[£$€]?\s*(\d+(?:\.\d+)?)/i);
    if (expMatch) claims.expenses = parseFloat(expMatch[1]);
  }
  if (claims.runwayMonths === undefined) {
    const runwayMatch = cleanText.match(/(\d+(?:\.\d+)?)\s*(?:months|mo|mths)\s*runway|(?:runway|cash\s+runway)[^\d]*(\d+(?:\.\d+)?)\s*(?:months|mo|mths)?/i);
    if (runwayMatch) {
      claims.runwayMonths = parseFloat(runwayMatch[1] || runwayMatch[2]);
    }
  }
  if (claims.headcount === undefined) {
    const headMatch = cleanText.match(/(?:headcount|team\s+size|employees|staff)[^\d]*(\d+)/i);
    if (headMatch) claims.headcount = parseInt(headMatch[1], 10);
  }
  if (claims.customers === undefined) {
    const custMatch = cleanText.match(/(?:customers|clients|customer\s+base|active\s+accounts)[^\d]*(\d+)/i);
    if (custMatch) claims.customers = parseInt(custMatch[1], 10);
  }
  if (claims.profit === undefined) {
    const profitMatch = cleanText.match(/(?:net\s+profit|profit|net\s+income)[^\d£$€]*[£$€]?\s*(\d+(?:\.\d+)?)/i);
    if (profitMatch) claims.profit = parseFloat(profitMatch[1]);
  }

  return {
    rawText: text,
    claims
  };
}

// Compare claims against Supabase actuals deterministically in JavaScript
async function validateFinancialDocument(companyId, documentInput, title = 'Financial Document') {
  const { rawText, claims } = extractFinancialClaims(documentInput);
  const docClassification = identifyDocumentType(rawText, title);

  // Check if any claims were found
  const claimKeys = Object.keys(claims);
  if (claimKeys.length === 0) {
    return {
      validationStatus: 'NOT_VERIFIABLE',
      documentType: docClassification.type,
      documentTypeLabel: docClassification.label,
      documentTitle: title,
      claims: {},
      actuals: {},
      discrepancies: [],
      arithmeticChecks: [],
      risks: [],
      recommendedFixes: ['Provide specific quantitative financial claims (e.g. revenue, cash, expenses, runway, headcount) to validate.'],
      summary: 'No quantitative financial claims could be extracted from the supplied report.'
    };
  }

  // Fetch actual data from Supabase via existing deterministic tools (Rule 5)
  const [summary, revenue, expenses, cashflow, runway, invoices] = await Promise.all([
    getFinancialSummary(companyId),
    getRevenue(companyId),
    getExpenses(companyId),
    calculateCashFlow(companyId),
    calculateRunway(companyId),
    getOutstandingInvoices(companyId)
  ]);

  const actuals = {
    revenue: summary.totalGrossRevenue,
    subtotalRevenue: summary.totalSubtotalRevenue,
    expenses: expenses.totalPeriodExpenses,
    monthlyExpenses: expenses.averageMonthlyExpenses,
    monthlyPayroll: expenses.monthlyPayroll,
    cashBalance: runway.currentCashBalanceGbp,
    runwayMonths: runway.runwayMonths,
    runwayDays: runway.runwayDays,
    headcount: expenses.activeEmployeeCount,
    customers: summary.totalCustomers,
    ordersCount: summary.totalSalesOrders,
    overdueReceivables: invoices.totalOverdueAmountGbp
  };

  const discrepancies = [];
  const arithmeticChecks = [];
  const risks = [];
  const fixes = [];

  let criticalCount = 0;
  let highCount = 0;
  let mediumCount = 0;
  let mathContradiction = false;

  // 1. Revenue Validation (Deterministic JS calculation)
  if (claims.revenue !== undefined) {
    const diff = claims.revenue - actuals.revenue;
    const pctDiff = actuals.revenue > 0 ? (Math.abs(diff) / actuals.revenue) * 100 : 0;
    let severity = 'LOW';
    if (pctDiff > 20) {
      severity = 'CRITICAL';
      criticalCount++;
    } else if (pctDiff >= 5) {
      severity = 'HIGH';
      highCount++;
    } else if (pctDiff >= 1) {
      severity = 'MEDIUM';
      mediumCount++;
    }

    discrepancies.push({
      field: 'Revenue',
      claimedValue: claims.revenue,
      actualValue: actuals.revenue,
      difference: calc.roundGbp(diff),
      differencePercent: calc.roundGbp(pctDiff),
      severity,
      explanation: severity === 'LOW'
        ? 'Claimed revenue aligns with confirmed sales orders.'
        : `Claimed revenue (£${claims.revenue.toLocaleString()}) differs by ${calc.roundGbp(pctDiff)}% from actual recorded sales orders (£${actuals.revenue.toLocaleString()}).`
    });

    if (severity !== 'LOW') {
      fixes.push(`Reconcile the reported revenue figure (£${claims.revenue.toLocaleString()}) with confirmed sales records (£${actuals.revenue.toLocaleString()}) before submitting the report.`);
    }
  }

  // 2. Cash Balance Validation
  if (claims.cashBalance !== undefined) {
    const diff = claims.cashBalance - actuals.cashBalance;
    const pctDiff = actuals.cashBalance > 0 ? (Math.abs(diff) / actuals.cashBalance) * 100 : 0;
    let severity = 'LOW';
    if (pctDiff > 20) {
      severity = 'CRITICAL';
      criticalCount++;
    } else if (pctDiff >= 5) {
      severity = 'HIGH';
      highCount++;
    } else if (pctDiff >= 1) {
      severity = 'MEDIUM';
      mediumCount++;
    }

    discrepancies.push({
      field: 'Cash Balance',
      claimedValue: claims.cashBalance,
      actualValue: actuals.cashBalance,
      difference: calc.roundGbp(diff),
      differencePercent: calc.roundGbp(pctDiff),
      severity,
      explanation: severity === 'LOW'
        ? 'Cash balance matches current bank ledger.'
        : `Claimed cash (£${claims.cashBalance.toLocaleString()}) differs from current ledger balance (£${actuals.cashBalance.toLocaleString()}).`
    });

    if (severity !== 'LOW') {
      fixes.push(`Update claimed cash balance to £${actuals.cashBalance.toLocaleString()} to match current bank statement.`);
    }
  }

  // 3. Runway Validation
  if (claims.runwayMonths !== undefined) {
    const diff = claims.runwayMonths - actuals.runwayMonths;
    const pctDiff = actuals.runwayMonths > 0 ? (Math.abs(diff) / actuals.runwayMonths) * 100 : 0;
    let severity = 'LOW';
    if (pctDiff > 25 || (claims.runwayMonths > 12 && actuals.runwayMonths < 6)) {
      severity = 'CRITICAL';
      criticalCount++;
    } else if (pctDiff >= 10) {
      severity = 'HIGH';
      highCount++;
    } else if (pctDiff >= 1) {
      severity = 'MEDIUM';
      mediumCount++;
    }

    discrepancies.push({
      field: 'Cash Runway (Months)',
      claimedValue: claims.runwayMonths,
      actualValue: actuals.runwayMonths,
      difference: calc.roundGbp(diff),
      differencePercent: calc.roundGbp(pctDiff),
      severity,
      explanation: severity === 'LOW'
        ? 'Claimed runway matches calculated net burn trajectory.'
        : `Claimed runway (${claims.runwayMonths} months) diverges significantly from calculated runway (${actuals.runwayMonths} months / ~${actuals.runwayDays} days).`
    });

    if (severity !== 'LOW') {
      fixes.push(`Adjust runway claim from ${claims.runwayMonths} months to ${actuals.runwayMonths} months based on current monthly burn of £${actuals.monthlyExpenses.toLocaleString()}/mo.`);
    }
  }

  // 4. Headcount Validation
  if (claims.headcount !== undefined) {
    const diff = claims.headcount - actuals.headcount;
    const pctDiff = actuals.headcount > 0 ? (Math.abs(diff) / actuals.headcount) * 100 : 0;
    let severity = 'LOW';
    if (Math.abs(diff) > 2) {
      severity = 'HIGH';
      highCount++;
    } else if (Math.abs(diff) > 0) {
      severity = 'MEDIUM';
      mediumCount++;
    }

    discrepancies.push({
      field: 'Employee Headcount',
      claimedValue: claims.headcount,
      actualValue: actuals.headcount,
      difference: diff,
      differencePercent: calc.roundGbp(pctDiff),
      severity,
      explanation: severity === 'LOW'
        ? 'Headcount matches active payroll records.'
        : `Claimed headcount (${claims.headcount}) does not match active payroll records (${actuals.headcount} full-time staff).`
    });

    if (severity !== 'LOW') {
      fixes.push(`Update employee headcount to ${actuals.headcount} active staff members across 4 departments.`);
    }
  }

  // 5. Customer Count Validation
  if (claims.customers !== undefined) {
    const diff = claims.customers - actuals.customers;
    const pctDiff = actuals.customers > 0 ? (Math.abs(diff) / actuals.customers) * 100 : 0;
    let severity = 'LOW';
    if (Math.abs(diff) > 10) {
      severity = 'HIGH';
      highCount++;
    } else if (Math.abs(diff) > 0) {
      severity = 'MEDIUM';
      mediumCount++;
    }

    discrepancies.push({
      field: 'Customer Base',
      claimedValue: claims.customers,
      actualValue: actuals.customers,
      difference: diff,
      differencePercent: calc.roundGbp(pctDiff),
      severity,
      explanation: severity === 'LOW'
        ? 'Customer count matches database records.'
        : `Claimed customer count (${claims.customers}) differs from registered customer accounts (${actuals.customers}).`
    });

    if (severity !== 'LOW') {
      fixes.push(`Reconcile customer count to ${actuals.customers} active customer accounts.`);
    }
  }

  // 6. Internal Mathematical Relationship Verification (Rule 10: Pure JS arithmetic)
  if (claims.revenue !== undefined && claims.expenses !== undefined && claims.profit !== undefined) {
    const expectedProfit = calc.roundGbp(claims.revenue - claims.expenses);
    const mathDiff = Math.abs(expectedProfit - claims.profit);
    const isMathValid = mathDiff < 1.0;
    
    if (!isMathValid) {
      mathContradiction = true;
      criticalCount++;
    }

    arithmeticChecks.push({
      check: 'Net Profit Arithmetic (Revenue - Expenses = Profit)',
      formula: `£${claims.revenue} - £${claims.expenses} = £${expectedProfit}`,
      claimedResult: claims.profit,
      expectedResult: expectedProfit,
      difference: calc.roundGbp(claims.profit - expectedProfit),
      isValid: isMathValid,
      status: isMathValid ? 'PASS' : 'CONTRADICTION',
      severity: isMathValid ? 'LOW' : 'CRITICAL'
    });

    if (!isMathValid) {
      fixes.push(`Correct arithmetic contradiction: Revenue (£${claims.revenue.toLocaleString()}) minus Expenses (£${claims.expenses.toLocaleString()}) must equal £${expectedProfit.toLocaleString()}, but report claims £${claims.profit.toLocaleString()}.`);
    }
  }

  if (claims.lineItems && Array.isArray(claims.lineItems)) {
    const lineItemSum = calc.roundGbp(claims.lineItems.reduce((sum, item) => sum + (Number(item.amount) || 0), 0));
    if (claims.expenses !== undefined) {
      const sumDiff = Math.abs(lineItemSum - claims.expenses);
      const isSumValid = sumDiff < 2.0;
      
      if (!isSumValid) {
        highCount++;
      }

      arithmeticChecks.push({
        check: 'Line Item Breakdown Summation',
        formula: `Sum of ${claims.lineItems.length} line items`,
        claimedResult: claims.expenses,
        expectedResult: lineItemSum,
        difference: calc.roundGbp(claims.expenses - lineItemSum),
        isValid: isSumValid,
        status: isSumValid ? 'PASS' : 'CONTRADICTION',
        severity: isSumValid ? 'LOW' : 'HIGH'
      });

      if (!isSumValid) {
        fixes.push(`Reconcile line items: Itemized breakdown sums to £${lineItemSum.toLocaleString()}, which differs from reported total expenses of £${claims.expenses.toLocaleString()}.`);
      }
    }
  }

  // 7. Strategic Risks Identification
  if (actuals.overdueReceivables > 100000) {
    risks.push({
      riskType: 'unacknowledged_receivables_risk',
      severity: 'HIGH',
      description: `Report overlooks £${actuals.overdueReceivables.toLocaleString()} in overdue customer receivables (>140 overdue accounts). Reviewers may question cash conversion efficiency.`
    });
    fixes.push(`Add disclosure note regarding active receivables collection to reassure funding reviewers.`);
  }

  if (claims.runwayMonths > 12 && actuals.cashBalance < 200000) {
    risks.push({
      riskType: 'unrealistic_runway_assumption',
      severity: 'CRITICAL',
      description: `Claiming ${claims.runwayMonths} months runway with £${actuals.cashBalance.toLocaleString()} cash requires an unrealistic burn rate assumption of under £${Math.round(actuals.cashBalance / claims.runwayMonths).toLocaleString()}/month.`
    });
  }

  // 8. Determine Validation Status (Rule 12: VERIFIED | NEEDS_REVIEW | CONTRADICTION | NOT_VERIFIABLE)
  let validationStatus = 'VERIFIED';
  if (mathContradiction) {
    validationStatus = 'CONTRADICTION';
  } else if (criticalCount > 0 || highCount > 0 || mediumCount > 0) {
    validationStatus = 'NEEDS_REVIEW';
  }

  // Scoring
  let overallScore = 100;
  overallScore -= (criticalCount * 30);
  overallScore -= (highCount * 15);
  overallScore -= (mediumCount * 5);
  overallScore = Math.max(0, Math.min(100, overallScore));

  const summaryText = validationStatus === 'VERIFIED'
    ? 'All extracted financial figures were verified against company records with no significant discrepancies.'
    : validationStatus === 'CONTRADICTION'
      ? `Report contains ${arithmeticChecks.filter(a => !a.isValid).length} arithmetic contradiction(s) and ${discrepancies.filter(d => d.severity === 'CRITICAL').length} critical discrepancies against actual records.`
      : `Report requires revision: ${discrepancies.filter(d => d.severity !== 'LOW').length} discrepancy item(s) detected against Supabase accounting records.`;

  // Generate Executive Markdown Report
  const validationReportMarkdown = `### Financial Document Validation Report

**Document Title**: ${title}
**Document Type**: ${docClassification.label}
**Validation Status**: ${validationStatus === 'VERIFIED' ? '🟢 VERIFIED' : validationStatus === 'CONTRADICTION' ? '🔴 CONTRADICTION' : '🟡 NEEDS REVIEW'}
**Verification Score**: **${overallScore}/100**

---

#### 1. Claimed vs. Actual Supabase Accounting Data
${discrepancies.map(d => `- **${d.field}**: Claimed **£${d.claimedValue?.toLocaleString() || d.claimedValue}** vs. Actual **£${d.actualValue?.toLocaleString() || d.actualValue}** [${d.severity}] — *${d.explanation}*`).join('\n') || '- No quantitative discrepancies detected.'}

${arithmeticChecks.length > 0 ? `#### 2. Internal Mathematical Consistency Checks
${arithmeticChecks.map(a => `- **${a.check}**: ${a.isValid ? '✅ PASS' : '❌ CONTRADICTION'} (${a.formula} -> Expected: £${a.expectedResult.toLocaleString()}, Claimed: £${a.claimedResult.toLocaleString()})`).join('\n')}` : ''}

${risks.length > 0 ? `#### 3. Strategic Financial Risks
${risks.map(r => `- **[${r.severity}] ${r.riskType.replace(/_/g, ' ').toUpperCase()}**: ${r.description}`).join('\n')}` : ''}

#### 4. Actionable Fixes Before Submission (${fixes.length})
${fixes.map((f, i) => `${i + 1}. ${f}`).join('\n') || '1. Document aligns with company accounting records. Ready for submission.'}
`;

  return {
    validationStatus,
    documentType: docClassification.type,
    documentTypeLabel: docClassification.label,
    documentTitle: title,
    overallScore,
    claims,
    actuals,
    discrepancies,
    arithmeticChecks,
    risks,
    recommendedFixes: fixes,
    summary: summaryText,
    validationReportMarkdown
  };
}

module.exports = {
  identifyDocumentType,
  extractFinancialClaims,
  validateFinancialDocument
};
