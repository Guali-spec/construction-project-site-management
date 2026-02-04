import apiClient from '@/services/api-client';
import { Project, ApiResponse } from '@/types';

/** Chantiers : mock pour démo. Remplacer par API backend (GET/POST/PUT /projects) lors de l’intégration. */
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
    // Pour la démo, données mockées
    const mockProjects: Project[] = [
      {
        id: 1,
        name: 'Complexe Résidentiel Alpha',
        description: 'Construction de 50 logements sociaux',
        location: 'Ouagadougou, secteur 15',
        startDate: '2024-03-01',
        endDate: '2024-12-15',
        status: 'active',
        budget: 1250000,
        createdAt: '2024-02-15',
      },
      {
        id: 2,
        name: 'Centre Commercial Beta',
        description: 'Centre commercial avec 25 boutiques',
        location: 'Bobo-Dioulasso, Dafra',
        startDate: '2024-04-10',
        endDate: '2024-11-30',
        status: 'active',
        budget: 850000,
        createdAt: '2024-03-20',
      },
      {
        id: 3,
        name: 'École Primaire Gamma',
        description: 'École de 6 classes avec équipement',
        location: 'Koudougou, centre-ville',
        startDate: '2024-02-01',
        endDate: '2024-06-30',
        status: 'completed',
        budget: 320000,
        createdAt: '2024-01-10',
      },
      {
        id: 4,
        name: 'Route Rurale Delta',
        description: 'Réhabilitation de 15km de route',
        location: 'Fada N\'Gourma',
        startDate: '2024-05-15',
        endDate: '2024-10-30',
        status: 'planned',
        budget: 750000,
        createdAt: '2024-04-05',
      },
    ];

    // Simuler délai API
    await new Promise(resolve => setTimeout(resolve, 800));
    return mockProjects;
    
    // En production :
    // const response = await apiClient.get<ApiResponse<Project[]>>('/projects');
    // return response.data.data;
  }

  async getProjectById(id: number): Promise<Project> {
    const projects = await this.getAllProjects();
    const project = projects.find(p => p.id === id);
    
    if (!project) {
      throw new Error(`Projet ${id} non trouvé`);
    }
    
    return project;
  }

  async createProject(data: CreateProjectData): Promise<Project> {
    // Simulation création
    const newProject: Project = {
      id: Date.now(),
      ...data,
      status: 'planned',
      createdAt: new Date().toISOString().split('T')[0],
    };

    await new Promise(resolve => setTimeout(resolve, 1000));
    return newProject;
  }

  async updateProject(id: number, data: Partial<CreateProjectData>): Promise<Project> {
    // Simulation mise à jour
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const projects = await this.getAllProjects();
    const project = projects.find(p => p.id === id);
    
    if (!project) {
      throw new Error(`Projet ${id} non trouvé`);
    }
    
    return { ...project, ...data };
  }
}

export const projectsService = new ProjectsService();