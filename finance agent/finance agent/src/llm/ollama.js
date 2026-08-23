const env = require('../config/env');

class RealOllamaLLM {
  constructor(baseUrl = env.OLLAMA_BASE_URL, model = env.OLLAMA_MODEL) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.model = model;
    this.name = 'RealOllamaLLM';
  }

  // Check if Ollama is accessible and model exists
  async checkHealth() {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(3000)
      });
      if (!response.ok) {
        return { available: false, error: `HTTP ${response.status}` };
      }
      const data = await response.json();
      const models = data.models || [];
      const hasModel = models.some(m => m.name === this.model || m.name.startsWith(this.model));
      return {
        available: true,
        modelFound: hasModel,
        models: models.map(m => m.name),
        model: this.model
      };
    } catch (err) {
      return { available: false, error: err.message };
    }
  }

  // Call Ollama chat API
  async chat(messages, options = {}) {
    const health = await this.checkHealth();
    if (!health.available) {
      throw new Error(`Ollama server unavailable at ${this.baseUrl}: ${health.error}`);
    }

    const payload = {
      model: this.model,
      messages,
      stream: false,
      options: {
        temperature: options.temperature !== undefined ? options.temperature : 0.2,
        ...options
      }
    };

    if (options.format === 'json') {
      payload.format = 'json';
    }

    const response = await fetch(`${this.baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Ollama chat error HTTP ${response.status}: ${errText}`);
    }

    const resData = await response.json();
    return resData.message?.content || '';
  }

  async generatePlan({ goal, request, memories = [] }) {
    const memoryContext = memories.map(m => `- [${m.category}] ${m.key}: ${JSON.stringify(m.value)}`).join('\n');
    const prompt = `You are an Autonomous AI Finance Manager for a startup founder.
Goal: "${goal || request}"
Company Context & Policies:
${memoryContext || 'No special policies recorded.'}

Select the necessary tools from:
- getFinancialSummary
- getRevenue
- getExpenses
- calculateCashFlow
- calculateBurnRate
- calculateRunway
- getOutstandingInvoices
- compareBudget
- detectAnomalies
- getCompanyPolicy

Output valid JSON only matching:
{
  "goal": "${goal || request}",
  "reasoning": "string",
  "steps": [
    { "stepNumber": 1, "tool": "toolName", "args": {}, "description": "string" }
  ]
}`;

    const raw = await this.chat([
      { role: 'system', content: 'You are a financial planning engine. Output valid JSON only.' },
      { role: 'user', content: prompt }
    ], { format: 'json' });

    try {
      return JSON.parse(raw);
    } catch {
      return { goal: goal || request, steps: [] };
    }
  }

  async makeDecision({ goal, findings, policies = [] }) {
    const prompt = `Analyze the following real financial findings against company policies and determine decisions & routine actions.
Goal: "${goal}"
Findings: ${JSON.stringify(findings, null, 2)}
Policies: ${JSON.stringify(policies, null, 2)}

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

    const raw = await this.chat([
      { role: 'system', content: 'You are a financial risk and decision analyst. Output valid JSON only.' },
      { role: 'user', content: prompt }
    ], { format: 'json' });

    try {
      return JSON.parse(raw);
    } catch {
      return { assessment: 'Financial assessment completed', riskLevel: 'low', decisions: [], proposedActions: [] };
    }
  }

  async generateFinalReport({ goal, plan, findings, decisions, actions }) {
    const prompt = `Synthesize an executive summary report for the founder based on the following real executed data:
Goal: "${goal}"
Plan Steps: ${JSON.stringify(plan)}
Findings: ${JSON.stringify(findings)}
Decisions: ${JSON.stringify(decisions)}
Actions Taken: ${JSON.stringify(actions)}

Write a professional, concise executive report.`;

    return await this.chat([
      { role: 'system', content: 'You are an executive finance advisor.' },
      { role: 'user', content: prompt }
    ]);
  }
}

module.exports = RealOllamaLLM;
