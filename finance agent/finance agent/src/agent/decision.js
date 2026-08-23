const { makeDecision, generateFinalReport } = require('../llm');
const { recordAgentAction, saveMemoryTool } = require('../tools');

// 1. Analyze Findings and Formulate Decisions
async function decisionNode(state) {
  console.log('\n[DECISION] Analyzing findings against company financial policies...');

  const decisionResult = await makeDecision({
    goal: state.goal,
    findings: state.findings,
    policies: state.policies
  });

  const decisions = decisionResult.decisions || [];
  const proposedActions = decisionResult.proposedActions || [];

  decisions.forEach(d => {
    console.log(`[DECISION] ${d.type.toUpperCase()}: ${d.description}`);
  });

  return {
    decisions,
    proposedActions,
    status: 'decisions_made'
  };
}

// 2. Policy Check and Autonomous Action Execution
async function actionNode(state) {
  console.log('\n[POLICY] Evaluating action boundaries against company financial policies...');

  const proposedActions = state.proposedActions || [];
  const executedActions = [];

  for (const pa of proposedActions) {
    const actionRecord = await recordAgentAction(state.companyId, {
      taskId: state.taskId,
      actionType: pa.actionType,
      description: pa.description,
      targetEntityType: pa.targetEntityType,
      targetEntityId: pa.targetEntityId,
      amount: pa.amount,
      reason: pa.reason
    });

    if (actionRecord.requires_approval) {
      console.log(`[ACTION (REQUIRES APPROVAL)] ${actionRecord.action_type} - £${actionRecord.amount} -> Status: [${actionRecord.status.toUpperCase()}]`);
    } else {
      console.log(`[ACTION (AUTONOMOUS)] ${actionRecord.action_type} - ${actionRecord.description} -> Status: [EXECUTED]`);
    }

    executedActions.push(actionRecord);
  }

  return {
    actions: executedActions,
    status: 'actions_executed'
  };
}

// 3. Save Insights and Observations to Persistent Memory
async function memoryUpdateNode(state) {
  console.log('\n[MEMORY] Updating persistent company memory...');

  const runway = state.findings.calculateRunway;
  if (runway) {
    await saveMemoryTool(state.companyId, {
      category: 'observation',
      key: `runway_assessment_${new Date().toISOString().split('T')[0]}`,
      value: {
        runwayMonths: runway.runwayMonths,
        projectedCash60Days: runway.projectedCash60Days,
        isSafe60Days: runway.isSafe60Days,
        assessedAt: new Date().toISOString()
      },
      importance: 4
    });
    console.log(`[MEMORY] Saved 60-day runway safety record (Runway: ${runway.runwayMonths} months)`);
  }

  return {
    status: 'memory_saved'
  };
}

// 4. Generate Final Report for Founder
async function reportNode(state) {
  console.log('\n[AGENT] Generating structured executive response...');

  const report = await generateFinalReport({
    goal: state.goal,
    plan: state.plan,
    findings: state.findings,
    decisions: state.decisions,
    actions: state.actions
  });

  console.log('[AGENT] Task completed successfully.\n');

  return {
    finalResponse: report,
    status: 'completed'
  };
}

module.exports = {
  decisionNode,
  actionNode,
  memoryUpdateNode,
  reportNode
};
