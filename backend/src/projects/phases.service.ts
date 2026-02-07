import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreatePhaseDto } from "./dto/create-phase.dto";
import { UpdatePhaseDto } from "./dto/update-phase.dto";
import { PaginationDto } from "../common/dto/pagination.dto";

@Injectable()
export class PhasesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(projectId: string, dto: CreatePhaseDto) {
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

  async findAll(projectId: string, pagination: PaginationDto) {
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

  async findOne(projectId: string, phaseId: string) {
    const phase = await this.prisma.phase.findFirst({
      where: { id: phaseId, projectId },
    });
    if (!phase) throw new NotFoundException("Phase not found");
    return phase;
  }

  async update(projectId: string, phaseId: string, dto: UpdatePhaseDto) {
    await this.findOne(projectId, phaseId);
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

  async remove(projectId: string, phaseId: string) {
    await this.findOne(projectId, phaseId);
    const deletedAt = new Date();
    return this.prisma.$transaction([
      this.prisma.task.updateMany({
        where: { lot: { phaseId } },
        data: { deletedAt },
      }),
      this.prisma.lot.updateMany({
        where: { phaseId },
        data: { deletedAt },
      }),
      this.prisma.phase.update({
        where: { id: phaseId },
        data: { deletedAt },
      }),
    ]);
  }
}
