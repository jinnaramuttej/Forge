const { generatePlan } = require('../llm');
const { listAvailableTools } = require('../tools');

async function plannerNode(state) {
  const goal = state.goal || state.request;
  console.log(`\n[PLANNER] Creating plan for goal: "${goal}"`);

  const planResult = await generatePlan({
    goal,
    request: state.request,
    memories: state.memory
  });

  const steps = planResult.steps || [];
  console.log(`[PLANNER] Generated ${steps.length} execution steps:`);
  steps.forEach(s => {
    console.log(`  ${s.stepNumber}. [${s.tool}] ${s.description}`);
  });

  return {
    goal,
    plan: steps,
    status: 'planning_complete'
  };
}

module.exports = { plannerNode };
