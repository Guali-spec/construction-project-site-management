import apiClient from "@/services/api-client";
import { PhotoItem } from "@/types";

export async function listPhotos(projectId: string, page = 1, limit = 50) {
  const res = await apiClient.get<{ items: PhotoItem[]; meta: any }>(
    `/projects/${projectId}/photos?page=${page}&limit=${limit}`
  );
  return res.data;
}

export async function createPhoto(projectId: string, data: { url: string; caption?: string; taskId?: string }) {
  const res = await apiClient.post<PhotoItem>(`/projects/${projectId}/photos`, data);
  return res.data;
}

export async function uploadPhoto(
  projectId: string,
  file: File,
  data?: { caption?: string; taskId?: string }
) {
  const form = new FormData();
  form.append("file", file);
  if (data?.caption) form.append("caption", data.caption);
  if (data?.taskId) form.append("taskId", data.taskId);

  const res = await apiClient.post<PhotoItem>(`/projects/${projectId}/photos/upload`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function deletePhoto(projectId: string, id: string) {
  const res = await apiClient.delete<PhotoItem>(`/projects/${projectId}/photos/${id}`);
  return res.data;
}
