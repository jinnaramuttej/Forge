-- =========================================================
-- AUTONOMOUS AI FINANCE MANAGER - POSTGRESQL SCHEMA FOR SUPABASE
-- =========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgvector if available
CREATE EXTENSION IF NOT EXISTS "vector";

-- 1. COMPANIES
CREATE TABLE IF NOT EXISTS public.companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    trading_name TEXT,
    abn TEXT,
    acn TEXT,
    industry TEXT,
    structure TEXT,
    country TEXT DEFAULT 'UK',
    registration_date DATE,
    financial_year_end_month INT DEFAULT 3,
    street TEXT,
    city TEXT,
    state TEXT,
    postcode TEXT,
    phone TEXT,
    email TEXT,
    gst_registered BOOLEAN DEFAULT TRUE,
    gst_registration_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. DEPARTMENTS
CREATE TABLE IF NOT EXISTS public.departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    target_headcount INT DEFAULT 1,
    cost_centre TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CHART OF ACCOUNTS
CREATE TABLE IF NOT EXISTS public.chart_of_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    name TEXT NOT NULL,
    account_type TEXT NOT NULL, -- asset, liability, equity, revenue, expense
    sub_type TEXT, -- current_asset, fixed_asset, current_liability, operating_revenue, cogs, operating_expense
    description TEXT,
    is_system BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    tax_code TEXT DEFAULT 'Non-Taxable',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CUSTOMERS
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    trading_name TEXT,
    abn TEXT,
    customer_type TEXT DEFAULT 'business', -- individual, business
    status TEXT DEFAULT 'active', -- active, churned
    payment_terms_days INT DEFAULT 30,
    credit_limit NUMERIC(15, 2) DEFAULT 0.00,
    created_date DATE DEFAULT CURRENT_DATE,
    churned_date DATE,
    reliability NUMERIC(5, 4) DEFAULT 1.0000,
    activity_level NUMERIC(5, 4) DEFAULT 1.0000,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. PRODUCTS
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    sku TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    unit_of_measure TEXT DEFAULT 'each',
    cost_price NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    sell_price NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    is_tracked BOOLEAN DEFAULT TRUE,
    quantity_on_hand INT DEFAULT 0,
    reorder_point INT DEFAULT 0,
    reorder_quantity INT DEFAULT 0,
    preferred_supplier_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. EMPLOYEES
CREATE TABLE IF NOT EXISTS public.employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
    employee_number TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    date_of_birth DATE,
    gender TEXT,
    tax_file_number TEXT,
    start_date DATE,
    termination_date DATE,
    termination_reason TEXT,
    status TEXT DEFAULT 'active', -- active, terminated
    employment_type TEXT DEFAULT 'full_time', -- full_time, part_time, casual
    role TEXT NOT NULL,
    annual_salary NUMERIC(15, 2) DEFAULT 0.00,
    hourly_rate NUMERIC(10, 2),
    super_fund TEXT,
    super_member_number TEXT,
    street TEXT,
    city TEXT,
    state TEXT,
    postcode TEXT,
    bank_bsb TEXT,
    bank_account_number TEXT,
    bank_account_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. JOURNAL ENTRIES
CREATE TABLE IF NOT EXISTS public.journal_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    entry_number INT NOT NULL,
    entry_date DATE NOT NULL,
    description TEXT NOT NULL,
    source_module TEXT NOT NULL, -- sales, purchasing, payroll, assets, banking, company
    source_id TEXT,
    is_adjusting BOOLEAN DEFAULT FALSE,
    is_reversal BOOLEAN DEFAULT FALSE,
    posted BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. SALES ORDERS
CREATE TABLE IF NOT EXISTS public.sales_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    order_number TEXT NOT NULL,
    order_date DATE NOT NULL,
    status TEXT DEFAULT 'confirmed', -- draft, confirmed, completed, cancelled
    subtotal NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    gst_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    total_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. AGENT TASKS (Tracks autonomous executions)
CREATE TABLE IF NOT EXISTS public.agent_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    user_id TEXT DEFAULT 'founder-1',
    request TEXT NOT NULL,
    goal TEXT,
    status TEXT DEFAULT 'pending', -- pending, planning, executing, completed, failed
    plan JSONB DEFAULT '[]'::jsonb,
    tool_calls JSONB DEFAULT '[]'::jsonb,
    findings JSONB DEFAULT '{}'::jsonb,
    decisions JSONB DEFAULT '[]'::jsonb,
    actions JSONB DEFAULT '[]'::jsonb,
    memory_used JSONB DEFAULT '[]'::jsonb,
    final_response TEXT,
    error TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. AGENT MEMORY (Long-term persistent semantic & factual memory)
CREATE TABLE IF NOT EXISTS public.agent_memory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    category TEXT NOT NULL, -- policy, founder_preference, decision, observation, risk_alert, recurring_expense
    key TEXT NOT NULL,
    value JSONB NOT NULL,
    importance INT DEFAULT 1, -- 1 to 5
    embedding vector(1536), -- Optional semantic vector representation
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. FINANCIAL POLICIES (Configurable safety rules & autonomy boundaries)
CREATE TABLE IF NOT EXISTS public.financial_policies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    policy_name TEXT NOT NULL,
    policy_type TEXT NOT NULL, -- payment_threshold, min_cash_reserve, runway_warning, credit_limit_breach
    parameters JSONB NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. AGENT ACTIONS (Safe simulated financial & operational operations)
CREATE TABLE IF NOT EXISTS public.agent_actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    task_id UUID REFERENCES public.agent_tasks(id) ON DELETE SET NULL,
    action_type TEXT NOT NULL, -- payment_reminder, risk_alert, follow_up_task, invoice_flag, budget_alert, decision_record
    description TEXT NOT NULL,
    target_entity_type TEXT, -- customer, supplier, department, invoice
    target_entity_id TEXT,
    amount NUMERIC(15, 2),
    requires_approval BOOLEAN DEFAULT FALSE,
    approved BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'executed', -- prepared, executed, cancelled, pending_approval
    reason TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES for fast retrieval
CREATE INDEX IF NOT EXISTS idx_customers_company ON public.customers(company_id);
CREATE INDEX IF NOT EXISTS idx_sales_orders_company_date ON public.sales_orders(company_id, order_date);
CREATE INDEX IF NOT EXISTS idx_journal_entries_company_date ON public.journal_entries(company_id, entry_date);
CREATE INDEX IF NOT EXISTS idx_agent_memory_company_cat ON public.agent_memory(company_id, category);
CREATE INDEX IF NOT EXISTS idx_agent_actions_task ON public.agent_actions(task_id);
