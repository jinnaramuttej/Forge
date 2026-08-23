const { db } = require('../database/supabase');
const calc = require('../utils/calculations');

async function compareBudget(companyId, { departmentId } = {}) {
  let [departments, employees] = await Promise.all([
    db.find('departments', { company_id: companyId }),
    db.find('employees', { company_id: companyId })
  ]);

  if (departmentId) {
    departments = departments.filter(d => d.id === departmentId);
  }

  const varianceList = calc.calculateBudgetVariance(departments, employees);
  return {
    departmentsAnalyzed: varianceList.length,
    departments: varianceList
  };
}

module.exports = { compareBudget };
