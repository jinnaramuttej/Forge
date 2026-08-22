import http from 'http';

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
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ message: query });
    const url = new URL(`${FINANCE_SERVICE_URL}/api/agent`);
    
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      },
      timeout: 1200000, // 20 minutes
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(body));
          } catch (e) {
            resolve(body);
          }
        } else {
          reject(new Error(`Finance service responded with status ${res.statusCode}`));
        }
      });
    });

    req.on('error', (e) => {
      console.error('[Finance Client] runFinanceAgent error:', e);
      reject(new Error('Finance service is unreachable or failed to run agent.'));
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Finance service request timed out.'));
    });

    req.write(data);
    req.end();
  });
}
