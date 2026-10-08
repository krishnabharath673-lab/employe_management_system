/**
 * Frontend API Service
 * Centralized REST API calls for Employee Management System
 */

export interface Department {
  department_id: number;
  department_name: string;
  description: string;
  employee_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Employee {
  employee_id: number;
  employee_code: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: 'Male' | 'Female' | 'Other';
  date_of_birth: string;
  hire_date: string;
  job_title: string;
  salary: number;
  department_id: number;
  department_name?: string;
  address: string;
  city: string;
  status: 'Active' | 'Inactive';
  created_at?: string;
  updated_at?: string;
}

export interface EmployeeInput {
  employee_code: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: 'Male' | 'Female' | 'Other';
  date_of_birth: string;
  hire_date: string;
  job_title: string;
  salary: number;
  department_id: number;
  address: string;
  city: string;
  status: 'Active' | 'Inactive';
}

export interface EmployeeQueryParams {
  search?: string;
  departmentId?: number | string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface EmployeeListResponse {
  success: boolean;
  employees: Employee[];
  total: number;
  page: number;
  totalPages: number;
}

export interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  inactiveEmployees: number;
  totalDepartments: number;
  departmentDistribution: {
    department_id: number;
    department_name: string;
    employee_count: number;
    percentage: number;
  }[];
  recentEmployees: Employee[];
}

const BASE_URL = '/api';

async function handleResponse<T>(res: Response): Promise<T> {
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || 'An unexpected server error occurred.');
  }
  return json;
}

export const api = {
  // --- Employee Endpoints ---
  async getEmployees(params?: EmployeeQueryParams): Promise<EmployeeListResponse> {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.departmentId && params.departmentId !== 'All') {
      query.append('departmentId', params.departmentId.toString());
    }
    if (params?.status && params.status !== 'All') {
      query.append('status', params.status);
    }
    if (params?.sortBy) query.append('sortBy', params.sortBy);
    if (params?.sortOrder) query.append('sortOrder', params.sortOrder);
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());

    const res = await fetch(`${BASE_URL}/employees?${query.toString()}`);
    return handleResponse<EmployeeListResponse>(res);
  },

  async getEmployeeById(id: number): Promise<{ success: boolean; data: Employee }> {
    const res = await fetch(`${BASE_URL}/employees/${id}`);
    return handleResponse<{ success: boolean; data: Employee }>(res);
  },

  async createEmployee(data: EmployeeInput): Promise<{ success: boolean; message: string; data: Employee }> {
    const res = await fetch(`${BASE_URL}/employees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<{ success: boolean; message: string; data: Employee }>(res);
  },

  async updateEmployee(id: number, data: Partial<EmployeeInput>): Promise<{ success: boolean; message: string; data: Employee }> {
    const res = await fetch(`${BASE_URL}/employees/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<{ success: boolean; message: string; data: Employee }>(res);
  },

  async deleteEmployee(id: number): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${BASE_URL}/employees/${id}`, {
      method: 'DELETE',
    });
    return handleResponse<{ success: boolean; message: string }>(res);
  },

  async getEmployeesByDepartment(departmentId: number): Promise<{ success: boolean; count: number; data: Employee[] }> {
    const res = await fetch(`${BASE_URL}/employees/department/${departmentId}`);
    return handleResponse<{ success: boolean; count: number; data: Employee[] }>(res);
  },

  // --- Department Endpoints ---
  async getDepartments(): Promise<{ success: boolean; count: number; data: Department[] }> {
    const res = await fetch(`${BASE_URL}/departments`);
    return handleResponse<{ success: boolean; count: number; data: Department[] }>(res);
  },

  async getDepartmentById(id: number): Promise<{ success: boolean; data: Department }> {
    const res = await fetch(`${BASE_URL}/departments/${id}`);
    return handleResponse<{ success: boolean; data: Department }>(res);
  },

  async createDepartment(data: { department_name: string; description: string }): Promise<{ success: boolean; message: string; data: Department }> {
    const res = await fetch(`${BASE_URL}/departments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<{ success: boolean; message: string; data: Department }>(res);
  },

  async updateDepartment(id: number, data: { department_name: string; description: string }): Promise<{ success: boolean; message: string; data: Department }> {
    const res = await fetch(`${BASE_URL}/departments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<{ success: boolean; message: string; data: Department }>(res);
  },

  async deleteDepartment(id: number): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${BASE_URL}/departments/${id}`, {
      method: 'DELETE',
    });
    return handleResponse<{ success: boolean; message: string }>(res);
  },

  // --- Dashboard Stats ---
  async getDashboardStats(): Promise<{ success: boolean; data: DashboardStats }> {
    const res = await fetch(`${BASE_URL}/employees/dashboard-stats`);
    return handleResponse<{ success: boolean; data: DashboardStats }>(res);
  },

  // --- Reset Sample Data ---
  async resetSampleData(): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${BASE_URL}/employees/reset-sample-data`, {
      method: 'POST',
    });
    return handleResponse<{ success: boolean; message: string }>(res);
  }
};
