# Autonomous AI Finance Manager Backend

[![Track 1](https://img.shields.io/badge/Hackathon-Track%201%20The%20Agent%20Hub-blue.svg)](#)
[![Node](https://img.shields.io/badge/Node.js-v20%2B-green.svg)](#)
[![LangGraph.js](https://img.shields.io/badge/Orchestration-LangGraph.js-orange.svg)](#)
[![Supabase](https://img.shields.io/badge/Database-Supabase%20PostgreSQL-3ECF8E.svg)](#)
[![AI Engine](https://img.shields.io/badge/AI-Google%20Gemini%20%2F%20Ollama%20%2F%20MockLLM-purple.svg)](#)
[![Tests](https://img.shields.io/badge/Tests-46%2F46%20Passing-brightgreen.svg)](#)

An autonomous AI finance manager backend built for startup founders to delegate routine financial analysis, cash burn monitoring, 60-day runway safety evaluation, receivables management, anomaly detection, policy-governed autonomous actions, and funding report validation.

---

## Track 1: The Agent Hub — Requirements Alignment

This backend strictly implements all four Track 1 autonomous agent capabilities:

| Track 1 Capability | Implementation in this Backend |
| :--- | :--- |
| **1. Planning & Decision Making** | **LangGraph.js** state graph with an LLM adapter (`RealGeminiLLM` / `RealOllamaLLM` / `MockLLM`) that analyzes founder intent, decomposes requests into multi-step tool plans, evaluates findings against company financial policies, and formulates decisions. |
| **2. Real Tool Usage** | **15+ Deterministic JavaScript Tools** executing real queries against Supabase PostgreSQL / UK SME accounting dataset tables (companies, sales orders, employees, journal entries, customers, products). |
| **3. Persistent Memory** | **Supabase `agent_memory` & `financial_policies`** tables storing founder preferences, minimum cash reserve rules, past risk observations, and decisions that persist across server restarts. |
| **4. Autonomous Multi-step Execution** | **Financial Policy Boundary Engine & `agent_actions`** table that evaluates financial risk thresholds, automatically executes permitted routine actions (e.g. payment reminders, risk alerts), queues approval requests, and saves findings back into memory. |

---

## System Architecture

```text
                             Founder / Frontend Teammate
                                          │
                                          ▼
                                 REST API Endpoints
                    (POST /api/agent, POST /api/agent/validate-report, 
                     GET /api/finance/*, GET /api/health)
                                          │
                                          ▼
                                LangGraph.js Agent
                                          │
                  ┌───────────────────────┴───────────────────────┐
                  ▼                                               ▼
             LLM Adapter                                    Finance Tools
      ┌───────────┼───────────┐                         (Deterministic Math)
      │           │           │                                   │
   Gemini      Ollama      MockLLM                                ├── getFinancialSummary()
 (Flash API) (Qwen3:8B)  (Test Mode)                              ├── calculateCashFlow()
                                                                  ├── calculateBurnRate()
                                                                  ├── calculateRunway()
                                                                  ├── getOutstandingInvoices()
                                                                  ├── detectAnomalies()
                                                                  └── validateFinancialReport()
                                                                          │
                                                                          ▼
                                                                 Supabase Database
                                                             (PostgreSQL / UK Dataset)
                                                             ├── companies
                                                             ├── sales_orders
                                                             ├── employees
                                                             ├── journal_entries
                                                             ├── agent_memory
                                                             ├── financial_policies
                                                             └── agent_actions
```

---

# Frontend Integration

The backend is built specifically to power the frontend interface via clean JSON REST endpoints.

- **Backend Base URL**: `http://localhost:5000`
- **Frontend URL**: `http://localhost:3000` (CORS enabled for local dev)

---

## 1. Demo 1: Autonomous AI Finance Manager

### Endpoint
`POST http://localhost:5000/api/agent`

### Example Request
```json
{
  "companyId": "dd6f7306-36ed-4c9f-9996-6c5ab35d6628",
  "message": "Check whether our company is financially safe for the next 60 days and take whatever routine actions are necessary."
}
```

### Response Schema & Field Definitions
```json
{
  "taskId": "fc45b55b-32c6-42fc-b21d-a994ffd0737b",
  "status": "completed",
  "goal": "Check whether our company is financially safe for the next 60 days and take whatever routine actions are necessary.",
  "plan": [
    { "stepNumber": 1, "tool": "getFinancialSummary", "description": "Retrieve revenue, cash baseline, and expense summary" },
    { "stepNumber": 2, "tool": "calculateCashFlow", "description": "Analyze operating cash inflows vs outflows" },
    { "stepNumber": 3, "tool": "calculateBurnRate", "description": "Calculate gross and net monthly cash burn rates" },
    { "stepNumber": 4, "tool": "calculateRunway", "description": "Evaluate runway and 60-day safety horizon" },
    { "stepNumber": 5, "tool": "getOutstandingInvoices", "description": "Check unpaid customer receivables" },
    { "stepNumber": 6, "tool": "detectAnomalies", "description": "Scan for expense outliers" },
    { "stepNumber": 7, "tool": "getCompanyPolicy", "description": "Retrieve authorization limits" }
  ],
  "toolCalls": [
    { "tool": "getFinancialSummary", "status": "success", "result": { ... } }
  ],
  "findings": {
    "getFinancialSummary": { "totalGrossRevenue": 496919.13, "totalExpenses": 455721.71, "netIncome": 41197.42 },
    "calculateRunway": { "currentCashBalanceGbp": 175000.00, "runwayMonths": 5.76, "runwayDays": 175, "isSafe60Days": true, "projectedCash60Days": 114237.11 },
    "getOutstandingInvoices": { "totalOutstandingAmountGbp": 452100.00, "overdueCount": 140, "totalOverdueAmountGbp": 355662.06 }
  },
  "decisions": [
    { "type": "solvency_assessment", "description": "Company is financially safe for the 60-day horizon.", "rationale": "5.76 months runway exceeds 2-month requirement." }
  ],
  "actions": [
    { "action_type": "payment_reminder", "description": "Issued automated payment reminder for overdue invoice #1042", "status": "executed" },
    { "action_type": "payment_reminder", "description": "Payment reminder for high value invoice #1089 (£5,203.60)", "status": "pending_approval" }
  ],
  "memoryUsed": [
    { "category": "preference", "key": "min_runway_months", "value": 3 }
  ],
  "finalResponse": "### Executive Financial Assessment Report\n..."
}
```

### Frontend Display Structure for Demo 1

```text
FINANCE AGENT
─────────────────────────────────────────────
User Request
  ↳ "Check whether our company is financially safe for the next 60 days..."
        │
        ▼
Agent Plan
  1. Check financial summary
  2. Calculate cash flow
  3. Calculate runway
  4. Check invoices
  5. Detect anomalies
        │
        ▼
Tool Execution
  ✓ Financial Summary
  ✓ Cash Flow
  ✓ Burn Rate
  ✓ Runway
  ✓ Invoice Analysis
        │
        ▼
Financial Findings
  • Revenue: £496,919.13
  • Cash: £175,000.00
  • Net Runway: 5.76 months (~175 days)
  • 60-Day Projected Cash: £114,237.11
  • Overdue Receivables: 140 invoices (£355,662.06)
        │
        ▼
Decisions & Policy Guardrails
  • Solvency: SAFE (Runway > 60 days)
  • Receivables: 140 invoices flagged for collection
        │
        ▼
Autonomous Actions
  • [EXECUTED] Automated payment reminder sent for invoice #1042
  • [PENDING APPROVAL] Payment reminder for £5,203.60
        │
        ▼
Final Executive Report
  [Full structured Markdown synthesis]
```

---

## 2. Demo 2/3: Financial Report & Funding Validation Agent

### Endpoint
`POST http://localhost:5000/api/agent/validate-report`

### Example Request
```json
{
  "companyId": "dd6f7306-36ed-4c9f-9996-6c5ab35d6628",
  "title": "Investor Pitch Deck / Funding Proposal",
  "document": {
    "revenue": 500000,
    "expenses": 200000,
    "profit": 350000,
    "runwayMonths": 12,
    "headcount": 15
  }
}
```

### Response Schema & Field Definitions
- **`validationStatus`**: Overall verdict (`VERIFIED` | `NEEDS_REVIEW` | `CONTRADICTION` | `NOT_VERIFIABLE`)
- **`documentType`**: Identified document class (`pitch_deck_financials`, `grant_application`, `bank_loan_proposal`, etc.)
- **`overallScore`**: Confidence score `0-100` calculated deterministically
- **`claims`**: Extracted figures from the uploaded document
- **`actuals`**: Real ground-truth figures verified from Supabase
- **`discrepancies`**: Array of fields with difference, percentage diff, and severity (`low` | `medium` | `high` | `critical`)
- **`arithmeticChecks`**: Mathematical consistency verification (e.g. `Revenue - Expenses = Profit`)
- **`risks`**: Financial and operational risk factors identified
- **`recommendedFixes`**: Concrete, actionable guidance before submitting the report
- **`summary`**: Executive summary and formatted Markdown report

### Frontend Display Structure for Demo 2

```text
FINANCIAL REPORT VALIDATION
─────────────────────────────────────────────
Document Information
  • Document: Investor Pitch Deck
  • Validation Score: 25 / 100
  • Overall Status: 🔴 CONTRADICTION / NEEDS REVIEW
        │
        ▼
Claimed vs Actual Audit Table
  ┌──────────────┬─────────────┬─────────────┬─────────────────┬──────────┐
  │ Metric       │ Claimed     │ Actual      │ Difference      │ Status   │
  ├──────────────┼─────────────┼─────────────┼─────────────────┼──────────┤
  │ Revenue      │ £500,000.00 │ £496,919.13 │ +£3,080.87 (1%) │ 🟡 REVIEW│
  │ Runway       │ 12.0 mos    │ 5.76 mos    │ +6.24 mos (108%)│ 🔴 CRIT  │
  │ Headcount    │ 15          │ 10          │ +5 (50%)        │ 🟠 HIGH  │
  └──────────────┴─────────────┴─────────────┴─────────────────┴──────────┘
        │
        ▼
Arithmetic Consistency Checks
  ✖ Claimed Math Check: Revenue (£500k) - Expenses (£200k) ≠ Profit (£350k)
    Actual Net: £300,000 (Claim is overstated by £50,000)
        │
        ▼
Identified Risks
  • Overstated runway may mislead investors during due diligence.
  • Unreconciled £50k math error undermines financial credibility.
        │
        ▼
Recommended Fixes
  1. Correct claimed profit from £350,000 to £300,000 to resolve arithmetic contradiction.
  2. Adjust runway from 12.0 months to actual 5.76 months.
  3. Align headcount to 10 confirmed active employees.
```

---

## 3. Direct Finance REST Endpoints

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/health` | `GET` | Health status, database connection, and LLM mode |
| `/api/finance/summary` | `GET` | 16 verified financial metrics (revenue, expenses, cash, runway) |
| `/api/finance/revenue` | `GET` | Monthly revenue trends and sales order metrics |
| `/api/finance/expenses` | `GET` | Payroll, COGS, and operational expenditure breakdown |
| `/api/finance/cashflow` | `GET` | Operating cash flow and net monthly flow |
| `/api/finance/runway` | `GET` | Runway months, runway days, and 60-day safety horizon |
| `/api/finance/invoices` | `GET` | Total outstanding receivables and overdue invoices |
| `/api/agent/tasks/:id` | `GET` | Retrieve status, plan, and findings of an executed task |

---

## Demo Test Scripts

### Starting the Server
```bash
npm run dev
```

### Health Check
**cURL:**
```bash
curl -X GET http://localhost:5000/api/health
```
**PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/health" -Method Get
```

### Run Demo 1 (60-Day Safety Evaluation)
**cURL:**
```bash
curl -X POST http://localhost:5000/api/agent \
  -H "Content-Type: application/json" \
  -d '{"companyId":"dd6f7306-36ed-4c9f-9996-6c5ab35d6628","message":"Check whether our company is financially safe for the next 60 days and take whatever routine actions are necessary."}'
```
**PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/agent" -Method Post -ContentType "application/json" -Body '{"companyId":"dd6f7306-36ed-4c9f-9996-6c5ab35d6628","message":"Check whether our company is financially safe for the next 60 days and take whatever routine actions are necessary."}'
```

### Run Demo 2 (Funding Report Validation)
**cURL:**
```bash
curl -X POST http://localhost:5000/api/agent/validate-report \
  -H "Content-Type: application/json" \
  -d '{"companyId":"dd6f7306-36ed-4c9f-9996-6c5ab35d6628","title":"Investor Funding Pitch","document":{"revenue":500000,"expenses":200000,"profit":350000,"runwayMonths":12,"headcount":15}}'
```
**PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/agent/validate-report" -Method Post -ContentType "application/json" -Body '{"companyId":"dd6f7306-36ed-4c9f-9996-6c5ab35d6628","title":"Investor Funding Pitch","document":{"revenue":500000,"expenses":200000,"profit":350000,"runwayMonths":12,"headcount":15}}'
```

---

## Running the Automated Test Suite

```bash
npm test
```
All **46/46 unit, integration, and E2E tests** pass with 100% test coverage across deterministic finance tools, policy engines, persistent memory, and report validators.
