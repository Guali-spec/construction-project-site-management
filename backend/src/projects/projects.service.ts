import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateProjectDto } from "./dto/create-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateProjectDto) {
    return this.prisma.project.create({
      data: {
        name: dto.name,
        description: dto.description,
        location: dto.location,
        createdById: userId,
        members: {
          create: {
            userId,
            role: "OWNER",
          },
        },
      },
      include: { members: true },
    });
  }

  async findAllForUser(userId: string) {
    return this.prisma.project.findMany({
      where: { members: { some: { userId } } },
      orderBy: { createdAt: "desc" },
    });
  }

  async findOneForUser(userId: string, projectId: string) {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, members: { some: { userId } } },
      include: { members: true },
    });

    if (!project) throw new NotFoundException("Project not found");
    return project;
  }

  async update(userId: string, projectId: string, dto: UpdateProjectDto) {
    const membership = await this.prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId } },
    });

    if (!membership) throw new NotFoundException("Project not found");
    if (!["OWNER", "MANAGER"].includes(membership.role)) {
      throw new ForbiddenException("Not allowed");
    }

    return this.prisma.project.update({
      where: { id: projectId },
      data: {
        name: dto.name,
        description: dto.description,
        location: dto.location,
      },
    });
  }

  async archive(userId: string, projectId: string) {
    const membership = await this.prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId } },
    });

    if (!membership) throw new NotFoundException("Project not found");
    if (!["OWNER", "MANAGER"].includes(membership.role)) {
      throw new ForbiddenException("Not allowed");
    }

    return this.prisma.project.update({
      where: { id: projectId },
      data: { status: "ARCHIVED" },
    });
  }
}
