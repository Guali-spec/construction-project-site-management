import apiClient from "@/services/api-client";

export interface ProjectMemberDto {
  id: string;
  role: string;
  assignedAt?: string;
  user: {
    id: string;
    email: string;
    firstName?: string | null;
    lastName?: string | null;
  };
}

export async function listProjectMembers(projectId: string) {
  const res = await apiClient.get<ProjectMemberDto[]>(`/projects/${projectId}/members`);
  return res.data;
}

export async function addProjectMember(projectId: string, email: string, role: string) {
  const res = await apiClient.post(`/projects/${projectId}/members`, { email, role });
  return res.data;
}

export async function removeProjectMember(projectId: string, userId: string) {
  const res = await apiClient.delete(`/projects/${projectId}/members/${userId}`);
  return res.data;
}
