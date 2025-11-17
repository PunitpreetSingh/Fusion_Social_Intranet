const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";


export async function apiFetch(path: string, options: RequestInit = {}) {
  const url = `${API_BASE}${path}`;

  console.log(`🌐 API Request: ${options.method || 'GET'} ${url}`);

  const config: RequestInit = {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  };

  const res = await fetch(url, config);
  const data = await res.json().catch(() => ({}));

  console.log(`✅ Response (${res.status}):`, data);

  if (!res.ok) {
    throw new Error(data.error || data.message || 'Request failed');
  }

  return data;
}

export const apiClient = {
  /** STATUS UPDATE */
  async createStatusUpdate(payload: any) {
    return apiFetch('/api/content/status', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /** DOCUMENT */
  async createDocument(payload: any) {
    return apiFetch('/api/content/document', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /** BLOG POST */
  async createBlogPost(payload: any) {
    return apiFetch('/api/content/blog', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /** SPACES */
  async createSpace(payload: any) {
    return apiFetch('/api/spaces', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }
};

export default apiClient;
