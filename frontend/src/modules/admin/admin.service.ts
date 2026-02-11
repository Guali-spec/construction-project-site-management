import apiClient from "@/services/api-client";

export type Company = {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  createdAt?: string;
};

export type AdminUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role?: string;
  requestedRole?: string | null;
  isActive?: boolean;
  createdAt?: string;
};

class AdminService {
  async listCompanies(): Promise<Company[]> {
    const res = await apiClient.get<Company[]>("/admin/companies");
    return res.data || [];
  }

  async createCompany(name: string, slug: string): Promise<Company> {
    const res = await apiClient.post<Company>("/admin/companies", { name, slug });
    return res.data;
  }

  async updateCompany(id: string, data: Partial<Pick<Company, "name" | "slug" | "isActive">>): Promise<Company> {
    const res = await apiClient.patch<Company>(`/admin/companies/${id}`, data);
    return res.data;
  }

  async listCompanyUsers(): Promise<AdminUser[]> {
    const res = await apiClient.get<AdminUser[]>("/company/users");
    return res.data || [];
  }

  async listPendingUsers(): Promise<AdminUser[]> {
    const res = await apiClient.get<any>("/admin/users/pending");
    const data = res.data;
    if (Array.isArray(data)) return data;
    if (data?.items && Array.isArray(data.items)) return data.items;
    if (data?.id) return [data];
    return [];
  }

  async assignUserRole(id: string, role: string): Promise<AdminUser> {
    const res = await apiClient.patch<AdminUser>(`/admin/users/${id}/role`, { role });
    return res.data;
  }
}

export const adminService = new AdminService();
