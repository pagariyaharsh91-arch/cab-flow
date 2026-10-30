import {
  Booking,
  Customer,
  DashboardSummary,
  DBHealth,
  Driver,
  Payment,
  User,
  Vehicle,
  ActivityLog,
} from '../types';

const BASE_URL = '/api';

function getAuthHeader(): HeadersInit {
  const token = localStorage.getItem('cabflow_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error ${res.status}: ${res.statusText}`);
  }
  return (await res.json()) as T;
}

export const api = {
  // Health
  getHealth: (): Promise<DBHealth> =>
    request<DBHealth>(`${BASE_URL}/health`),

  // Seed / Reset
  seedDemo: (): Promise<{ message: string; counts: any }> =>
    request<{ message: string; counts: any }>(`${BASE_URL}/demo/seed`, {
      method: 'POST',
      headers: getAuthHeader(),
    }),

  clearDemo: (): Promise<{ message: string }> =>
    request<{ message: string }>(`${BASE_URL}/demo/clear`, {
      method: 'POST',
      headers: getAuthHeader(),
    }),

  // Auth
  login: (email: string, password: string): Promise<{ token: string; user: User }> =>
    request<{ token: string; user: User }>(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }),

  getMe: (): Promise<{ user: User | null }> =>
    request<{ user: User | null }>(`${BASE_URL}/auth/me`, {
      headers: getAuthHeader(),
    }),

  logout: (): Promise<{ message: string }> =>
    request<{ message: string }>(`${BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: getAuthHeader(),
    }),

  // Dashboard
  getDashboardSummary: (): Promise<DashboardSummary> =>
    request<DashboardSummary>(`${BASE_URL}/dashboard/summary`, {
      headers: getAuthHeader(),
    }),

  // Bookings
  getBookings: (filters?: {
    search?: string;
    ride_status?: string;
    payment_status?: string;
    driver_id?: string;
    vehicle_id?: string;
    date?: string;
  }): Promise<Booking[]> => {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.ride_status) params.append('ride_status', filters.ride_status);
    if (filters?.payment_status) params.append('payment_status', filters.payment_status);
    if (filters?.driver_id) params.append('driver_id', filters.driver_id);
    if (filters?.vehicle_id) params.append('vehicle_id', filters.vehicle_id);
    if (filters?.date) params.append('date', filters.date);

    return request<Booking[]>(`${BASE_URL}/bookings?${params.toString()}`, {
      headers: getAuthHeader(),
    });
  },

  createBooking: (data: Partial<Booking>): Promise<Booking> =>
    request<Booking>(`${BASE_URL}/bookings`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(data),
    }),

  updateBooking: (id: string, updates: Partial<Booking>): Promise<Booking> =>
    request<Booking>(`${BASE_URL}/bookings/${id}`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: JSON.stringify(updates),
    }),

  updateBookingStatus: (
    id: string,
    status: { ride_status?: string; payment_status?: string }
  ): Promise<Booking> =>
    request<Booking>(`${BASE_URL}/bookings/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeader(),
      body: JSON.stringify(status),
    }),

  deleteBooking: (id: string): Promise<any> =>
    request<any>(`${BASE_URL}/bookings/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    }),

  // Vehicles
  getVehicles: (filters?: { type?: string; status?: string; search?: string }): Promise<Vehicle[]> => {
    const params = new URLSearchParams();
    if (filters?.type) params.append('type', filters.type);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);

    return request<Vehicle[]>(`${BASE_URL}/vehicles?${params.toString()}`, {
      headers: getAuthHeader(),
    });
  },

  createVehicle: (data: Partial<Vehicle>): Promise<Vehicle> =>
    request<Vehicle>(`${BASE_URL}/vehicles`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(data),
    }),

  updateVehicle: (id: string, updates: Partial<Vehicle>): Promise<Vehicle> =>
    request<Vehicle>(`${BASE_URL}/vehicles/${id}`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: JSON.stringify(updates),
    }),

  deleteVehicle: (id: string): Promise<any> =>
    request<any>(`${BASE_URL}/vehicles/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    }),

  // Drivers
  getDrivers: (filters?: { status?: string; search?: string }): Promise<Driver[]> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);

    return request<Driver[]>(`${BASE_URL}/drivers?${params.toString()}`, {
      headers: getAuthHeader(),
    });
  },

  createDriver: (data: Partial<Driver>): Promise<Driver> =>
    request<Driver>(`${BASE_URL}/drivers`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(data),
    }),

  updateDriver: (id: string, updates: Partial<Driver>): Promise<Driver> =>
    request<Driver>(`${BASE_URL}/drivers/${id}`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: JSON.stringify(updates),
    }),

  deleteDriver: (id: string): Promise<any> =>
    request<any>(`${BASE_URL}/drivers/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    }),

  // Customers
  getCustomers: (search?: string): Promise<Customer[]> => {
    const url = search ? `${BASE_URL}/customers?search=${encodeURIComponent(search)}` : `${BASE_URL}/customers`;
    return request<Customer[]>(url, { headers: getAuthHeader() });
  },

  createCustomer: (data: Partial<Customer>): Promise<Customer> =>
    request<Customer>(`${BASE_URL}/customers`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(data),
    }),

  updateCustomer: (id: string, updates: Partial<Customer>): Promise<Customer> =>
    request<Customer>(`${BASE_URL}/customers/${id}`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: JSON.stringify(updates),
    }),

  deleteCustomer: (id: string): Promise<any> =>
    request<any>(`${BASE_URL}/customers/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    }),

  // Payments
  getPayments: (filters?: { status?: string; method?: string; search?: string }): Promise<Payment[]> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.method) params.append('method', filters.method);
    if (filters?.search) params.append('search', filters.search);

    return request<Payment[]>(`${BASE_URL}/payments?${params.toString()}`, {
      headers: getAuthHeader(),
    });
  },

  recordPayment: (data: {
    booking_id: string;
    customer_name: string;
    amount: number;
    method: string;
    status: string;
  }): Promise<Payment> =>
    request<Payment>(`${BASE_URL}/payments`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(data),
    }),

  // Reports
  getReports: (): Promise<any> =>
    request<any>(`${BASE_URL}/reports/summary`, {
      headers: getAuthHeader(),
    }),

  // Activity Logs
  getActivityLogs: (filters?: { search?: string; action?: string; limit?: number }): Promise<ActivityLog[]> => {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.action) params.append('action', filters.action);
    if (filters?.limit) params.append('limit', String(filters.limit));

    return request<ActivityLog[]>(`${BASE_URL}/activity-logs?${params.toString()}`, {
      headers: getAuthHeader(),
    });
  },

  // Global Search
  searchGlobal: (query: string): Promise<{ bookings: Booking[]; customers: Customer[]; drivers: Driver[]; vehicles: Vehicle[] }> =>
    request<{ bookings: Booking[]; customers: Customer[]; drivers: Driver[]; vehicles: Vehicle[] }>(
      `${BASE_URL}/search?q=${encodeURIComponent(query)}`,
      { headers: getAuthHeader() }
    ),

  // Settings
  getSettings: (): Promise<any> =>
    request<any>(`${BASE_URL}/settings`, {
      headers: getAuthHeader(),
    }),

  updateSettings: (settings: any): Promise<any> =>
    request<any>(`${BASE_URL}/settings`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: JSON.stringify(settings),
    }),
};
