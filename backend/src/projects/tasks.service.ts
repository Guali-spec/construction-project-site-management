import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { PaginationDto } from "../common/dto/pagination.dto";

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  private async ensureLotInProject(projectId: string, lotId: string) {
    const lot = await this.prisma.lot.findFirst({
      where: { id: lotId, phase: { projectId } },
      select: { id: true },
    });
    if (!lot) throw new NotFoundException("Lot not found");
  }

  private async ensureWorkerInProject(projectId: string, workerId: string) {
    const worker = await this.prisma.worker.findFirst({
      where: { id: workerId, projectId },
      select: { id: true },
    });
    if (!worker) throw new BadRequestException("Worker not found in project");
  }

  async create(projectId: string, lotId: string, dto: CreateTaskDto) {
    await this.ensureLotInProject(projectId, lotId);
    if (dto.assignedWorkerId) {
      await this.ensureWorkerInProject(projectId, dto.assignedWorkerId);
    }

    return this.prisma.task.create({
      data: {
        lotId,
        name: dto.name,
        description: dto.description,
        status: dto.status,
        progress: dto.progress,
        priority: dto.priority,
        estimatedCost: dto.estimatedCost,
        actualCost: dto.actualCost,
        assignedWorkerId: dto.assignedWorkerId,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      },
    });
  }

  async findAll(projectId: string, lotId: string, pagination: PaginationDto) {
    await this.ensureLotInProject(projectId, lotId);
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 20;
    const skip = (page - 1) * limit;

    const where = { lotId };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.task.findMany({
        where,
        orderBy: { createdAt: "asc" },
        skip,
        take: limit,
      }),
      this.prisma.task.count({ where }),
    ]);

    return {
      items,
      meta: { page, limit, total },
    };
  }

  async findOne(projectId: string, lotId: string, taskId: string) {
    await this.ensureLotInProject(projectId, lotId);
    const task = await this.prisma.task.findFirst({
      where: { id: taskId, lotId },
    });
    if (!task) throw new NotFoundException("Task not found");
    return task;
  }

  async update(projectId: string, lotId: string, taskId: string, dto: UpdateTaskDto) {
    await this.findOne(projectId, lotId, taskId);
    if (dto.assignedWorkerId) {
      await this.ensureWorkerInProject(projectId, dto.assignedWorkerId);
    }

    return this.prisma.task.update({
      where: { id: taskId },
      data: {
        name: dto.name,
        description: dto.description,
        status: dto.status,
        progress: dto.progress,
        priority: dto.priority,
        estimatedCost: dto.estimatedCost,
        actualCost: dto.actualCost,
        assignedWorkerId: dto.assignedWorkerId,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      },
    });
  }

  async remove(projectId: string, lotId: string, taskId: string) {
    await this.findOne(projectId, lotId, taskId);
    return this.prisma.task.delete({
      where: { id: taskId },
    });
  }
}
