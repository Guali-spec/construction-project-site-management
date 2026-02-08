import apiClient from '@/services/api-client';
import { Project, ApiResponse } from '@/types';

/** Service de gestion des chantiers connecté au backend */
export interface CreateProjectData {
  name: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  budget: number;
}

class ProjectsService {
  async getAllProjects(): Promise<Project[]> {
    try {
      const response = await apiClient.get('/projects');
      // Le backend retourne { items: Project[], meta: { page, limit, total } }
      const data = response.data;
      if (data.items && Array.isArray(data.items)) {
        return data.items;
      }
      // Fallback pour d'autres formats
      return Array.isArray(data) ? data : (data.data || []);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la récupération des projets';
      throw new Error(errorMessage);
    }
  }

  async getProjectById(id: number): Promise<Project> {
    try {
      const response = await apiClient.get(`/projects/${id}`);
      // Le backend retourne directement l'objet projet
      const project = response.data;
      
      if (!project) {
        throw new Error(`Projet ${id} non trouvé`);
      }
      
      return project;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || `Erreur lors de la récupération du projet ${id}`;
      throw new Error(errorMessage);
    }
  }

  async createProject(data: CreateProjectData): Promise<Project> {
    try {
      const response = await apiClient.post('/projects', data);
      // Le backend retourne directement l'objet projet créé
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la création du projet';
      throw new Error(errorMessage);
    }
  }

  async updateProject(id: number, data: Partial<CreateProjectData>): Promise<Project> {
    try {
      // Le backend utilise PATCH, pas PUT
      const response = await apiClient.patch(`/projects/${id}`, data);
      // Le backend retourne directement l'objet projet mis à jour
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || `Erreur lors de la mise à jour du projet ${id}`;
      throw new Error(errorMessage);
    }
  }

  async deleteProject(id: number): Promise<void> {
    try {
      await apiClient.delete(`/projects/${id}`);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || `Erreur lors de la suppression du projet ${id}`;
      throw new Error(errorMessage);
    }
  }
}

export const projectsService = new ProjectsService();