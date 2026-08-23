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

class RealGeminiLLM {
  constructor(apiKey = env.GEMINI_API_KEY, model = env.GEMINI_MODEL) {
    this.apiKey = apiKey;
    this.model = model || 'gemini-flash-latest';
    this.fallbackModels = ['gemini-flash-latest', 'gemini-2.5-flash-lite', 'gemini-3.6-flash', 'gemini-pro-latest'];
    this.name = 'RealGeminiLLM';
  }

  // Check if Gemini API key exists and is reachable
  async checkHealth() {
    if (!this.apiKey) {
      return { available: false, error: 'GEMINI_API_KEY is not configured in .env' };
    }

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            { role: 'user', parts: [{ text: 'Reply with exactly: GEMINI_TEST_OK' }] }
          ]
        }),
        signal: AbortSignal.timeout(15000)
      });

      if (!response.ok) {
        for (const fbModel of this.fallbackModels) {
          if (fbModel === this.model) continue;
          try {
            const fbUrl = `https://generativelanguage.googleapis.com/v1beta/models/${fbModel}:generateContent?key=${this.apiKey}`;
            const fbRes = await fetch(fbUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ role: 'user', parts: [{ text: 'ping' }] }]
              }),
              signal: AbortSignal.timeout(15000)
            });
            if (fbRes.ok) {
              this.model = fbModel;
              return { available: true, model: this.model, provider: 'gemini' };
            }
          } catch {
            // continue
          }
        }
        const errText = await response.text();
        return { available: false, error: `HTTP ${response.status}: ${errText}` };
      }

      return {
        available: true,
        model: this.model,
        provider: 'gemini'
      };
    } catch (err) {
      return { available: false, error: err.message };
    }
  }

  // Call Gemini REST API with retry & fallback
  async generateContent(prompt, systemInstruction = '', jsonFormat = false) {
    if (!this.apiKey) {
      throw new Error('GEMINI_API_KEY is not set.');
    }

    const payload = {
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature: 0.1
      }
    };

    if (systemInstruction) {
      payload.systemInstruction = {
        parts: [{ text: systemInstruction }]
      };
    }

    if (jsonFormat) {
      payload.generationConfig.responseMimeType = 'application/json';
    }

    const modelsToTry = [this.model, ...this.fallbackModels.filter(m => m !== this.model)];
    let lastError = null;

    for (const modelToUse of modelsToTry) {
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelToUse}:generateContent?key=${this.apiKey}`;
          const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            signal: AbortSignal.timeout(15000)
          });

          if (response.ok) {
            const data = await response.json();
            this.model = modelToUse;
            return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
          }

          const errText = await response.text();
          lastError = new Error(`Gemini API error HTTP ${response.status} (${modelToUse}): ${errText}`);

          if (response.status === 503 || response.status === 429) {
            await new Promise(r => setTimeout(r, 1000 * attempt));
          } else {
            break;
          }
        } catch (err) {
          lastError = err;
          await new Promise(r => setTimeout(r, 600));
        }
      }
    }

    throw lastError || new Error('Gemini API calls failed across all models.');
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

Output valid JSON only matching this schema:
{
  "goal": "${goal || request}",
  "reasoning": "string",
  "steps": [
    { "stepNumber": 1, "tool": "toolName", "args": {}, "description": "string" }
  ]
}`;

    try {
      const raw = await this.generateContent(
        prompt,
        'You are a financial planning engine. Output valid JSON only without markdown fences.',
        true
      );
      const cleaned = raw.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      if (parsed && Array.isArray(parsed.steps) && parsed.steps.length > 0) {
        return parsed;
      }
      return await mockFallback.generatePlan(args);
    } catch (err) {
      console.warn('[GEMINI PLANNER FALLBACK]', err.message);
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

Output valid JSON only matching:
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
      const raw = await this.generateContent(
        prompt,
        'You are a financial risk and decision analyst. Output valid JSON only without markdown fences.',
        true
      );
      const cleaned = raw.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      if (parsed && Array.isArray(parsed.decisions)) {
        return parsed;
      }
      return await mockFallback.makeDecision(args);
    } catch (err) {
      console.warn('[GEMINI DECISION FALLBACK]', err.message);
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
      return await this.generateContent(
        prompt,
        'You are an executive finance advisor.'
      );
    } catch (err) {
      console.warn('[GEMINI REPORT FALLBACK]', err.message);
      return await mockFallback.generateFinalReport(args);
    }
  }
}

module.exports = RealGeminiLLM;
