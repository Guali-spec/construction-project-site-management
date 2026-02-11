import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateWorkerDto } from "./dto/create-worker.dto";
import { UpdateWorkerDto } from "./dto/update-worker.dto";
import { PaginationDto } from "../common/dto/pagination.dto";

@Injectable()
export class WorkersService {
  constructor(private readonly prisma: PrismaService) {}

  private async ensureProjectInCompany(companyId: string, projectId: string) {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, companyId, deletedAt: null },
      select: { id: true },
    });
    if (!project) throw new NotFoundException("Project not found");
  }

  async create(companyId: string, projectId: string, dto: CreateWorkerDto) {
    await this.ensureProjectInCompany(companyId, projectId);
    return this.prisma.worker.create({
      data: {
        projectId,
        firstName: dto.firstName,
        lastName: dto.lastName,
        trade: dto.trade,
        phone: dto.phone,
        dailyRate: dto.dailyRate,
      },
    });
  }

  async findAll(companyId: string, projectId: string, pagination: PaginationDto) {
    await this.ensureProjectInCompany(companyId, projectId);
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 20;
    const skip = (page - 1) * limit;

    const where = { projectId };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.worker.findMany({
        where,
        orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
        skip,
        take: limit,
      }),
      this.prisma.worker.count({ where }),
    ]);

    return {
      items,
      meta: { page, limit, total },
    };
  }

  async findOne(companyId: string, projectId: string, workerId: string) {
    const worker = await this.prisma.worker.findFirst({
      where: { id: workerId, projectId, project: { companyId } },
    });
    if (!worker) throw new NotFoundException("Worker not found");
    return worker;
  }

  async update(companyId: string, projectId: string, workerId: string, dto: UpdateWorkerDto) {
    await this.findOne(companyId, projectId, workerId);
    return this.prisma.worker.update({
      where: { id: workerId },
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        trade: dto.trade,
        phone: dto.phone,
        dailyRate: dto.dailyRate,
      },
    });
  }

  async remove(companyId: string, projectId: string, workerId: string) {
    await this.findOne(companyId, projectId, workerId);
    const deletedAt = new Date();
    return this.prisma.$transaction([
      this.prisma.task.updateMany({
        where: { assignedWorkerId: workerId },
        data: { assignedWorkerId: null },
      }),
      this.prisma.worker.update({
        where: { id: workerId },
        data: { deletedAt },
      }),
    ]);
  }
}
