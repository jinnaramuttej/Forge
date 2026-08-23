const { Annotation } = require('@langchain/langgraph');

/**
 * LangGraph Agent State Definition
 */
const AgentState = Annotation.Root({
  companyId: Annotation({
    reducer: (curr, update) => update ?? curr,
    default: () => 'dd6f7306-36ed-4c9f-9996-6c5ab35d6628'
  }),
  userId: Annotation({
    reducer: (curr, update) => update ?? curr,
    default: () => 'founder-1'
  }),
  taskId: Annotation({
    reducer: (curr, update) => update ?? curr,
    default: () => require('crypto').randomUUID()
  }),
  request: Annotation({
    reducer: (curr, update) => update ?? curr,
    default: () => ''
  }),
  goal: Annotation({
    reducer: (curr, update) => update ?? curr,
    default: () => ''
  }),
  plan: Annotation({
    reducer: (curr, update) => update ?? curr,
    default: () => []
  }),
  currentStep: Annotation({
    reducer: (curr, update) => update ?? curr,
    default: () => 0
  }),
  memory: Annotation({
    reducer: (curr, update) => update ?? curr,
    default: () => []
  }),
  policies: Annotation({
    reducer: (curr, update) => update ?? curr,
    default: () => []
  }),
  toolCalls: Annotation({
    reducer: (curr, update) => (Array.isArray(update) ? [...curr, ...update] : curr),
    default: () => []
  }),
  findings: Annotation({
    reducer: (curr, update) => ({ ...curr, ...update }),
    default: () => ({})
  }),
  decisions: Annotation({
    reducer: (curr, update) => (Array.isArray(update) ? update : curr),
    default: () => []
  }),
  proposedActions: Annotation({
    reducer: (curr, update) => (Array.isArray(update) ? update : curr),
    default: () => []
  }),
  actions: Annotation({
    reducer: (curr, update) => (Array.isArray(update) ? update : curr),
    default: () => []
  }),
  errors: Annotation({
    reducer: (curr, update) => (Array.isArray(update) ? [...curr, ...update] : curr),
    default: () => []
  }),
  finalResponse: Annotation({
    reducer: (curr, update) => update ?? curr,
    default: () => ''
  }),
  status: Annotation({
    reducer: (curr, update) => update ?? curr,
    default: () => 'pending'
  })
});

module.exports = { AgentState };
