import {
  User,
  ShoppingList,
  ShoppingItem,
  OCRScanResult,
  StoreDiscoveryResponse,
  DashboardData,
  ExtractedItem,
  ShoppingCategory
} from '../types';

const envApiUrl = (import.meta.env.VITE_API_URL || '').trim();
const API_BASE = envApiUrl
  ? (envApiUrl.endsWith('/api') ? envApiUrl : `${envApiUrl.replace(/\/+$/, '')}/api`)
  : '/api';

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('digitick_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorDetail = 'An error occurred';
    try {
      const errJson = await response.json();
      errorDetail = errJson.detail || errJson.message || JSON.stringify(errJson);
    } catch {
      errorDetail = response.statusText || `Request failed with status ${response.status}`;
    }
    throw new ApiError(response.status, errorDetail);
  }

  // Handle 204 or empty responses
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

// ---------------- AUTH API ----------------
export const authApi = {
  async register(email: string, password: string, fullName?: string): Promise<{ access_token: string; user: User }> {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, full_name: fullName }),
    });
  },

  async login(email: string, password: string): Promise<{ access_token: string; user: User }> {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async googleAuth(payload: {
    id_token?: string;
    email: string;
    full_name?: string;
    avatar_url?: string;
    sub?: string;
    flow: 'login' | 'signup';
  }): Promise<{ access_token: string; user: User }> {
    return request('/auth/google', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getMe(): Promise<User> {
    return request('/auth/me');
  },

  async updateProfile(fullName?: string, avatarUrl?: string): Promise<User> {
    return request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify({ full_name: fullName, avatar_url: avatarUrl }),
    });
  },

  async uploadAvatar(file: File): Promise<User> {
    const formData = new FormData();
    formData.append('file', file);
    const headers = getAuthHeader();

    const response = await fetch(`${API_BASE}/auth/profile/avatar`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      let errText = 'Failed to upload avatar';
      try {
        const errJson = await response.json();
        errText = errJson.detail || errText;
      } catch {}
      throw new ApiError(response.status, errText);
    }

    return response.json();
  },
};

// ---------------- LISTS API ----------------
export const listsApi = {
  async getLists(status?: 'active' | 'completed'): Promise<ShoppingList[]> {
    const query = status ? `?status=${status}` : '';
    return request(`/lists${query}`);
  },

  async getList(id: string): Promise<ShoppingList> {
    return request(`/lists/${id}`);
  },

  async createList(title: string): Promise<ShoppingList> {
    return request('/lists', {
      method: 'POST',
      body: JSON.stringify({ title }),
    });
  },

  async updateList(id: string, title?: string, status?: string): Promise<ShoppingList> {
    return request(`/lists/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ title, status }),
    });
  },

  async deleteList(id: string): Promise<{ message: string }> {
    return request(`/lists/${id}`, {
      method: 'DELETE',
    });
  },

  async duplicateList(id: string): Promise<ShoppingList> {
    return request(`/lists/${id}/duplicate`, {
      method: 'POST',
    });
  },

  async completeList(id: string): Promise<ShoppingList> {
    return request(`/lists/${id}/complete`, {
      method: 'POST',
    });
  },

  async reuseList(id: string): Promise<ShoppingList> {
    return request(`/lists/${id}/reuse`, {
      method: 'POST',
    });
  },
};

// ---------------- ITEMS API ----------------
export const itemsApi = {
  async addItem(listId: string, item: {
    name: string;
    quantity?: number;
    unit?: string;
    category?: ShoppingCategory;
    notes?: string;
  }): Promise<ShoppingItem> {
    return request(`/lists/${listId}/items`, {
      method: 'POST',
      body: JSON.stringify(item),
    });
  },

  async addCommaSeparated(listId: string, text: string): Promise<ShoppingItem[]> {
    return request(`/lists/${listId}/items/quick-comma`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  },

  async updateItem(listId: string, itemId: string, item: Partial<ShoppingItem>): Promise<ShoppingItem> {
    return request(`/lists/${listId}/items/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify(item),
    });
  },

  async toggleItem(listId: string, itemId: string): Promise<ShoppingItem> {
    return request(`/lists/${listId}/items/${itemId}/toggle`, {
      method: 'PATCH',
    });
  },

  async deleteItem(listId: string, itemId: string): Promise<{ message: string }> {
    return request(`/lists/${listId}/items/${itemId}`, {
      method: 'DELETE',
    });
  },
};

// ---------------- OCR API ----------------
export const ocrApi = {
  async scanImage(file: File | Blob): Promise<OCRScanResult> {
    const formData = new FormData();
    formData.append('file', file, 'scan.jpg');

    const headers: Record<string, string> = {
      ...getAuthHeader(),
    };

    const response = await fetch(`${API_BASE}/ocr/scan`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      let errText = 'Failed to process document';
      try {
        const errJson = await response.json();
        errText = errJson.detail || errText;
      } catch {}
      throw new ApiError(response.status, errText);
    }

    return response.json();
  },

  async confirmToNewOrExistingList(
    items: ExtractedItem[],
    options: { listId?: string; newListTitle?: string }
  ): Promise<ShoppingList> {
    return request('/ocr/confirm', {
      method: 'POST',
      body: JSON.stringify({
        list_id: options.listId,
        new_list_title: options.newListTitle,
        items,
      }),
    });
  },
};

// ---------------- STORES API ----------------
export const storesApi = {
  async getNearby(params: {
    listId?: string;
    lat?: number;
    lng?: number;
    query?: string;
  }): Promise<StoreDiscoveryResponse> {
    const searchParams = new URLSearchParams();
    if (params.listId) searchParams.set('list_id', params.listId);
    if (params.lat !== undefined) searchParams.set('lat', params.lat.toString());
    if (params.lng !== undefined) searchParams.set('lng', params.lng.toString());
    if (params.query) searchParams.set('query', params.query);

    return request(`/stores/nearby?${searchParams.toString()}`);
  },
};

// ---------------- DASHBOARD API ----------------
export const dashboardApi = {
  async getSummary(): Promise<DashboardData> {
    return request('/dashboard/summary');
  },
};

