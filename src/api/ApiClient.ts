/**
 * Simple API client for testing
 */
export class ApiClient {
  constructor(private baseUrl: string) {}

  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    return {
      status: response.status,
      data: await response.json(),
      ok: response.ok
    };
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`);
    
    return {
      status: response.status,
      data: await response.json(),
      ok: response.ok
    };
  }
}

export interface ApiResponse<T> {
  status: number;
  data: T;
  ok: boolean;
}
