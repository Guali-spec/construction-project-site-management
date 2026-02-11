import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreatePhaseDto } from "./dto/create-phase.dto";
import { UpdatePhaseDto } from "./dto/update-phase.dto";
import { PaginationDto } from "../common/dto/pagination.dto";

@Injectable()
export class PhasesService {
  constructor(private readonly prisma: PrismaService) {}

  private async ensureProjectInCompany(companyId: string, projectId: string) {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, companyId, deletedAt: null },
      select: { id: true },
    });
    if (!project) throw new NotFoundException("Project not found");
  }

  async create(companyId: string, projectId: string, dto: CreatePhaseDto) {
    await this.ensureProjectInCompany(companyId, projectId);
    return this.prisma.phase.create({
      data: {
        projectId,
        name: dto.name,
        description: dto.description,
        order: dto.order,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
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
      this.prisma.phase.findMany({
        where,
        orderBy: { order: "asc" },
        skip,
        take: limit,
      }),
      this.prisma.phase.count({ where }),
    ]);

    return {
      items,
      meta: { page, limit, total },
    };
  }

  async findOne(companyId: string, projectId: string, phaseId: string) {
    const phase = await this.prisma.phase.findFirst({
      where: { id: phaseId, projectId, project: { companyId } },
    });
    if (!phase) throw new NotFoundException("Phase not found");
    return phase;
  }

  async update(companyId: string, projectId: string, phaseId: string, dto: UpdatePhaseDto) {
    await this.findOne(companyId, projectId, phaseId);
    return this.prisma.phase.update({
      where: { id: phaseId },
      data: {
        name: dto.name,
        description: dto.description,
        order: dto.order,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      },
    });
  }

  async remove(companyId: string, projectId: string, phaseId: string) {
    await this.findOne(companyId, projectId, phaseId);
    const deletedAt = new Date();
    return this.prisma.$transaction([
      this.prisma.task.updateMany({
        where: { lot: { phaseId, phase: { project: { companyId } } } },
        data: { deletedAt },
      }),
      this.prisma.lot.updateMany({
        where: { phaseId, phase: { project: { companyId } } },
        data: { deletedAt },
      }),
      this.prisma.phase.update({
        where: { id: phaseId },
        data: { deletedAt },
      }),
    ]);
  }
}
