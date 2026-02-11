import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { ProjectMemberRole, ProjectStatus } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { PaginationDto } from "../common/dto/pagination.dto";
import { CreateProjectDto } from "./dto/create-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, companyId: string, dto: CreateProjectDto) {
    return this.prisma.project.create({
      data: {
        name: dto.name,
        description: dto.description,
        location: dto.location,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        budget: dto.budget ?? undefined,
        createdById: userId,
        companyId,
        members: {
          create: {
            userId,
            role: ProjectMemberRole.OWNER,
          },
        },
      },
      include: { members: true },
    });
  }

  async findAllForUser(userId: string, companyId: string, pagination: PaginationDto) {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 20;
    const skip = (page - 1) * limit;

    const where = {
      companyId,
      members: { some: { userId, deletedAt: null } },
      deletedAt: null,
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.project.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      this.prisma.project.count({ where }),
    ]);

    return {
      items,
      meta: { page, limit, total },
    };
  }

  async findOneForUser(userId: string, companyId: string, projectId: string) {
    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
        companyId,
        deletedAt: null,
        members: { some: { userId, deletedAt: null } },
      },
      include: { members: { where: { deletedAt: null } } },
    });

    if (!project) throw new NotFoundException("Project not found");
    return project;
  }

  async update(userId: string, companyId: string, projectId: string, dto: UpdateProjectDto) {
    const membership = await this.prisma.projectMember.findFirst({
      where: { projectId, userId, deletedAt: null, project: { companyId } },
    });

    if (!membership) throw new NotFoundException("Project not found");
    const allowedRoles: ProjectMemberRole[] = [ProjectMemberRole.OWNER, ProjectMemberRole.MANAGER];
    if (!allowedRoles.includes(membership.role)) {
      throw new ForbiddenException("Not allowed");
    }

    return this.prisma.project.update({
      where: { id: projectId },
      data: {
        name: dto.name,
        description: dto.description,
        location: dto.location,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        budget: dto.budget ?? undefined,
      },
    });
  }

  async archive(userId: string, companyId: string, projectId: string) {
    const membership = await this.prisma.projectMember.findFirst({
      where: { projectId, userId, deletedAt: null, project: { companyId } },
    });

    if (!membership) throw new NotFoundException("Project not found");
    const allowedRoles: ProjectMemberRole[] = [ProjectMemberRole.OWNER, ProjectMemberRole.MANAGER];
    if (!allowedRoles.includes(membership.role)) {
      throw new ForbiddenException("Not allowed");
    }

    return this.prisma.project.update({
      where: { id: projectId },
      data: { status: ProjectStatus.ARCHIVED },
    });
  }
}
