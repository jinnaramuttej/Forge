const { createClient } = require('@supabase/supabase-js');
const env = require('../config/env');

let supabaseClient = null;

if (env.SUPABASE_URL && env.SUPABASE_KEY) {
  try {
    supabaseClient = createClient(env.SUPABASE_URL, env.SUPABASE_KEY, {
      auth: { persistSession: false }
    });
  } catch (err) {
    console.error('[DATABASE] Failed to initialize Supabase client:', err.message);
  }
}

// In-memory fallback dataset store
const localStore = {
  companies: [],
  departments: [],
  chart_of_accounts: [],
  customers: [],
  products: [],
  employees: [],
  journal_entries: [],
  sales_orders: [],
  agent_tasks: [],
  agent_memory: [],
  financial_policies: [],
  agent_actions: []
};

// Check if a table exists and is accessible in Supabase
async function testTableAccessibility(tableName) {
  if (!supabaseClient) return false;
  try {
    const { error } = await supabaseClient.from(tableName).select('count', { count: 'exact', head: true });
    return !error;
  } catch {
    return false;
  }
}

// Check full database health
async function getDatabaseHealth() {
  if (!supabaseClient) {
    return {
      status: 'offline',
      provider: 'supabase',
      urlConfigured: false,
      message: 'Supabase credentials missing'
    };
  }

  try {
    const { error } = await supabaseClient.from('companies').select('count', { count: 'exact', head: true });
    if (error && error.message.includes('schema cache')) {
      return {
        status: 'connected',
        provider: 'supabase',
        urlConfigured: true,
        schemaStatus: 'pending_migration',
        message: 'Connected to Supabase, custom tables awaiting migration (fallback active)'
      };
    } else if (error) {
      return {
        status: 'error',
        provider: 'supabase',
        urlConfigured: true,
        message: error.message
      };
    }
    return {
      status: 'connected',
      provider: 'supabase',
      urlConfigured: true,
      schemaStatus: 'ready',
      message: 'Supabase PostgreSQL fully operational'
    };
  } catch (err) {
    return {
      status: 'error',
      provider: 'supabase',
      message: err.message
    };
  }
}

// Unified query abstraction
const db = {
  supabase: supabaseClient,
  localStore,

  async find(table, filter = {}) {
    // Try Supabase first if online
    if (supabaseClient) {
      try {
        let query = supabaseClient.from(table).select('*');
        for (const [k, v] of Object.entries(filter)) {
          if (v !== undefined && v !== null) {
            query = query.eq(k, v);
          }
        }
        const { data, error } = await query;
        if (!error && Array.isArray(data)) {
          return data;
        }
      } catch (err) {
        // Fallback to local store
      }
    }

    // Fallback to in-memory store
    const list = localStore[table] || [];
    return list.filter(item => {
      for (const [k, v] of Object.entries(filter)) {
        if (v !== undefined && v !== null && item[k] !== v) {
          return false;
        }
      }
      return true;
    });
  },

  async findOne(table, filter = {}) {
    const results = await this.find(table, filter);
    return results.length > 0 ? results[0] : null;
  },

  async insert(table, record) {
    const item = {
      id: record.id || require('crypto').randomUUID(),
      created_at: record.created_at || new Date().toISOString(),
      ...record
    };

    // Save to local store
    if (!localStore[table]) localStore[table] = [];
    localStore[table].push(item);

    // Try Supabase insert
    if (supabaseClient) {
      try {
        await supabaseClient.from(table).insert([item]);
      } catch (err) {
        // Ignore schema error if Supabase tables not migrated
      }
    }

    return item;
  },

  async update(table, filter = {}, updates = {}) {
    // Update local store
    const list = localStore[table] || [];
    let updatedCount = 0;
    for (const item of list) {
      let match = true;
      for (const [k, v] of Object.entries(filter)) {
        if (item[k] !== v) {
          match = false;
          break;
        }
      }
      if (match) {
        Object.assign(item, updates, { updated_at: new Date().toISOString() });
        updatedCount++;
      }
    }

    // Update Supabase
    if (supabaseClient) {
      try {
        let query = supabaseClient.from(table).update(updates);
        for (const [k, v] of Object.entries(filter)) {
          query = query.eq(k, v);
        }
        await query;
      } catch (err) {
        // Fallback handled
      }
    }

    return updatedCount;
  }
};

module.exports = {
  supabase: supabaseClient,
  localStore,
  db,
  getDatabaseHealth,
  testTableAccessibility
};
