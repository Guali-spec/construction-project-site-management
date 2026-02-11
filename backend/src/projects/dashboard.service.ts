import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getProjectDashboard(companyId: string, projectId: string) {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, companyId },
      select: { id: true, name: true, status: true, budget: true },
    });
    if (!project) throw new NotFoundException("Project not found");

    const [tasksTotal, tasksDone, workersTotal, materialsTotal, expensesTotal] =
      await this.prisma.$transaction([
        this.prisma.task.count({ where: { lot: { phase: { projectId } } } }),
        this.prisma.task.count({ where: { lot: { phase: { projectId } }, status: "DONE" } }),
        this.prisma.worker.count({ where: { projectId } }),
        this.prisma.material.count({ where: { projectId } }),
        this.prisma.expense.aggregate({
          where: { projectId },
          _sum: { amount: true },
        }),
      ]);

    return {
      project,
      tasks: {
        total: tasksTotal,
        done: tasksDone,
      },
      workers: { total: workersTotal },
      materials: { total: materialsTotal },
      expenses: { total: expensesTotal._sum.amount ?? 0 },
    };
  }
}
