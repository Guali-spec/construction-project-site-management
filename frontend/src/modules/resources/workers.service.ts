import apiClient from "@/services/api-client";
import { WorkerItem } from "@/types";

export async function listWorkers(projectId: string, page = 1, limit = 50) {
  const res = await apiClient.get<{ items: WorkerItem[]; meta: any }>(
    `/projects/${projectId}/workers?page=${page}&limit=${limit}`
  );
  return res.data;
}
