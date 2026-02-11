import apiClient from "@/services/api-client";
import { PhaseItem } from "@/types";

export async function listPhases(projectId: string, page = 1, limit = 50) {
  const res = await apiClient.get<{ items: PhaseItem[]; meta: any }>(
    `/projects/${projectId}/phases?page=${page}&limit=${limit}`
  );
  return res.data;
}
