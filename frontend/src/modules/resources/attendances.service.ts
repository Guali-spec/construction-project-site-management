import apiClient from "@/services/api-client";
import { AttendanceItem } from "@/types";

export async function listAttendances(projectId: string, page = 1, limit = 50) {
  const res = await apiClient.get<{ items: AttendanceItem[]; meta: any }>(
    `/projects/${projectId}/attendances?page=${page}&limit=${limit}`
  );
  return res.data;
}

export async function createAttendance(
  projectId: string,
  data: { workerId: string; date: string; present?: boolean; notes?: string }
) {
  const res = await apiClient.post<AttendanceItem>(`/projects/${projectId}/attendances`, data);
  return res.data;
}

export async function updateAttendance(
  projectId: string,
  id: string,
  data: { date?: string; present?: boolean; notes?: string }
) {
  const res = await apiClient.patch<AttendanceItem>(`/projects/${projectId}/attendances/${id}`, data);
  return res.data;
}
