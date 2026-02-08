import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TrackingService {
  constructor(private readonly prisma: PrismaService) {}

  async getTasks() {
    // Simulation de tâches car la table Task n'est pas encore remplie
    const tasks = [
      {
        id: '1',
        name: 'Installation électrique - Salle principale',
        description: 'Installer tous les circuits électriques de la salle principale',
        projectId: '1',
        projectName: 'Rénovation Centre Commercial',
        lotId: '1',
        lotName: 'Électricité',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        progress: 70,
        startDate: new Date('2024-01-20'),
        endDate: new Date('2024-02-15'),
        assignedWorkerId: '1',
        assignedWorkerName: 'Jean Dupont',
        estimatedCost: 3500,
        actualCost: 2800,
      },
      {
        id: '2',
        name: 'Pose des cloisons',
        description: 'Monter les cloisons en placo',
        projectId: '1',
        projectName: 'Rénovation Centre Commercial',
        lotId: '2',
        lotName: 'Maçonnerie',
        status: 'TODO',
        priority: 'MEDIUM',
        progress: 0,
        startDate: new Date('2024-02-16'),
        endDate: new Date('2024-03-01'),
        assignedWorkerId: '3',
        assignedWorkerName: 'Pierre Durand',
        estimatedCost: 4500,
        actualCost: 0,
      },
      {
        id: '3',
        name: 'Installation plomberie',
        description: 'Installer les tuyaux et robinetteries',
        projectId: '2',
        projectName: 'Construction Entrepôt Logistique',
        lotId: '3',
        lotName: 'Plomberie',
        status: 'DONE',
        priority: 'HIGH',
        progress: 100,
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-02-20'),
        assignedWorkerId: '2',
        assignedWorkerName: 'Marie Martin',
        estimatedCost: 2800,
        actualCost: 3200,
      },
    ];

    return tasks;
  }

  async getTask(id: string) {
    const tasks = await this.getTasks();
    const task = tasks.find(t => t.id === id);
    
    if (!task) {
      throw new Error('Task not found');
    }
    
    return task;
  }

  async createTask(createTaskDto: any) {
    return {
      id: 'new-task-id',
      ...createTaskDto,
      status: 'TODO',
      progress: 0,
      createdAt: new Date(),
    };
  }

  async updateTask(id: string, updateTaskDto: any) {
    return {
      id,
      ...updateTaskDto,
      updatedAt: new Date(),
    };
  }

  async deleteTask(id: string) {
    return { message: 'Task deleted successfully', id };
  }

  async getProgress() {
    const projects = await this.prisma.project.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        name: true,
        status: true,
        startDate: true,
        endDate: true,
        budget: true,
      },
    });

    return projects.map((project, index) => {
      const progress = 65 + (index * 5); // Simulation fixe au lieu de Math.random()
      return {
        id: project.id,
        projectName: project.name,
        overallProgress: progress,
        status: project.status,
        startDate: project.startDate,
        endDate: project.endDate,
        budget: Number(project.budget || 0),
        spentBudget: Math.floor(Number(project.budget || 0) * (progress / 100)),
        tasksCompleted: Math.floor(progress / 5), // Simulation basée sur le progrès
        totalTasks: 20,
      };
    });
  }

  async getDelays() {
    const projects = await this.prisma.project.findMany({
      where: {
        deletedAt: null,
        endDate: {
          lt: new Date(),
        },
        status: 'ACTIVE',
      },
      select: {
        id: true,
        name: true,
        endDate: true,
        budget: true,
      },
    });

    return projects.map(project => {
      const daysLate = project.endDate ? Math.floor((new Date().getTime() - project.endDate.getTime()) / (1000 * 60 * 60 * 24)) : 0;
      return {
        id: project.id,
        projectName: project.name,
        daysLate,
        originalEndDate: project.endDate,
        estimatedNewEndDate: new Date(Date.now() + (daysLate * 24 * 60 * 60 * 1000)),
        budget: Number(project.budget || 0),
        additionalCost: Math.floor(Number(project.budget || 0) * 0.1), // 10% de coût supplémentaire
        reason: 'Retard dû aux conditions météo',
      };
    });
  }

  async getTrackingStats() {
    const [totalProjects, activeProjects, completedProjects] = await Promise.all([
      this.prisma.project.count({ where: { deletedAt: null } }),
      this.prisma.project.count({ where: { deletedAt: null, status: 'ACTIVE' } }),
      this.prisma.project.count({ where: { deletedAt: null, status: 'COMPLETED' } }),
    ]);

    return {
      totalProjects,
      activeProjects,
      completedProjects,
      delayedProjects: 2, // Simulation
      overallProgress: 65, // Simulation
      tasksCompleted: 45, // Simulation
      totalTasks: 70, // Simulation
      averageDelay: 5, // jours
    };
  }
}
