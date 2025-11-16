const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

class ApiClient {
  private baseUrl: string;
  private backendAvailable: boolean | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async checkBackend(): Promise<boolean> {
    if (this.backendAvailable !== null) {
      return this.backendAvailable;
    }

    try {
      const response = await fetch(`${this.baseUrl}/`, {
        method: 'GET',
        signal: AbortSignal.timeout(2000)
      });
      this.backendAvailable = response.ok;
      console.log(`🔌 Express backend ${this.backendAvailable ? 'available' : 'not available'}`);
      return this.backendAvailable;
    } catch (error) {
      console.log('⚠️ Express backend not available, using Supabase REST API');
      this.backendAvailable = false;
      return false;
    }
  }

  private async supabaseInsert(table: string, data: any) {
    const url = `${SUPABASE_URL}/rest/v1/${table}`;

    console.log(`🌐 Supabase Request: POST ${url}`);
    console.log('📦 Request Body:', data);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    console.log(`✅ Supabase Response (${response.status}):`, result);

    if (!response.ok) {
      throw new Error(result.message || 'Supabase request failed');
    }

    return Array.isArray(result) ? result[0] : result;
  }

  async createStatusUpdate(payload: {
    authorId: string;
    body: string;
    postIn?: string;
    mentions?: string[];
    attachments?: string[];
  }) {
    console.log('📝 Creating status update:', payload);

    const backendReady = await this.checkBackend();

    if (backendReady) {
      try {
        const response = await fetch(`${this.baseUrl}/api/content/status`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error('Backend request failed');
        }

        const data = await response.json();
        console.log('✅ Response from Express:', data);
        return data;
      } catch (error) {
        console.log('⚠️ Express failed, falling back to Supabase');
        this.backendAvailable = false;
      }
    }

    return this.supabaseInsert('status_updates', {
      user_id: payload.authorId,
      content: payload.body,
      post_in: payload.postIn || '',
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

    const backendReady = await this.checkBackend();

    if (backendReady) {
      try {
        const response = await fetch(`${this.baseUrl}/api/content/document`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error('Backend request failed');
        }

        const data = await response.json();
        console.log('✅ Response from Express:', data);
        return data;
      } catch (error) {
        console.log('⚠️ Express failed, falling back to Supabase');
        this.backendAvailable = false;
      }
    }

    return this.supabaseInsert('documents', {
      user_id: payload.authorId,
      title: payload.title,
      content: payload.body,
      visibility_type: payload.visibility.type,
      place_name: payload.visibility.placeName || '',
      tags: payload.tags || [],
      status: 'published',
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

    const backendReady = await this.checkBackend();

    if (backendReady) {
      try {
        const response = await fetch(`${this.baseUrl}/api/content/blog`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error('Backend request failed');
        }

        const data = await response.json();
        console.log('✅ Response from Express:', data);
        return data;
      } catch (error) {
        console.log('⚠️ Express failed, falling back to Supabase');
        this.backendAvailable = false;
      }
    }

    return this.supabaseInsert('blog_posts', {
      user_id: payload.authorId,
      title: payload.title,
      content: payload.body,
      blog_name: payload.blogFor || 'Personal Blog',
      visibility_type: payload.visibility?.type || 'personal_blog',
      place_name: payload.visibility?.placeName || '',
      tags: payload.tags || [],
      status: 'published',
    });
  }

  async createSpace(payload: {
    name: string;
    createdBy: string;
    parent_place?: string;
  }) {
    console.log('🏢 Creating space:', payload);

    const backendReady = await this.checkBackend();

    if (backendReady) {
      try {
        const response = await fetch(`${this.baseUrl}/api/spaces`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error('Backend request failed');
        }

        const data = await response.json();
        console.log('✅ Response from Express:', data);
        return data;
      } catch (error) {
        console.log('⚠️ Express failed, falling back to Supabase');
        this.backendAvailable = false;
      }
    }

    return this.supabaseInsert('spaces', {
      name: payload.name,
      user_id: payload.createdBy,
      parent_place: payload.parent_place || '',
    });
  }

  async getUsers(query?: string) {
    const backendReady = await this.checkBackend();

    if (backendReady) {
      try {
        const endpoint = query ? `/api/users?query=${encodeURIComponent(query)}` : '/api/users';
        const response = await fetch(`${this.baseUrl}${endpoint}`);
        if (response.ok) {
          return await response.json();
        }
      } catch (error) {
        this.backendAvailable = false;
      }
    }

    const url = `${SUPABASE_URL}/rest/v1/users${query ? `?name=ilike.*${query}*` : ''}`;
    const response = await fetch(url, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
      }
    });
    return await response.json();
  }

  async getSpaces(query?: string) {
    const backendReady = await this.checkBackend();

    if (backendReady) {
      try {
        const endpoint = query ? `/api/spaces?query=${encodeURIComponent(query)}` : '/api/spaces';
        const response = await fetch(`${this.baseUrl}${endpoint}`);
        if (response.ok) {
          return await response.json();
        }
      } catch (error) {
        this.backendAvailable = false;
      }
    }

    const url = `${SUPABASE_URL}/rest/v1/spaces${query ? `?name=ilike.*${query}*` : ''}`;
    const response = await fetch(url, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
      }
    });
    return await response.json();
  }
}

export const apiClient = new ApiClient(API_BASE);
export default apiClient;
