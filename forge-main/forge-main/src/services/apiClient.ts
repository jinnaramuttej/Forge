const API_BASE = 'http://localhost:3000/api';

export const apiClient = {
  // --- Hiring ---
  generateHiringJob: async (params: { role: string; budget: string; location: string; work_mode: string; business_type: string }) => {
    const res = await fetch(`${API_BASE}/hiring/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error('Failed to generate hiring job');
    return res.json();
  },

  pollHiringJob: async (jobId: string) => {
    const res = await fetch(`${API_BASE}/hiring/${jobId}`);
    if (!res.ok) throw new Error('Failed to poll hiring job');
    return res.json();
  },

  getHiringJobs: async () => {
    const res = await fetch(`${API_BASE}/hiring`);
    if (!res.ok) throw new Error('Failed to fetch hiring jobs');
    return res.json();
  },

  // --- Legal ---
  generateLegalDocument: async (params: { document_type: string; business_id: string; details: any }) => {
    const res = await fetch(`${API_BASE}/legal/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error('Failed to generate legal document');
    return res.json();
  },

  pollLegalDocument: async (docId: string) => {
    const res = await fetch(`${API_BASE}/legal/${docId}`);
    if (!res.ok) throw new Error('Failed to poll legal document');
    return res.json();
  },

  getLegalDocuments: async () => {
    const res = await fetch(`${API_BASE}/legal`);
    if (!res.ok) throw new Error('Failed to fetch legal documents');
    return res.json();
  },

  // --- Finance ---
  queryFinance: async (message: string) => {
    const res = await fetch(`${API_BASE}/finance/agent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: message }), // Changed to match backend expectations
    });
    if (!res.ok) throw new Error('Failed to query finance agent');
    return res.json();
  },

  getFinanceSummary: async () => {
    const res = await fetch(`${API_BASE}/finance/summary`);
    if (!res.ok) throw new Error('Failed to fetch finance summary');
    return res.json();
  },

  // --- Helpers ---
  pollUntilDone: async <T>(
    pollFn: () => Promise<T>,
    delayMs = 2000
  ): Promise<T> => {
    while (true) {
      const result: any = await pollFn();
      if (result.status === 'done' || result.status === 'error' || result.status === 'Completed' || result.status === 'Failed') {
        return result;
      }
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  },
};
