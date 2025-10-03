export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://beauty-eight-tau.vercel.app/';

function getAuthToken(): string | null {
	try {
		return localStorage.getItem('auth_token');
	} catch {
		return null;
	}
}

export async function apiFetch<T>(
	path: string,
	options: {
		method?: HttpMethod;
		body?: unknown;
		auth?: boolean;
		headers?: Record<string, string>;
	} = {}
): Promise<T> {
	const url = path.startsWith('http') ? path : `${BASE_URL}${path}`;
	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
		...(options.headers || {})
	};

	if (options.auth) {
		const token = getAuthToken();
		if (token) headers['Authorization'] = `Bearer ${token}`;
	}

	const response = await fetch(url, {
		method: options.method || 'GET',
		headers,
		body: options.body ? JSON.stringify(options.body) : undefined,
		credentials: 'omit'
	});

	const contentType = response.headers.get('content-type') || '';
	const isJson = contentType.includes('application/json');
	const data = isJson ? await response.json() : (undefined as unknown as T);

	if (!response.ok) {
		const message = isJson && (data as any)?.message ? (data as any).message : response.statusText;
		throw new Error(message || 'Request failed');
	}

	return data as T;
}

// Auth endpoints
export const AuthAPI = {
	register: (payload: { name: string; email: string; password: string; phone?: string }) =>
		apiFetch<{ success: boolean; data: { user: any; token: string } }>(`/api/auth/register`, {
			method: 'POST',
			body: payload
		}),
	login: (payload: { email: string; password: string }) =>
		apiFetch<{ success: boolean; data: { user: any; token: string } }>(`/api/auth/login`, {
			method: 'POST',
			body: payload
		}),
	me: () => apiFetch<{ success: boolean; data: { user: any } }>(`/api/auth/me`, { auth: true })
};

// Catalog endpoints
export const CatalogAPI = {
	listProducts: (query: Record<string, string | number | boolean | undefined> = {}) => {
		const params = new URLSearchParams();
		Object.entries(query).forEach(([k, v]) => {
			if (v !== undefined && v !== null) params.append(k, String(v));
		});
		const q = params.toString();
		return apiFetch<{
			success: boolean;
			count: number;
			total: number;
			totalPages: number;
			currentPage: number;
			data: { products: any[] };
		}>(`/api/products${q ? `?${q}` : ''}`);
	},
	featured: () =>
		apiFetch<{ success: boolean; data: { products: any[] } }>(`/api/products/featured`),
	getProduct: (id: string) => apiFetch<{ success: boolean; data: { product: any } }>(`/api/products/${id}`),
	listCategories: () => apiFetch<{ success: boolean; data: { categories: any[] } }>(`/api/categories`)
};

// Orders endpoints
export const OrdersAPI = {
	create: (payload: any) =>
		apiFetch<{ success: boolean; data: { order: any } }>(`/api/orders`, { method: 'POST', body: payload, auth: true }),
	myOrders: () => apiFetch<{ success: boolean; data: { orders: any[] } }>(`/api/orders/my-orders`, { auth: true }),
	getById: (id: string) => apiFetch<{ success: boolean; data: { order: any } }>(`/api/orders/${id}`, { auth: true })
};

// Admin endpoints
// Image upload function with better error handling
export async function uploadImage(file: File): Promise<string> {
  // Validate file
  if (!file || !file.type.startsWith('image/')) {
    throw new Error('Please select a valid image file');
  }

  if (file.size > 10 * 1024 * 1024) { // 10MB limit
    throw new Error('File size must be less than 10MB');
  }

  const formData = new FormData();
  formData.append('image', file);

  const token = getAuthToken();
  if (!token) {
    throw new Error('You must be logged in to upload images');
  }

  try {
    const response = await fetch(`${BASE_URL}/api/admin/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
        // Don't set Content-Type, let browser set it with boundary for FormData
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Upload failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || 'Image upload failed');
    }
    
    return data.url;
  } catch (error: any) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to server. Please check if the server is running.');
    }
    throw error;
  }
}

export const AdminAPI = {
  stats: () => apiFetch<{ success: boolean; data: any }>(`/api/admin/dashboard/stats`, { auth: true }),
  listProducts: (query: Record<string, string | number> = {}) => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([k, v]) => params.append(k, String(v)));
    return apiFetch<{ success: boolean; data: { products: any[] } }>(`/api/products${params.toString() ? `?${params.toString()}` : ''}`, { auth: true });
  },
  createProduct: (payload: any) => apiFetch<{ success: boolean; data: { product: any } }>(`/api/admin/products`, { method: 'POST', body: payload, auth: true }),
  updateProduct: (id: string, payload: any) => apiFetch<{ success: boolean; data: { product: any } }>(`/api/admin/products/${id}`, { method: 'PUT', body: payload, auth: true }),
  deleteProduct: (id: string) => apiFetch<{ success: boolean }>(`/api/admin/products/${id}`, { method: 'DELETE', auth: true }),
  createCategory: (payload: any) => apiFetch<{ success: boolean; data: { category: any } }>(`/api/admin/categories`, { method: 'POST', body: payload, auth: true }),
  updateCategory: (id: string, payload: any) => apiFetch<{ success: boolean; data: { category: any } }>(`/api/admin/categories/${id}`, { method: 'PUT', body: payload, auth: true }),
  deleteCategory: (id: string) => apiFetch<{ success: boolean }>(`/api/admin/categories/${id}`, { method: 'DELETE', auth: true }),
  listOrders: (query: Record<string, string | number> = {}) => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([k, v]) => params.append(k, String(v)));
    return apiFetch<{ success: boolean; data: { orders: any[] } }>(`/api/admin/orders${params.toString() ? `?${params.toString()}` : ''}`, { auth: true });
  },
  updateOrderStatus: (id: string, payload: any) => apiFetch<{ success: boolean; data: { order: any } }>(`/api/admin/orders/${id}`, { method: 'PUT', body: payload, auth: true }),
  listUsers: (query: Record<string, string | number> = {}) => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([k, v]) => params.append(k, String(v)));
    return apiFetch<{ success: boolean; data: { users: any[] } }>(`/api/admin/users${params.toString() ? `?${params.toString()}` : ''}`, { auth: true });
  },
  updateUserRole: (id: string, role: 'user' | 'admin') => apiFetch<{ success: boolean; data: { user: any } }>(`/api/admin/users/${id}/role`, { method: 'PUT', body: { role }, auth: true }),
  deleteUser: (id: string) => apiFetch<{ success: boolean }>(`/api/admin/users/${id}`, { method: 'DELETE', auth: true })
};


