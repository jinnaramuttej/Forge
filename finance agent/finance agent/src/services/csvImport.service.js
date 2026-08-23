const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const DATA_DIR = path.resolve(__dirname, '../../data/india');

const CSV_MAPPINGS = [
  { file: 'companies.csv', table: 'companies' },
  { file: 'departments.csv', table: 'departments' },
  { file: 'chart_of_accounts.csv', table: 'chart_of_accounts' },
  { file: 'customers.csv', table: 'customers' },
  { file: 'products.csv', table: 'products' },
  { file: 'employees_sample.csv', table: 'employees' },
  { file: 'journal_entries_sample.csv', table: 'journal_entries' },
  { file: 'sales_orders_sample.csv', table: 'sales_orders' }
];

// Helper to convert typed values
function sanitizeValue(key, val) {
  if (val === null || val === undefined || val === '') return null;
  const trimmed = typeof val === 'string' ? val.trim() : val;
  if (trimmed === '') return null;

  // Booleans
  if (trimmed === 'True' || trimmed === 'true') return true;
  if (trimmed === 'False' || trimmed === 'false') return false;

  // Numbers for monetary/numeric keys
  const numericKeys = [
    'target_headcount', 'payment_terms_days', 'credit_limit',
    'reliability', 'activity_level', 'cost_price', 'sell_price',
    'quantity_on_hand', 'reorder_point', 'reorder_quantity',
    'annual_salary', 'hourly_rate', 'entry_number',
    'subtotal', 'gst_amount', 'total_amount', 'financial_year_end_month'
  ];

  if (numericKeys.includes(key)) {
    const num = Number(trimmed);
    return isNaN(num) ? trimmed : num;
  }

  return trimmed;
}

// Parse a single CSV file into an array of objects
function parseCsvFile(filePath) {
  return new Promise((resolve, reject) => {
    const rows = [];
    if (!fs.existsSync(filePath)) {
      return reject(new Error(`CSV file not found: ${filePath}`));
    }

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        const cleanedRow = {};
        for (const [k, v] of Object.entries(data)) {
          const cleanKey = k.trim().replace(/^\uFEFF/, ''); // Strip BOM if present
          cleanedRow[cleanKey] = sanitizeValue(cleanKey, v);
        }
        rows.push(cleanedRow);
      })
      .on('end', () => resolve(rows))
      .on('error', (err) => reject(err));
  });
}

// Inspect all CSVs and return statistics
async function inspectDataset() {
  const stats = {};
  for (const item of CSV_MAPPINGS) {
    const filePath = path.join(DATA_DIR, item.file);
    try {
      const rows = await parseCsvFile(filePath);
      stats[item.file] = {
        table: item.table,
        filePath,
        rowCount: rows.length,
        columns: rows.length > 0 ? Object.keys(rows[0]) : [],
        sampleRow: rows.length > 0 ? rows[0] : null
      };
    } catch (err) {
      stats[item.file] = {
        table: item.table,
        error: err.message
      };
    }
  }
  return stats;
}

// Load all CSV data into an in-memory dictionary
async function loadAllCsvData() {
  const dataset = {};
  for (const item of CSV_MAPPINGS) {
    const filePath = path.join(DATA_DIR, item.file);
    const rows = await parseCsvFile(filePath);
    dataset[item.table] = rows;
  }
  return dataset;
}

module.exports = {
  DATA_DIR,
  CSV_MAPPINGS,
  parseCsvFile,
  inspectDataset,
  loadAllCsvData
};
