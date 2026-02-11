import apiClient from "@/services/api-client";
import { TaskItem } from "@/types";

export async function listTasks(projectId: string, lotId: string, page = 1, limit = 50) {
  const res = await apiClient.get<{ items: TaskItem[]; meta: any }>(
    `/projects/${projectId}/lots/${lotId}/tasks?page=${page}&limit=${limit}`
  );
  return res.data;
}

export async function createTask(projectId: string, lotId: string, data: Partial<TaskItem>) {
  const res = await apiClient.post<TaskItem>(`/projects/${projectId}/lots/${lotId}/tasks`, data);
  return res.data;
}

export async function updateTaskStatus(
  projectId: string,
  lotId: string,
  taskId: string,
  payload: { status?: string; progress?: number }
) {
  const res = await apiClient.patch<TaskItem>(
    `/projects/${projectId}/lots/${lotId}/tasks/${taskId}/status`,
    payload
  );
  return res.data;
}
