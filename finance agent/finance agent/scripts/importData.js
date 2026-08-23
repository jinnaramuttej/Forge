const { loadAllCsvData } = require('../src/services/csvImport.service');
const { db, getDatabaseHealth } = require('../src/database/supabase');
const { seedPoliciesAndMemory } = require('./seedMemory');

async function importData() {
  console.log('====================================================');
  console.log('               UK DATA IMPORT PIPELINE              ');
  console.log('====================================================\n');

  try {
    const dbHealth = await getDatabaseHealth();
    console.log(`Database Status: [${dbHealth.status.toUpperCase()}] Provider: [${dbHealth.provider}]`);
    if (dbHealth.message) {
      console.log(`Note: ${dbHealth.message}\n`);
    }

    const dataset = await loadAllCsvData();
    const stats = {};

    for (const [tableName, rows] of Object.entries(dataset)) {
      db.localStore[tableName] = rows;
      stats[tableName] = rows.length;

      // Attempt Supabase insert if table is available
      if (db.supabase) {
        try {
          await db.supabase.from(tableName).upsert(rows, { onConflict: 'id', ignoreDuplicates: false });
        } catch (err) {
          // Handled via localStore fallback
        }
      }
    }

    // Seed policies and memory
    const { seededPolicies, seededMemories } = await seedPoliciesAndMemory();
    stats['financial_policies'] = seededPolicies;
    stats['agent_memory'] = seededMemories;

    console.log('DATA IMPORT SUMMARY:');
    console.log('----------------------------------------------------');
    for (const [table, count] of Object.entries(stats)) {
      const dots = '.'.repeat(Math.max(2, 28 - table.length));
      console.log(`${table} ${dots} ${count}`);
    }
    console.log('----------------------------------------------------');
    console.log('\n✓ Import completed successfully.\n');
    return stats;
  } catch (err) {
    console.error('❌ Data import failed:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  importData();
}

module.exports = { importData };
