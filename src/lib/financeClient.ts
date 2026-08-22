const FINANCE_SERVICE_URL = process.env.FINANCE_SERVICE_URL || 'http://localhost:5000';

export async function getFinanceSummary(): Promise<any> {
  try {
    const res = await fetch(`${FINANCE_SERVICE_URL}/api/finance/summary`);
    if (!res.ok) {
      throw new Error(`Finance service responded with status ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error('[Finance Client] getFinanceSummary error:', error);
    throw new Error('Finance service is unreachable or failed to return summary.');
  }
}

export async function runFinanceAgent(query: string): Promise<any> {
  try {
    const res = await fetch(`${FINANCE_SERVICE_URL}/api/agent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      // Based on agent.controller.js, it expects 'message'
      body: JSON.stringify({ message: query })
    });
    
    if (!res.ok) {
      throw new Error(`Finance service responded with status ${res.status}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error('[Finance Client] runFinanceAgent error:', error);
    throw new Error('Finance service is unreachable or failed to run agent.');
  }
}
