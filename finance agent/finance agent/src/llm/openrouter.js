const env = require('../config/env');
const MockLLM = require('./mock');

const mockFallback = new MockLLM();

function sanitizeFindingsForPrompt(findings = {}) {
  const clean = {};
  for (const [key, val] of Object.entries(findings)) {
    if (!val) continue;
    if (key === 'getFinancialSummary') {
      clean.financialSummary = {
        totalGrossRevenue: val.totalGrossRevenue,
        totalExpenses: val.totalExpenses,
        netIncome: val.netIncome,
        totalSalesOrders: val.totalSalesOrders
      };
    } else if (key === 'getRevenue') {
      clean.revenue = {
        totalGrossRevenue: val.totalGrossRevenue,
        totalOrders: val.totalOrders
      };
    } else if (key === 'getExpenses') {
      clean.expenses = {
        totalPeriodExpenses: val.totalPeriodExpenses,
        monthlyPayroll: val.monthlyPayroll,
        activeEmployeeCount: val.activeEmployeeCount
      };
    } else if (key === 'calculateCashFlow') {
      clean.cashFlow = {
        netCashFlow: val.netCashFlow,
        netMonthlyCashFlow: val.netMonthlyCashFlow,
        status: val.status
      };
    } else if (key === 'calculateBurnRate') {
      clean.burnRate = {
        grossMonthlyBurnRate: val.grossMonthlyBurnRate,
        netMonthlyBurnRate: val.netMonthlyBurnRate
      };
    } else if (key === 'calculateRunway') {
      clean.runway = {
        currentCashBalance: val.currentCashBalanceGbp,
        runwayMonths: val.runwayMonths,
        runwayDays: val.runwayDays,
        isSafe60Days: val.isSafe60Days,
        projectedCash60Days: val.projectedCash60Days
      };
    } else if (key === 'getOutstandingInvoices') {
      clean.invoices = {
        totalOutstanding: val.totalOutstandingAmountGbp,
        overdueCount: val.overdueCount,
        totalOverdue: val.totalOverdueAmountGbp
      };
    } else if (key === 'detectAnomalies') {
      clean.anomalies = {
        anomalyCount: val.anomalyCount,
        anomalies: val.anomalies?.slice(0, 3)
      };
    } else if (key === 'validateFinancialReport') {
      const v = val.result || val;
      clean.validation = {
        status: v.validationStatus,
        documentType: v.documentTypeLabel,
        discrepancies: v.discrepancies?.map(d => `${d.field}: Claimed £${d.claimedValue} vs Actual £${d.actualValue} [${d.severity}]`),
        fixes: v.recommendedFixes
      };
    } else {
      clean[key] = typeof val === 'object' ? JSON.stringify(val).substring(0, 200) : val;
    }
  }
  return clean;
}

class OpenRouterLLM {
  constructor(apiKey = env.OPENROUTER_API_KEY, model = env.OPENROUTER_MODEL) {
    this.apiKey = apiKey;
    this.model = model || 'meta-llama/llama-3.1-8b-instruct';
    this.name = 'OpenRouterLLM';
  }

  async checkHealth() {
    if (!this.apiKey) {
      return { available: false, error: 'OPENROUTER_API_KEY is not configured in .env' };
    }
    return { available: true, model: this.model, provider: 'openrouter' };
  }

  async generateContent(prompt, systemInstruction = '', isJson = false) {
    if (!this.apiKey) {
      throw new Error('OPENROUTER_API_KEY is not set.');
    }

    const messages = [];
    if (systemInstruction) {
      messages.push({ role: 'system', content: systemInstruction });
    }
    messages.push({ role: 'user', content: prompt });

    let lastError = null;
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        console.log(`\n[AGENT LLM] Requesting model: ${this.model}...`);
        
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: this.model,
            messages,
            temperature: 0.1,
            response_format: isJson ? { type: 'json_object' } : undefined,
          }),
          signal: AbortSignal.timeout(45000)
        });

        if (response.ok) {
          const data = await response.json();
          const content = data.choices?.[0]?.message?.content?.trim() || '';
          
          console.log(`\n[AGENT LLM] Received Response:\n${content}\n`);
          
          return content;
        }

        const errText = await response.text();
        lastError = new Error(`OpenRouter API error HTTP ${response.status}: ${errText}`);
        console.log(`\n[AGENT LLM ERROR] HTTP ${response.status}: ${errText}`);

        if (response.status === 429 || response.status === 503) {
          await new Promise(r => setTimeout(r, 1000 * attempt));
        } else {
          break;
        }
      } catch (err) {
        lastError = err;
        console.log(`\n[AGENT LLM ERROR] Exception: ${err.message}`);
        await new Promise(r => setTimeout(r, 1000));
      }
    }

    throw lastError || new Error('OpenRouter API calls failed.');
  }

  async generatePlan(args) {
    const { goal, request, memories = [] } = args;
    const memoryContext = memories.map(m => `- [${m.category}] ${m.key}: ${JSON.stringify(m.value)}`).join('\n');
    const prompt = `You are an Autonomous AI Finance Manager for a startup founder.
Goal: "${goal || request}"
Company Context & Policies:
${memoryContext || 'No special policies recorded.'}

Select the necessary tools from:
- getFinancialSummary (Core overview)
- getRevenue (Monthly sales breakdown)
- getExpenses (Payroll and OpEx structure)
- calculateCashFlow (Inflow vs outflow)
- calculateBurnRate (Gross and net burn rate)
- calculateRunway (Runway months and 60-day safety horizon)
- getOutstandingInvoices (Receivables and overdue invoices)
- compareBudget (Departmental spend against targets)
- detectAnomalies (Statistical outliers and credit breaches)
- validateFinancialReport (Validate funding reports/pitch deck claims against actual data)
- getCompanyPolicy (Retrieve authorization limits)

Output valid JSON only matching this schema exactly (no markdown formatting, just JSON):
{
  "goal": "${goal || request}",
  "reasoning": "string",
  "steps": [
    { "stepNumber": 1, "tool": "toolName", "args": {}, "description": "string" }
  ]
}`;

    try {
      console.log(`\n[AGENT TASK] Planning steps for goal: "${goal || request}"`);
      const raw = await this.generateContent(
        prompt,
        'You are a financial planning engine. Output valid JSON only without markdown fences.',
        false
      );
      const cleaned = raw.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      if (parsed && Array.isArray(parsed.steps) && parsed.steps.length > 0) {
        return parsed;
      }
      return await mockFallback.generatePlan(args);
    } catch (err) {
      console.warn('[OPENROUTER PLANNER FALLBACK]', err.message);
      return await mockFallback.generatePlan(args);
    }
  }

  async makeDecision(args) {
    const { goal, findings, policies = [] } = args;
    const compactFindings = sanitizeFindingsForPrompt(findings);
    const prompt = `Analyze the following real financial findings against company policies and determine decisions & routine actions.
Goal: "${goal}"
Findings: ${JSON.stringify(compactFindings, null, 2)}
Policies: ${JSON.stringify(policies, null, 2)}

Do NOT invent financial figures. Base all decisions strictly on the provided findings.

Output valid JSON only matching this schema exactly (no markdown formatting, just JSON):
{
  "assessment": "string",
  "riskLevel": "low" | "medium" | "high" | "critical",
  "decisions": [
    { "type": "string", "description": "string", "rationale": "string" }
  ],
  "proposedActions": [
    { "actionType": "payment_reminder" | "risk_alert" | "follow_up_task" | "budget_alert", "description": "string", "amount": 0, "reason": "string" }
  ]
}`;

    try {
      console.log(`\n[AGENT TASK] Analyzing findings and making decisions...`);
      const raw = await this.generateContent(
        prompt,
        'You are a financial risk and decision analyst. Output valid JSON only without markdown fences.',
        false
      );
      const cleaned = raw.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      if (parsed && Array.isArray(parsed.decisions)) {
        return parsed;
      }
      return await mockFallback.makeDecision(args);
    } catch (err) {
      console.warn('[OPENROUTER DECISION FALLBACK]', err.message);
      return await mockFallback.makeDecision(args);
    }
  }

  async generateFinalReport(args) {
    const { goal, plan, findings, decisions, actions } = args;
    const validation = findings.validateFinancialReport;
    if (validation && (validation.validationReportMarkdown || validation.result?.validationReportMarkdown)) {
      return validation.validationReportMarkdown || validation.result?.validationReportMarkdown;
    }

    const compactFindings = sanitizeFindingsForPrompt(findings);
    const prompt = `Synthesize an executive summary report for the founder based on the following real executed data:
Goal: "${goal}"
Plan Steps: ${JSON.stringify(plan)}
Findings: ${JSON.stringify(compactFindings)}
Decisions: ${JSON.stringify(decisions)}
Actions Taken: ${JSON.stringify(actions)}

Write a professional, concise executive report. Present exact figures from the findings without alteration.`;

    try {
      console.log(`\n[AGENT TASK] Generating final executive report...`);
      return await this.generateContent(
        prompt,
        'You are an executive finance advisor.'
      );
    } catch (err) {
      console.warn('[OPENROUTER REPORT FALLBACK]', err.message);
      return await mockFallback.generateFinalReport(args);
    }
  }
}

module.exports = OpenRouterLLM;
