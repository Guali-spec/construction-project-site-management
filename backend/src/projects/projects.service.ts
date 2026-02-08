import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { ProjectMemberRole, ProjectStatus } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { PaginationDto } from "../common/dto/pagination.dto";
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
            role: ProjectMemberRole.OWNER,
          },
        },
      },
      include: { members: true },
    });
  }

  async findAllForUser(userId: string, pagination: PaginationDto) {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 20;
    const skip = (page - 1) * limit;

    const where = { members: { some: { userId, deletedAt: null } }, deletedAt: null };

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

  async findOneForUser(userId: string, projectId: string) {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, deletedAt: null, members: { some: { userId, deletedAt: null } } },
      include: { members: { where: { deletedAt: null } } },
    });

    if (!project) throw new NotFoundException("Project not found");
    return project;
  }

  async update(userId: string, projectId: string, dto: UpdateProjectDto) {
    const membership = await this.prisma.projectMember.findFirst({
      where: { projectId, userId, deletedAt: null },
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
      },
    });
  }

  async archive(userId: string, projectId: string) {
    const membership = await this.prisma.projectMember.findFirst({
      where: { projectId, userId, deletedAt: null },
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

  async getProjectPhases(projectId: string) {
    // Simulation - à implémenter avec vraie DB
    return [
      {
        id: '1',
        name: 'Phase 1 - Préparation',
        description: 'Préparation du terrain et fondations',
        order: 1,
        status: 'COMPLETED',
        progress: 100,
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-01-30'),
      },
      {
        id: '2',
        name: 'Phase 2 - Structure',
        description: 'Construction de la structure principale',
        order: 2,
        status: 'IN_PROGRESS',
        progress: 65,
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-03-15'),
      },
      {
        id: '3',
        name: 'Phase 3 - Finitions',
        description: 'Travaux de finition et aménagement',
        order: 3,
        status: 'PLANNED',
        progress: 0,
        startDate: new Date('2024-03-16'),
        endDate: new Date('2024-04-30'),
      },
    ];
  }

  async getProjectLots(projectId: string) {
    // Simulation - à implémenter avec vraie DB
    return [
      {
        id: '1',
        name: 'Lot 1 - Gros œuvre',
        description: 'Fondations et structure',
        order: 1,
        status: 'COMPLETED',
        progress: 100,
        budget: 50000,
        actualCost: 48000,
      },
      {
        id: '2',
        name: 'Lot 2 - Second œuvre',
        description: 'Cloisons, plomberie, électricité',
        order: 2,
        status: 'IN_PROGRESS',
        progress: 45,
        budget: 35000,
        actualCost: 32000,
      },
      {
        id: '3',
        name: 'Lot 3 - Finitions',
        description: 'Revêtements et aménagements',
        order: 3,
        status: 'PLANNED',
        progress: 0,
        budget: 25000,
        actualCost: 0,
      },
    ];
  }

  async getProjectTasks(projectId: string) {
    // Simulation - à implémenter avec vraie DB
    return [
      {
        id: '1',
        name: 'Installation électrique',
        description: 'Installer les circuits électriques',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        progress: 70,
        assignedWorkerId: '1',
        assignedWorkerName: 'Jean Dupont',
        estimatedCost: 3500,
        actualCost: 2800,
      },
      {
        id: '2',
        name: 'Pose des cloisons',
        description: 'Monter les cloisons en placo',
        status: 'TODO',
        priority: 'MEDIUM',
        progress: 0,
        assignedWorkerId: '3',
        assignedWorkerName: 'Pierre Durand',
        estimatedCost: 4500,
        actualCost: 0,
      },
    ];
  }

  async getProjectWorkers(projectId: string) {
    // Simulation - à implémenter avec vraie DB
    return [
      {
        id: '1',
        firstName: 'Jean',
        lastName: 'Dupont',
        trade: 'Électricien',
        phone: '06 12 34 56 78',
        dailyRate: 250,
        role: 'ÉLECTRICIEN',
        status: 'ACTIVE',
        certifications: ['Habilitation Électrique', 'BTP'],
      },
      {
        id: '3',
        firstName: 'Pierre',
        lastName: 'Durand',
        trade: 'Maçon',
        phone: '06 45 67 89 01',
        dailyRate: 200,
        role: 'MAÇON',
        status: 'ACTIVE',
        certifications: ['CAP Maçonnerie', 'Sécurité chantier'],
      },
    ];
  }

  async getProjectStats(projectId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId, deletedAt: null },
      select: {
        id: true,
        name: true,
        budget: true,
        status: true,
        startDate: true,
        endDate: true,
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return {
      id: project.id,
      projectName: project.name,
      totalBudget: Number(project.budget || 0),
      spentBudget: Math.floor(Number(project.budget || 0) * 0.65), // Simulation
      remainingBudget: Math.floor(Number(project.budget || 0) * 0.35),
      progress: 65, // Simulation
      status: project.status,
      startDate: project.startDate,
      endDate: project.endDate,
      totalTasks: 20,
      completedTasks: 13,
      totalWorkers: 8,
      activeWorkers: 6,
      phasesCompleted: 1,
      totalPhases: 3,
    };
  }

  async getAllProjectsStats() {
    const [totalProjects, activeProjects, completedProjects, budgetData] = await Promise.all([
      this.prisma.project.count({ where: { deletedAt: null } }),
      this.prisma.project.count({ where: { deletedAt: null, status: 'ACTIVE' } }),
      this.prisma.project.count({ where: { deletedAt: null, status: 'COMPLETED' } }),
      this.prisma.project.aggregate({
        where: { deletedAt: null },
        _sum: { budget: true },
      }),
    ]);

    return {
      totalProjects,
      activeProjects,
      completedProjects,
      plannedProjects: totalProjects - activeProjects - completedProjects,
      totalBudget: Number(budgetData._sum.budget || 0),
      averageBudget: totalProjects > 0 ? Math.floor(Number(budgetData._sum.budget || 0) / totalProjects) : 0,
      delayedProjects: 2, // Simulation
      overallProgress: 65, // Simulation
    };
  }
}
