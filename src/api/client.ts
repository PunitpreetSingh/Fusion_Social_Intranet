const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

interface ApiResponse<T = any> {
  success?: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    console.log(`🌐 API Request: ${options.method || 'GET'} ${url}`);
    if (options.body) {
      console.log('📦 Request Body:', JSON.parse(options.body as string));
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      const data = await response.json();

      console.log(`✅ API Response (${response.status}):`, data);

      if (!response.ok) {
        throw new Error(data.error || data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('❌ API Error:', error);
      throw error;
    }
  }

  async createStatusUpdate(payload: {
    authorId: string;
    body: string;
    postIn?: string;
    mentions?: string[];
    attachments?: string[];
  }) {
    console.log('📝 Creating status update:', payload);
    return this.request('/api/content/status', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async createDocument(payload: {
    authorId: string;
    title: string;
    body: string;
    visibility: {
      type: string;
      placeName?: string;
      specificPeople?: string[];
    };
    tags?: string[];
    mentions?: string[];
    attachments?: string[];
  }) {
    console.log('📄 Creating document:', payload);
    return this.request('/api/content/document', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async createBlogPost(payload: {
    authorId: string;
    title: string;
    body: string;
    blogFor?: string;
    visibility?: {
      type: string;
      placeName?: string;
    };
    tags?: string[];
    mentions?: string[];
    attachments?: string[];
  }) {
    console.log('📰 Creating blog post:', payload);
    return this.request('/api/content/blog', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async createSpace(payload: {
    name: string;
    createdBy: string;
    parent_place?: string;
  }) {
    console.log('🏢 Creating space:', payload);
    return this.request('/api/spaces', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async getUsers(query?: string) {
    const endpoint = query ? `/api/users?query=${encodeURIComponent(query)}` : '/api/users';
    return this.request(endpoint);
  }

  async getSpaces(query?: string) {
    const endpoint = query ? `/api/spaces?query=${encodeURIComponent(query)}` : '/api/spaces';
    return this.request(endpoint);
  }

  async uploadFile(file: File, contentType: string, contentId?: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('contentType', contentType);
    if (contentId) {
      formData.append('contentId', contentId);
    }

    console.log('📎 Uploading file:', file.name);

    const url = `${this.baseUrl}/api/uploads`;
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    console.log('✅ File uploaded:', data);

    if (!response.ok) {
      throw new Error(data.error || 'File upload failed');
    }

    return data;
  }
}

export const apiClient = new ApiClient(API_BASE);
export default apiClient;
