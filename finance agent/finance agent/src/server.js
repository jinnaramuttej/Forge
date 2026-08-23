const express = require('express');
const cors = require('cors');
const env = require('./config/env');
const healthRoutes = require('./routes/health.routes');
const agentRoutes = require('./routes/agent.routes');
const financeRoutes = require('./routes/finance.routes');
const { loadAllCsvData } = require('./services/csvImport.service');
const { db } = require('./database/supabase');
const { seedPoliciesAndMemory } = require('../scripts/seedMemory');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (!req.path.startsWith('/api/health')) {
      console.log(`[HTTP] ${req.method} ${req.originalUrl} ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// Mount Routes
app.use('/api/health', healthRoutes);
app.use('/api/agent', agentRoutes);
app.use('/api/finance', financeRoutes);

// Root information endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Autonomous AI Finance Manager Backend',
    version: '1.0.0',
    track: 'Track 1 – The Agent Hub',
    docs: {
      health: 'GET /api/health',
      agent: 'POST /api/agent',
      taskStatus: 'GET /api/agent/tasks/:id',
      financeSummary: 'GET /api/finance/summary',
      revenue: 'GET /api/finance/revenue',
      expenses: 'GET /api/finance/expenses',
      cashflow: 'GET /api/finance/cashflow',
      runway: 'GET /api/finance/runway',
      invoices: 'GET /api/finance/invoices'
    }
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found', path: req.originalUrl });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[UNCAUGHT ERROR]', err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// Ensure data is loaded on server startup
async function startServer() {
  try {
    // If local store is empty, load Indian dataset and seed initial policies/memories
    if (db.localStore.sales_orders.length === 0) {
      console.log('[STARTUP] Loading Indian dataset into store...');
      const dataset = await loadAllCsvData();
      for (const [table, rows] of Object.entries(dataset)) {
        db.localStore[table] = rows;
      }
      await seedPoliciesAndMemory();
      console.log('[STARTUP] Indian dataset loaded successfully.');
    }

    const server = app.listen(env.PORT, () => {
      console.log(`\n====================================================`);
      console.log(`🚀 Autonomous Finance Agent Backend running on port ${env.PORT}`);
      console.log(`📡 Health Check: http://localhost:${env.PORT}/api/health`);
      console.log(`🤖 Agent Endpoint: POST http://localhost:${env.PORT}/api/agent`);
      console.log(`====================================================\n`);
    });

    return { app, server };
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
