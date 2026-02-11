import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateProgressPhotoDto } from "./dto/create-progress-photo.dto";
import { PaginationDto } from "../common/dto/pagination.dto";

@Injectable()
export class PhotosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(companyId: string, projectId: string, userId: string, dto: CreateProgressPhotoDto) {
    if (dto.taskId) {
      const task = await this.prisma.task.findFirst({
        where: { id: dto.taskId, lot: { phase: { projectId, project: { companyId } } } },
        select: { id: true },
      });
      if (!task) throw new NotFoundException("Task not found");
    }
    return this.prisma.progressPhoto.create({
      data: {
        projectId,
        taskId: dto.taskId,
        url: dto.url,
        caption: dto.caption,
        createdById: userId,
      },
    });
  }

  async findAll(companyId: string, projectId: string, pagination: PaginationDto) {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 20;
    const skip = (page - 1) * limit;

    const where = { projectId, project: { companyId } };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.progressPhoto.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      this.prisma.progressPhoto.count({ where }),
    ]);

    return { items, meta: { page, limit, total } };
  }

  async remove(companyId: string, projectId: string, id: string) {
    const existing = await this.prisma.progressPhoto.findFirst({
      where: { id, projectId, project: { companyId } },
      select: { id: true },
    });
    if (!existing) throw new NotFoundException("Photo not found");
    return this.prisma.progressPhoto.delete({ where: { id } });
  }
}
