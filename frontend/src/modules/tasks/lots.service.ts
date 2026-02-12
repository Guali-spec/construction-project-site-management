import apiClient from "@/services/api-client";
import { LotItem } from "@/types";

export async function listLots(projectId: string, phaseId: string, page = 1, limit = 50) {
  const res = await apiClient.get<{ items: LotItem[]; meta: any }>(
    `/projects/${projectId}/phases/${phaseId}/lots?page=${page}&limit=${limit}`
  );
  return res.data;
}

export async function createLot(
  projectId: string,
  phaseId: string,
  data: { name: string; description?: string; order: number; startDate?: string; endDate?: string }
) {
  const res = await apiClient.post<LotItem>(`/projects/${projectId}/phases/${phaseId}/lots`, data);
  return res.data;
}
