import apiClient from "@/services/api-client";
import { Expense } from "@/types";

export async function listExpenses(projectId: string, page = 1, limit = 20) {
  const res = await apiClient.get<{ items: Expense[]; meta: any }>(
    `/projects/${projectId}/expenses?page=${page}&limit=${limit}`
  );
  return res.data;
}

export async function updateExpenseStatus(projectId: string, id: string, status: "APPROVED" | "REJECTED") {
  const res = await apiClient.patch<Expense>(`/projects/${projectId}/expenses/${id}/status`, { status });
  return res.data;
}

export async function createExpense(
  projectId: string,
  data: { amount: number; category: string; description?: string }
) {
  const res = await apiClient.post<Expense>(`/projects/${projectId}/expenses`, data);
  return res.data;
}
