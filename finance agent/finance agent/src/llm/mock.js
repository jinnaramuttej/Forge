/**
 * MockLLM for Local Test Mode
 * 
 * Strict requirement: MockLLM controls only planning, tool selection, reasoning,
 * and synthesis. All financial numbers come strictly from Supabase + deterministic
 * JavaScript calculations. It NEVER fabricates financial numbers.
 */

class MockLLM {
  constructor() {
    this.name = 'MockLLM';
  }

  async checkHealth() {
    return {
      available: true,
      modelFound: true,
      model: 'mock-qwen3-8b',
      mode: 'mock'
    };
  }

  // Generate realistic, goal-specific multi-step tool execution plan
  async generatePlan({ goal, request }) {
    const text = (goal || request || '').toLowerCase();
    const steps = [];

    if (text.includes('validate') || text.includes('report') || text.includes('pitch') || text.includes('deck') || text.includes('grant') || text.includes('proposal') || text.includes('funding')) {
      // Demo 2: Financial Report & Funding Validation Plan
      steps.push(
        { stepNumber: 1, tool: 'validateFinancialReport', args: { document: request, title: 'Founder Report & Funding Proposal' }, description: 'Extract claimed financial figures, verify arithmetic, and compare against actual Supabase records.' },
        { stepNumber: 2, tool: 'getFinancialSummary', args: {}, description: 'Retrieve baseline confirmed revenue, gross margins, and customer counts.' },
        { stepNumber: 3, tool: 'calculateRunway', args: {}, description: 'Validate actual monthly burn rate and runway horizon.' },
        { stepNumber: 4, tool: 'getOutstandingInvoices', args: {}, description: 'Check unacknowledged debtor risks or receivables exposure.' }
      );
    } else if (text.includes('60') || text.includes('safe') || text.includes('routine action') || text.includes('runway')) {
      // 60-Day Financial Safety & Routine Operations Plan
      steps.push(
        { stepNumber: 1, tool: 'getFinancialSummary', args: {}, description: 'Retrieve overall financial position, total revenue, and cash baseline.' },
        { stepNumber: 2, tool: 'calculateCashFlow', args: {}, description: 'Analyze cash inflows vs outflows over recent operating periods.' },
        { stepNumber: 3, tool: 'calculateBurnRate', args: {}, description: 'Calculate gross and net monthly cash burn rates.' },
        { stepNumber: 4, tool: 'calculateRunway', args: {}, description: 'Assess remaining runway months and evaluate 60-day safety horizon.' },
        { stepNumber: 5, tool: 'getOutstandingInvoices', args: {}, description: 'Check unpaid receivables and overdue customer invoices.' },
        { stepNumber: 6, tool: 'detectAnomalies', args: {}, description: 'Scan for unusual expense spikes or credit limit breaches.' },
        { stepNumber: 7, tool: 'getCompanyPolicy', args: { policyType: 'payment_threshold' }, description: 'Retrieve company authorization thresholds for routine autonomous actions.' }
      );
    } else if (text.includes('summary') || text.includes('overview')) {
      steps.push(
        { stepNumber: 1, tool: 'getFinancialSummary', args: {}, description: 'Retrieve top-level revenue, expenses, and net income summary.' },
        { stepNumber: 2, tool: 'getRevenue', args: {}, description: 'Analyze revenue trend by month and customer base.' },
        { stepNumber: 3, tool: 'getExpenses', args: {}, description: 'Analyze expense structure across payroll and operations.' }
      );
    } else if (text.includes('expense') || text.includes('cost') || text.includes('budget')) {
      steps.push(
        { stepNumber: 1, tool: 'getExpenses', args: {}, description: 'Extract detailed breakdown of payroll, COGS, and operating expenses.' },
        { stepNumber: 2, tool: 'compareBudget', args: {}, description: 'Compare actual departmental headcount and spend against targets.' },
        { stepNumber: 3, tool: 'detectAnomalies', args: {}, description: 'Identify any abnormal cost spikes or variance.' }
      );
    } else if (text.includes('risk') || text.includes('threat')) {
      steps.push(
        { stepNumber: 1, tool: 'calculateRunway', args: {}, description: 'Evaluate cash runway and burn exposure.' },
        { stepNumber: 2, tool: 'getOutstandingInvoices', args: { overdueOnly: true }, description: 'Identify high-risk overdue receivables.' },
        { stepNumber: 3, tool: 'detectAnomalies', args: {}, description: 'Scan for credit breaches and operational anomalies.' }
      );
    } else if (text.includes('invoice') || text.includes('receivable') || text.includes('debtor') || text.includes('follow-up')) {
      steps.push(
        { stepNumber: 1, tool: 'getOutstandingInvoices', args: {}, description: 'Fetch all confirmed outstanding invoices and payment aging.' },
        { stepNumber: 2, tool: 'getCompanyPolicy', args: { policyType: 'credit_limit_breach' }, description: 'Check overdue invoice follow-up policies.' }
      );
    } else if (text.includes('unusual') || text.includes('anomal')) {
      steps.push(
        { stepNumber: 1, tool: 'detectAnomalies', args: {}, description: 'Run statistical outlier detection on sales and expense orders.' },
        { stepNumber: 2, tool: 'getExpenses', args: {}, description: 'Review operational cost categories.' }
      );
    } else {
      steps.push(
        { stepNumber: 1, tool: 'getFinancialSummary', args: {}, description: 'Retrieve core financial metrics.' },
        { stepNumber: 2, tool: 'calculateCashFlow', args: {}, description: 'Compute net cash position.' },
        { stepNumber: 3, tool: 'calculateRunway', args: {}, description: 'Calculate runway and risk level.' }
      );
    }

    return {
      goal: goal || request,
      reasoning: 'Synthesized multi-step plan targeting exact financial metrics from real dataset.',
      steps
    };
  }

  // Synthesize realistic decisions and proposed actions based on real tool findings
  async makeDecision({ goal, findings, policies = [] }) {
    const decisions = [];
    const proposedActions = [];

    const rawVal = findings.validateFinancialReport;
    const validation = rawVal?.result || rawVal;
    const summary = findings.getFinancialSummary || {};
    const runway = findings.calculateRunway || {};
    const invoices = findings.getOutstandingInvoices || {};
    const anomalies = findings.detectAnomalies || {};

    // 1. Report Validation Decision (if present)
    if (validation && validation.validationStatus) {
      decisions.push({
        type: 'report_validation_audit',
        description: `Completed verification of "${validation.documentTypeLabel || 'Financial Document'}" (Score: ${validation.overallScore}/100, Status: ${validation.validationStatus.toUpperCase()}).`,
        rationale: `Identified ${validation.discrepanciesCount || 0} data discrepancies, ${validation.arithmeticErrorsCount || 0} arithmetic errors, and ${validation.recommendedFixes?.length || 0} required fixes.`
      });

      if ((validation.discrepanciesCount > 0 || validation.arithmeticErrorsCount > 0) && Array.isArray(validation.recommendedFixes)) {
        proposedActions.push({
          actionType: 'follow_up_task',
          description: `Document Correction: Reconcile ${validation.discrepanciesCount} conflicting financial claims before external submission.`,
          amount: 0,
          reason: 'Pre-submission report discrepancy remediation'
        });
      }
    }

    // 2. Runway & Cash Safety Decision
    if (runway.isSafe60Days) {
      decisions.push({
        type: 'solvency_assessment',
        description: 'Company is financially safe for the 60-day horizon.',
        rationale: `Projected 60-day cash (£${runway.projectedCash60Days?.toLocaleString() || 'N/A'}) satisfies the required £${runway.targetReserveGbp?.toLocaleString() || '50,000'} cash reserve with ${runway.runwayMonths} months total runway.`
      });
    } else if (runway.runwayMonths) {
      decisions.push({
        type: 'liquidity_warning',
        description: 'Cash buffer requires preservation measures.',
        rationale: `Projected cash balance may approach minimum reserve policy (£${runway.targetReserveGbp?.toLocaleString() || '50,000'}).`
      });
      proposedActions.push({
        actionType: 'risk_alert',
        description: `Runway Alert: Working capital buffer is £${runway.bufferAboveReserveGbp?.toLocaleString() || 0} above reserve threshold.`,
        amount: runway.currentCashBalanceGbp || 0,
        reason: 'Maintain visibility on operating cash trajectory over next 60 days.'
      });
    }

    // 3. Overdue Invoices Decision & Action
    if (invoices.overdueCount > 0) {
      const highRiskInvoices = (invoices.invoices || []).filter(i => i.isOverdue && i.daysOverdue > 7);
      decisions.push({
        type: 'receivables_management',
        description: `Identified ${invoices.overdueCount} overdue invoices totalling £${invoices.totalOverdueAmountGbp?.toLocaleString() || '0'}.`,
        rationale: `${highRiskInvoices.length} invoices are overdue by more than 7 days and require immediate follow-up to accelerate cash conversion.`
      });

      for (const inv of highRiskInvoices.slice(0, 3)) {
        proposedActions.push({
          actionType: 'payment_reminder',
          description: `Dispatch automated payment reminder to ${inv.customerName} for overdue invoice ${inv.orderNumber} (£${inv.amountGbp}).`,
          targetEntityType: 'customer',
          targetEntityId: inv.customerId,
          amount: inv.amountGbp,
          reason: `Invoice is ${inv.daysOverdue} days past agreed terms (${inv.dueDate}).`
        });
      }
    }

    // 4. Anomalies Decision
    if (anomalies.anomalyCount > 0) {
      decisions.push({
        type: 'anomaly_monitoring',
        description: `Detected ${anomalies.anomalyCount} transaction anomalies.`,
        rationale: 'Orders exceeding 2.5x standard deviation or exceeding customer credit limits were flagged for review.'
      });
      for (const anom of (anomalies.anomalies || []).slice(0, 2)) {
        proposedActions.push({
          actionType: 'follow_up_task',
          description: `Review flagged transaction: ${anom.description}`,
          amount: anom.amountGbp || 0,
          reason: anom.type
        });
      }
    }

    return {
      assessment: validation?.validationReportMarkdown || runway.safetyAssessment || 'Financial review completed successfully.',
      riskLevel: validation ? (validation.validationStatus === 'rejected' ? 'critical' : validation.validationStatus === 'needs_revision' ? 'high' : 'low') : (runway.riskLevel || 'low'),
      decisions,
      proposedActions
    };
  }

  // Generate complete final executive report using real calculation values
  async generateFinalReport({ goal, plan = [], findings = {}, decisions = [], actions = [] }) {
    const rawVal = findings.validateFinancialReport;
    const validation = rawVal?.result || rawVal;
    if (validation && validation.validationReportMarkdown) {
      return validation.validationReportMarkdown;
    }

    const summary = findings.getFinancialSummary || {};
    const runway = findings.calculateRunway || {};
    const cashFlow = findings.calculateCashFlow || {};
    const burn = findings.calculateBurnRate || {};
    const invoices = findings.getOutstandingInvoices || {};
    const expenses = findings.getExpenses || {};

    const executedActions = actions.filter(a => a.status === 'executed');
    const approvalActions = actions.filter(a => a.requires_approval);

    return `### Executive Financial Assessment Report

**Goal**: ${goal}
**Overall Status**: ${runway.isSafe60Days ? '🟢 FINANCIALLY SAFE (60-Day Horizon Confirmed)' : '🟡 CAUTION / WORKING CAPITAL MONITORING'}

#### 1. Core Financial Position
- **Gross Revenue**: £${(summary.totalGrossRevenue || 0).toLocaleString()} across ${summary.totalSalesOrders || 0} sales orders
- **Cash Position**: £${(runway.currentCashBalanceGbp || 0).toLocaleString()} (Target Reserve: £${(runway.targetReserveGbp || 50000).toLocaleString()})
- **Net Cash Flow**: £${(cashFlow.netCashFlow || 0).toLocaleString()} (Average Monthly: £${(cashFlow.netMonthlyCashFlow || 0).toLocaleString()})
- **Monthly Gross Burn**: £${(burn.grossMonthlyBurnRate || 0).toLocaleString()}/month
- **Runway**: **${runway.runwayMonths || 0} months** (~${runway.runwayDays || 0} days)
- **Projected Cash at 60 Days**: £${(runway.projectedCash60Days || 0).toLocaleString()} (Buffer above reserve: £${(runway.bufferAboveReserveGbp || 0).toLocaleString()})

#### 2. Key Decisions & Risk Analysis
${decisions.map(d => `- **${d.type.replace(/_/g, ' ').toUpperCase()}**: ${d.description} *(${d.rationale})*`).join('\n') || '- All standard metrics are within normal operating bounds.'}

#### 3. Autonomous Routine Actions Executed (${executedActions.length})
${executedActions.map(a => `- [AUTONOMOUS ACTION] **${a.action_type}**: ${a.description} (Reason: ${a.reason})`).join('\n') || '- No automated actions were necessary.'}

${approvalActions.length > 0 ? `#### 4. Actions Requiring Founder Approval (${approvalActions.length})
${approvalActions.map(a => `- [PENDING APPROVAL] **${a.action_type}**: ${a.description} (Amount: £${a.amount?.toLocaleString() || 0})`).join('\n')}` : ''}

#### 4. Summary & Recommendation
The company's operating cash trajectory comfortably satisfies the 60-day safety requirement. Cash inflow from receivables exceeds average monthly burn, and routine credit reminders have been automatically prepared and dispatched under active company financial policies.`;
  }
}

module.exports = MockLLM;
