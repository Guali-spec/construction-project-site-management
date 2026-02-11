import apiClient from "@/services/api-client";
import { Project, ApiPaginatedResponse } from "@/types";

export interface CreateProjectData {
  name: string;
  description?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  budget?: number;
}

class ProjectsService {
  async getAllProjects(): Promise<Project[]> {
    const response = await apiClient.get<ApiPaginatedResponse<Project[]>>("/projects");
    return response.data.items;
  }

  async getProjectById(id: string): Promise<Project> {
    const response = await apiClient.get<Project>(`/projects/${id}`);
    return response.data;
  }

  async createProject(data: CreateProjectData): Promise<Project> {
    const response = await apiClient.post<Project>("/projects", data);
    return response.data;
  }

  async updateProject(id: string, data: Partial<CreateProjectData>): Promise<Project> {
    const response = await apiClient.patch<Project>(`/projects/${id}`, data);
    return response.data;
  }
}

export const projectsService = new ProjectsService();
