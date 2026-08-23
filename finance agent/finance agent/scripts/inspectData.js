const { inspectDataset } = require('../src/services/csvImport.service');

async function main() {
  console.log('====================================================');
  console.log('         UK FINANCIAL DATASET INSPECTION            ');
  console.log('====================================================\n');

  try {
    const stats = await inspectDataset();
    for (const [file, info] of Object.entries(stats)) {
      if (info.error) {
        console.error(`❌ [${file}] Error: ${info.error}`);
      } else {
        console.log(`📁 File: ${file} -> Target Table: [public.${info.table}]`);
        console.log(`   Rows:    ${info.rowCount}`);
        console.log(`   Columns: ${info.columns.join(', ')}`);
        console.log('   Sample: ', JSON.stringify(info.sampleRow, null, 2));
        console.log('----------------------------------------------------');
      }
    }
    console.log('\n✓ Dataset inspection completed successfully.');
  } catch (err) {
    console.error('Inspection failed:', err);
    process.exit(1);
  }
}

main();
