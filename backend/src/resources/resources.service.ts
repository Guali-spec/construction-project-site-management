import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ResourcesService {
  constructor(private readonly prisma: PrismaService) {}

  async getWorkers() {
    const workers = await this.prisma.worker.findMany({
      where: { deletedAt: null },
      include: {
        project: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    });

    return workers.map(worker => ({
      id: worker.id,
      firstName: worker.firstName,
      lastName: worker.lastName,
      trade: worker.trade,
      phone: worker.phone,
      dailyRate: worker.dailyRate,
      projectId: worker.projectId,
      projectName: worker.project?.name || null,
      certifications: ['Certification 1', 'Certification 2'], // À améliorer avec de vraies données
      status: 'ACTIVE', // À calculer selon les disponibilités
      createdAt: worker.createdAt,
    }));
  }

  async getWorker(id: string) {
    const worker = await this.prisma.worker.findUnique({
      where: { id, deletedAt: null },
      include: {
        project: true,
        tasks: {
          where: { deletedAt: null },
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
      },
    });

    if (!worker) {
      throw new Error('Worker not found');
    }

    return {
      id: worker.id,
      firstName: worker.firstName,
      lastName: worker.lastName,
      trade: worker.trade,
      phone: worker.phone,
      dailyRate: worker.dailyRate,
      project: worker.project,
      tasks: worker.tasks,
      certifications: ['Certification 1', 'Certification 2'],
      status: 'ACTIVE',
      createdAt: worker.createdAt,
    };
  }

  async createWorker(createWorkerDto: any) {
    const { projectId, ...workerData } = createWorkerDto;

    return this.prisma.worker.create({
      data: {
        ...workerData,
        projectId: projectId || null,
      },
      include: {
        project: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    });
  }

  async updateWorker(id: string, updateWorkerDto: any) {
    const { projectId, ...workerData } = updateWorkerDto;

    return this.prisma.worker.update({
      where: { id },
      data: {
        ...workerData,
        projectId: projectId !== undefined ? projectId : undefined,
      },
      include: {
        project: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    });
  }

  async deleteWorker(id: string) {
    return this.prisma.worker.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async getResourcesStats() {
    const [totalWorkers, activeWorkers, totalProjects, averageDailyRate] = await Promise.all([
      this.prisma.worker.count({ where: { deletedAt: null } }),
      this.prisma.worker.count({ where: { deletedAt: null, projectId: { not: undefined } } }),
      this.prisma.project.count({ where: { deletedAt: null } }),
      this.prisma.worker.aggregate({
        where: { deletedAt: null },
        _avg: { dailyRate: true },
      }),
    ]);

    return {
      totalWorkers,
      activeWorkers,
      availableWorkers: totalWorkers - activeWorkers,
      totalProjects,
      averageDailyRate: Number(averageDailyRate._avg.dailyRate || 0),
    };
  }
}
