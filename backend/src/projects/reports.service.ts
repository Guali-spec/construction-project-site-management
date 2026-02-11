import { Injectable, NotFoundException } from "@nestjs/common";
import { ReportType } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

type ExportFormat = "json" | "csv";

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  private async ensureProject(companyId: string, projectId: string) {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, companyId },
      select: { id: true, name: true, status: true, budget: true, createdAt: true },
    });
    if (!project) throw new NotFoundException("Project not found");
    return project;
  }

  async list(companyId: string, projectId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const where = { projectId, project: { companyId } };
    const [items, total] = await this.prisma.$transaction([
      this.prisma.report.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      this.prisma.report.count({ where }),
    ]);

    return { items, meta: { page, limit, total } };
  }

  async export(
    companyId: string,
    projectId: string,
    userId: string,
    type: ReportType,
    format: ExportFormat,
  ) {
    const project = await this.ensureProject(companyId, projectId);

    const data =
      type === ReportType.PROJECT_SUMMARY
        ? await this.buildProjectSummary(projectId, project)
        : type === ReportType.FINANCIAL
          ? await this.buildFinancial(projectId)
          : type === ReportType.ATTENDANCE
            ? await this.buildAttendance(projectId)
            : await this.buildProgress(projectId);

    await this.prisma.report.create({
      data: {
        projectId,
        type,
        payload: data,
        createdById: userId,
      },
    });

    if (format === "csv") {
      return { format, data: this.toCsv(type, data) };
    }

    return { format, data };
  }

  private async buildProjectSummary(projectId: string, project: any) {
    const [phaseCount, lotCount, taskCount, workerCount, materialCount, expenseCount, expenseSum] =
      await this.prisma.$transaction([
        this.prisma.phase.count({ where: { projectId } }),
        this.prisma.lot.count({ where: { phase: { projectId } } }),
        this.prisma.task.count({ where: { lot: { phase: { projectId } } } }),
        this.prisma.worker.count({ where: { projectId } }),
        this.prisma.material.count({ where: { projectId } }),
        this.prisma.expense.count({ where: { projectId } }),
        this.prisma.expense.aggregate({
          where: { projectId },
          _sum: { amount: true },
        }),
      ]);

    return {
      project,
      counts: {
        phases: phaseCount,
        lots: lotCount,
        tasks: taskCount,
        workers: workerCount,
        materials: materialCount,
        expenses: expenseCount,
      },
      totals: {
        expenses: expenseSum._sum.amount ?? 0,
      },
    };
  }

  private async buildFinancial(projectId: string) {
    const [expenses, summary] = await this.prisma.$transaction([
      this.prisma.expense.findMany({
        where: { projectId },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          amount: true,
          category: true,
          status: true,
          createdAt: true,
        },
      }),
      this.prisma.expense.aggregate({
        where: { projectId },
        _sum: { amount: true },
      }),
    ]);

    return {
      total: summary._sum.amount ?? 0,
      expenses,
    };
  }

  private async buildAttendance(projectId: string) {
    const attendances = await this.prisma.attendance.findMany({
      where: { projectId },
      orderBy: { date: "desc" },
      select: {
        id: true,
        date: true,
        present: true,
        notes: true,
        worker: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    return { attendances };
  }

  private async buildProgress(projectId: string) {
    const tasks = await this.prisma.task.findMany({
      where: { lot: { phase: { projectId } } },
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, status: true, progress: true },
    });

    return { tasks };
  }

  private toCsv(type: ReportType, data: any) {
    if (type === ReportType.PROJECT_SUMMARY) {
      const lines = [
        "key,value",
        `project_name,${this.escapeCsv(data.project?.name ?? "")}`,
        `project_status,${this.escapeCsv(data.project?.status ?? "")}`,
        `budget,${data.project?.budget ?? ""}`,
        `phases,${data.counts?.phases ?? 0}`,
        `lots,${data.counts?.lots ?? 0}`,
        `tasks,${data.counts?.tasks ?? 0}`,
        `workers,${data.counts?.workers ?? 0}`,
        `materials,${data.counts?.materials ?? 0}`,
        `expenses_count,${data.counts?.expenses ?? 0}`,
        `expenses_total,${data.totals?.expenses ?? 0}`,
      ];
      return lines.join("\n");
    }

    if (type === ReportType.FINANCIAL) {
      const header = "id,amount,category,status,createdAt";
      const rows = (data.expenses ?? []).map((e: any) =>
        [
          e.id,
          e.amount,
          this.escapeCsv(e.category),
          e.status,
          new Date(e.createdAt).toISOString(),
        ].join(","),
      );
      return [header, ...rows].join("\n");
    }

    if (type === ReportType.ATTENDANCE) {
      const header = "id,date,present,workerId,workerName,notes";
      const rows = (data.attendances ?? []).map((a: any) =>
        [
          a.id,
          new Date(a.date).toISOString(),
          a.present,
          a.worker?.id ?? "",
          this.escapeCsv(`${a.worker?.firstName ?? ""} ${a.worker?.lastName ?? ""}`.trim()),
          this.escapeCsv(a.notes ?? ""),
        ].join(","),
      );
      return [header, ...rows].join("\n");
    }

    const header = "id,name,status,progress";
    const rows = (data.tasks ?? []).map((t: any) =>
      [t.id, this.escapeCsv(t.name ?? ""), t.status, t.progress ?? 0].join(","),
    );
    return [header, ...rows].join("\n");
  }

  private escapeCsv(value: string) {
    if (value.includes(",") || value.includes('"') || value.includes("\n")) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }
}
