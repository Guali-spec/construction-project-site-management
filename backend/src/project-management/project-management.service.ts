import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectManagementService {
  constructor(private readonly prisma: PrismaService) {}

  // Phases
  async getPhases(projectId: string) {
    return this.prisma.phase.findMany({
      where: { projectId, deletedAt: null },
      include: {
        lots: {
          where: { deletedAt: null },
          include: {
            tasks: {
              where: { deletedAt: null },
              include: {
                assignedWorker: true,
              },
            },
          },
        },
      },
      orderBy: { order: 'asc' },
    });
  }

  async createPhase(projectId: string, createPhaseDto: any) {
    const { name, description, order, startDate, endDate } = createPhaseDto;

    return this.prisma.phase.create({
      data: {
        projectId,
        name,
        description,
        order,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
      },
      include: {
        lots: true,
      },
    });
  }

  async updatePhase(id: string, updatePhaseDto: any) {
    const { name, description, order, startDate, endDate } = updatePhaseDto;

    return this.prisma.phase.update({
      where: { id },
      data: {
        name,
        description,
        order,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
      },
      include: {
        lots: true,
      },
    });
  }

  async deletePhase(id: string) {
    return this.prisma.phase.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  // Lots
  async getLots(phaseId: string) {
    return this.prisma.lot.findMany({
      where: { phaseId, deletedAt: null },
      include: {
        tasks: {
          where: { deletedAt: null },
          include: {
            assignedWorker: true,
          },
        },
      },
      orderBy: { order: 'asc' },
    });
  }

  async createLot(phaseId: string, createLotDto: any) {
    const { name, description, order, startDate, endDate, budget } = createLotDto;

    return this.prisma.lot.create({
      data: {
        phaseId,
        name,
        description,
        order,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
      },
      include: {
        tasks: true,
      },
    });
  }

  async updateLot(id: string, updateLotDto: any) {
    const { name, description, order, startDate, endDate } = updateLotDto;

    return this.prisma.lot.update({
      where: { id },
      data: {
        name,
        description,
        order,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
      },
      include: {
        tasks: true,
      },
    });
  }

  async deleteLot(id: string) {
    return this.prisma.lot.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  // Tasks
  async getTasks(lotId: string) {
    return this.prisma.task.findMany({
      where: { lotId, deletedAt: null },
      include: {
        assignedWorker: true,
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async createTask(lotId: string, createTaskDto: any) {
    const { name, description, priority, estimatedCost, assignedWorkerId, startDate, endDate } = createTaskDto;

    return this.prisma.task.create({
      data: {
        lotId,
        name,
        description,
        priority,
        estimatedCost,
        assignedWorkerId,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
      },
      include: {
        assignedWorker: true,
      },
    });
  }

  async updateTask(id: string, updateTaskDto: any) {
    const { name, description, status, progress, priority, estimatedCost, actualCost, assignedWorkerId, startDate, endDate } = updateTaskDto;

    return this.prisma.task.update({
      where: { id },
      data: {
        name,
        description,
        status,
        progress,
        priority,
        estimatedCost,
        actualCost,
        assignedWorkerId,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
      },
      include: {
        assignedWorker: true,
      },
    });
  }

  async deleteTask(id: string) {
    return this.prisma.task.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  // Budget par poste
  async getProjectBudget(projectId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId, deletedAt: null },
      include: {
        phases: {
          where: { deletedAt: null },
          include: {
            lots: {
              where: { deletedAt: null },
              include: {
                tasks: {
                  where: { deletedAt: null },
                },
              },
            },
          },
        },
      },
    });

    if (!project) {
      throw new Error('Project not found');
    }

    // Calculer le budget par poste
    const budgetByPoste = {
      total: Number(project.budget || 0),
      phases: project.phases.map(phase => ({
        id: phase.id,
        name: phase.name,
        budget: phase.lots.reduce((sum, lot) => sum + Number(lot.tasks.reduce((taskSum, task) => taskSum + Number(task.estimatedCost || 0), 0)), 0),
        lots: phase.lots.map(lot => ({
          id: lot.id,
          name: lot.name,
          budget: Number(lot.tasks.reduce((taskSum, task) => taskSum + Number(task.estimatedCost || 0), 0)),
          tasksCount: lot.tasks.length,
        })),
      })),
    };

    return budgetByPoste;
  }

  async updateProjectBudget(projectId: string, budgetDto: any) {
    const { phases } = budgetDto;

    // Mettre à jour les budgets estimés des tâches
    for (const phase of phases) {
      for (const lot of phase.lots) {
        for (const task of lot.tasks) {
          if (task.id && task.estimatedCost !== undefined) {
            await this.prisma.task.update({
              where: { id: task.id },
              data: { estimatedCost: task.estimatedCost },
            });
          }
        }
      }
    }

    return this.getProjectBudget(projectId);
  }

  // Affectation équipe
  async getProjectTeam(projectId: string) {
    return this.prisma.worker.findMany({
      where: { projectId, deletedAt: null },
      include: {
        tasks: {
          where: { deletedAt: null },
          include: {
            lot: {
              include: {
                phase: true,
              },
            },
          },
        },
      },
    });
  }

  async assignWorkerToProject(projectId: string, assignmentDto: any) {
    const { firstName, lastName, trade, phone, dailyRate } = assignmentDto;

    return this.prisma.worker.create({
      data: {
        projectId,
        firstName,
        lastName,
        trade,
        phone,
        dailyRate,
      },
    });
  }

  async updateWorkerAssignment(id: string, updateDto: any) {
    const { firstName, lastName, trade, phone, dailyRate, projectId } = updateDto;

    return this.prisma.worker.update({
      where: { id },
      data: {
        firstName,
        lastName,
        trade,
        phone,
        dailyRate,
        projectId,
      },
    });
  }

  async removeWorkerFromProject(id: string) {
    return this.prisma.worker.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
