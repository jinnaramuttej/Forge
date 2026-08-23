const { StateGraph, END, START } = require('@langchain/langgraph');
const { AgentState } = require('./state');
const { plannerNode } = require('./planner');
const { decisionNode, actionNode, memoryUpdateNode, reportNode } = require('./decision');
const { retrieveRelevantMemory } = require('../memory/retrieval.service');
const { executeTool } = require('../tools');
const { db } = require('../database/supabase');

// Node 1: Understand Goal and Initialize Task
async function understandGoalNode(state) {
  const goal = state.goal || state.request || 'Provide financial review';
  console.log(`\n[AGENT] Goal received: "${goal}" (Company: ${state.companyId})`);

  // Persist task entry
  await db.insert('agent_tasks', {
    id: state.taskId,
    company_id: state.companyId,
    user_id: state.userId,
    request: state.request,
    goal,
    status: 'planning'
  });

  return {
    goal,
    status: 'goal_understood'
  };
}

// Node 2: Retrieve Persistent Company Memory & Policies
async function retrieveMemoryNode(state) {
  console.log('[MEMORY] Searching company memory and active financial policies...');

  const { memories, policies } = await retrieveRelevantMemory(state.companyId, state.goal);
  console.log(`[MEMORY] Found ${memories.length} relevant memories and ${policies.length} active policies.`);

  return {
    memory: memories,
    policies,
    status: 'memory_retrieved'
  };
}

// Node 3: Execute Tools
async function executeToolsNode(state) {
  const plan = state.plan || [];
  console.log(`\n[AGENT] Executing ${plan.length} planned financial tools...`);

  const findings = { ...state.findings };
  const toolCalls = [...(state.toolCalls || [])];

  for (const step of plan) {
    const res = await executeTool(step.tool, state.companyId, step.args || {});
    toolCalls.push({
      stepNumber: step.stepNumber,
      tool: step.tool,
      args: step.args,
      success: res.success,
      durationMs: res.durationMs
    });

    if (res.success) {
      findings[step.tool] = res.result;
    } else {
      findings[step.tool] = { error: res.error };
    }
  }

  return {
    findings,
    toolCalls,
    status: 'tools_executed'
  };
}

// Build LangGraph State Graph
function buildFinanceAgentGraph() {
  const workflow = new StateGraph(AgentState)
    .addNode('understand_goal', understandGoalNode)
    .addNode('retrieve_memory', retrieveMemoryNode)
    .addNode('create_plan', plannerNode)
    .addNode('execute_tools', executeToolsNode)
    .addNode('make_decision', decisionNode)
    .addNode('execute_actions', actionNode)
    .addNode('update_memory', memoryUpdateNode)
    .addNode('generate_report', reportNode);

  // Define linear execution flow
  workflow.addEdge(START, 'understand_goal');
  workflow.addEdge('understand_goal', 'retrieve_memory');
  workflow.addEdge('retrieve_memory', 'create_plan');
  workflow.addEdge('create_plan', 'execute_tools');
  workflow.addEdge('execute_tools', 'make_decision');
  workflow.addEdge('make_decision', 'execute_actions');
  workflow.addEdge('execute_actions', 'update_memory');
  workflow.addEdge('update_memory', 'generate_report');
  workflow.addEdge('generate_report', END);

  return workflow.compile();
}

const financeAgentApp = buildFinanceAgentGraph();

// Public execution helper
async function runFinanceAgent({ companyId, userId = 'founder-1', message, goal }) {
  const taskId = require('crypto').randomUUID();
  const inputState = {
    companyId: companyId || 'dd6f7306-36ed-4c9f-9996-6c5ab35d6628',
    userId,
    taskId,
    request: message,
    goal: goal || message
  };

  const finalState = await financeAgentApp.invoke(inputState);

  // Update task record with complete trace
  await db.update('agent_tasks', { id: taskId }, {
    status: finalState.status || 'completed',
    plan: finalState.plan,
    tool_calls: finalState.toolCalls,
    findings: finalState.findings,
    decisions: finalState.decisions,
    actions: finalState.actions,
    memory_used: finalState.memory,
    final_response: finalState.finalResponse,
    updated_at: new Date().toISOString()
  });

  return {
    taskId,
    status: finalState.status || 'completed',
    goal: finalState.goal,
    plan: finalState.plan,
    toolCalls: finalState.toolCalls,
    memoryUsed: (finalState.memory || []).map(m => ({ category: m.category, key: m.key })),
    findings: finalState.findings,
    decisions: finalState.decisions,
    actions: finalState.actions,
    finalResponse: finalState.finalResponse
  };
}

module.exports = {
  financeAgentApp,
  runFinanceAgent
};
