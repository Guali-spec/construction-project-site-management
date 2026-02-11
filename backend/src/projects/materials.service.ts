import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateMaterialDto } from "./dto/create-material.dto";
import { UpdateMaterialDto } from "./dto/update-material.dto";
import { PaginationDto } from "../common/dto/pagination.dto";

@Injectable()
export class MaterialsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(companyId: string, projectId: string, dto: CreateMaterialDto) {
    return this.prisma.material.create({
      data: {
        projectId,
        name: dto.name,
        unit: dto.unit,
        quantity: dto.quantity ?? 0,
        unitCost: dto.unitCost,
        totalCost:
          dto.unitCost != null && dto.quantity != null
            ? Number(dto.unitCost) * Number(dto.quantity)
            : undefined,
      },
    });
  }

  async findAll(companyId: string, projectId: string, pagination: PaginationDto) {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 20;
    const skip = (page - 1) * limit;

    const where = { projectId, project: { companyId } };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.material.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      this.prisma.material.count({ where }),
    ]);

    return { items, meta: { page, limit, total } };
  }

  async update(companyId: string, projectId: string, id: string, dto: UpdateMaterialDto) {
    const existing = await this.prisma.material.findFirst({
      where: { id, projectId, project: { companyId } },
      select: { id: true },
    });
    if (!existing) throw new NotFoundException("Material not found");

    const quantity = dto.quantity;
    const unitCost = dto.unitCost;
    const totalCost =
      unitCost != null && quantity != null ? Number(unitCost) * Number(quantity) : undefined;

    return this.prisma.material.update({
      where: { id },
      data: {
        name: dto.name,
        unit: dto.unit,
        quantity,
        unitCost,
        totalCost,
      },
    });
  }

  async remove(companyId: string, projectId: string, id: string) {
    const existing = await this.prisma.material.findFirst({
      where: { id, projectId, project: { companyId } },
      select: { id: true },
    });
    if (!existing) throw new NotFoundException("Material not found");

    return this.prisma.material.delete({ where: { id } });
  }
}
