import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateLotDto } from "./dto/create-lot.dto";
import { UpdateLotDto } from "./dto/update-lot.dto";
import { PaginationDto } from "../common/dto/pagination.dto";

@Injectable()
export class LotsService {
  constructor(private readonly prisma: PrismaService) {}

  private async ensurePhaseInProject(projectId: string, phaseId: string) {
    const phase = await this.prisma.phase.findFirst({
      where: { id: phaseId, projectId },
      select: { id: true },
    });
    if (!phase) throw new NotFoundException("Phase not found");
  }

  async create(projectId: string, phaseId: string, dto: CreateLotDto) {
    await this.ensurePhaseInProject(projectId, phaseId);
    return this.prisma.lot.create({
      data: {
        phaseId,
        name: dto.name,
        description: dto.description,
        order: dto.order,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      },
    });
  }

  async findAll(projectId: string, phaseId: string, pagination: PaginationDto) {
    await this.ensurePhaseInProject(projectId, phaseId);
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 20;
    const skip = (page - 1) * limit;

    const where = { phaseId };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.lot.findMany({
        where,
        orderBy: { order: "asc" },
        skip,
        take: limit,
      }),
      this.prisma.lot.count({ where }),
    ]);

    return {
      items,
      meta: { page, limit, total },
    };
  }

  async findOne(projectId: string, phaseId: string, lotId: string) {
    await this.ensurePhaseInProject(projectId, phaseId);
    const lot = await this.prisma.lot.findFirst({
      where: { id: lotId, phaseId },
    });
    if (!lot) throw new NotFoundException("Lot not found");
    return lot;
  }

  async update(projectId: string, phaseId: string, lotId: string, dto: UpdateLotDto) {
    await this.findOne(projectId, phaseId, lotId);
    return this.prisma.lot.update({
      where: { id: lotId },
      data: {
        name: dto.name,
        description: dto.description,
        order: dto.order,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      },
    });
  }

  async remove(projectId: string, phaseId: string, lotId: string) {
    await this.findOne(projectId, phaseId, lotId);
    const deletedAt = new Date();
    return this.prisma.$transaction([
      this.prisma.task.updateMany({
        where: { lotId },
        data: { deletedAt },
      }),
      this.prisma.lot.update({
        where: { id: lotId },
        data: { deletedAt },
      }),
    ]);
  }
}
