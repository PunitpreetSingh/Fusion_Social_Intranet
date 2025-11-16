const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

export async function apiFetch(path: string, options: RequestInit = {}) {
  const url = `${API_BASE}${path}`;

  console.log(`🌐 API Request: ${options.method || 'GET'} ${url}`);
  if (options.body) {
    console.log('📦 Request Body:', JSON.parse(options.body as string));
  }

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options,
  };

  const res = await fetch(url, config);
  const data = await res.json();

  console.log(`✅ Response (${res.status}):`, data);

  if (!res.ok) {
    throw new Error(data.error || data.message || 'Request failed');
  }

  return data;
}

export const apiClient = {
  async createStatusUpdate(payload: {
    authorId: string;
    body: string;
    postIn?: string;
    mentions?: string[];
    attachments?: string[];
  }) {
    return apiFetch('/api/content/status', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async createDocument(payload: {
    title: string;
    body: string;
    visibility: any;
    placeId?: string;
    tags?: string[];
    specificPeople?: string[];
    attachments?: string[];
    mentions?: string[];
    createdBy: string;
  }) {
    return apiFetch('/api/content/document', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async createBlogPost(payload: {
    title: string;
    body: string;
    blogFor?: string;
    tags?: string[];
    attachments?: string[];
    authorId: string;
  }) {
    return apiFetch('/api/content/blog', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async createSpace(payload: {
    name: string;
    description?: string;
    createdBy: string;
  }) {
    return apiFetch('/api/spaces', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async searchUsers(query: string) {
    return apiFetch(`/api/users/search?q=${encodeURIComponent(query)}`);
  },

  async searchSpaces(query: string) {
    return apiFetch(`/api/spaces/search?q=${encodeURIComponent(query)}`);
  },

  async uploadFile(file: File, contentType: string, contentId?: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('contentType', contentType);
    if (contentId) {
      formData.append('contentId', contentId);
    }

    const url = `${API_BASE}/api/uploads`;
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Upload failed');
    }

    return await response.json();
  }
};

export default apiClient;
