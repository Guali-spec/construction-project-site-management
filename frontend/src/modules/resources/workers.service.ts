import apiClient from "@/services/api-client";
import { WorkerItem } from "@/types";

export async function listWorkers(projectId: string, page = 1, limit = 50) {
  const res = await apiClient.get<{ items: WorkerItem[]; meta: any }>(
    `/projects/${projectId}/workers?page=${page}&limit=${limit}`
  );
  return res.data;
}

export async function createWorker(
  projectId: string,
  data: { firstName: string; lastName: string; trade?: string; phone?: string; dailyRate?: number }
) {
  const res = await apiClient.post<WorkerItem>(`/projects/${projectId}/workers`, data);
  return res.data;
}
