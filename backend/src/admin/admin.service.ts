import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly roleMatrix: Record<string, string[]> = {
    SUPER_ADMIN: [
      "SUPER_ADMIN",
      "ADMIN_ENTREPRISE",
      "CHEF_PROJET",
      "SUPERVISEUR",
      "COMPTABLE",
      "CONSULTANT",
      "PENDING",
    ],
    ADMIN_ENTREPRISE: ["CHEF_PROJET", "SUPERVISEUR", "COMPTABLE", "CONSULTANT"],
    CHEF_PROJET: ["SUPERVISEUR", "COMPTABLE", "CONSULTANT"],
    SUPERVISEUR: [],
    COMPTABLE: [],
    CONSULTANT: [],
    PENDING: [],
  };

  async createCompany(name: string, slug: string) {
    return this.prisma.company.create({
      data: { name, slug },
    });
  }

  async listCompanies() {
    return this.prisma.company.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async updateCompany(id: string, data: { name?: string; slug?: string; isActive?: boolean }) {
    const existing = await this.prisma.company.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException("Company not found");
    return this.prisma.company.update({
      where: { id },
      data,
    });
  }

  async listCompanyUsers(requester: { companyId?: string; role: string }) {
    if (!requester.companyId) throw new ForbiddenException("Company scope missing");
    return this.prisma.user.findMany({
      where: { companyId: requester.companyId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async listPendingUsers(requester: { companyId?: string; role: string }) {
    if (requester.role === "SUPER_ADMIN") {
      return this.prisma.user.findMany({
        where: { role: "PENDING" },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          requestedRole: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      });
    }

    if (!requester.companyId) throw new ForbiddenException("Company scope missing");

    return this.prisma.user.findMany({
      where: { role: "PENDING", companyId: requester.companyId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        requestedRole: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async assignUserRole(requester: { id: string; role: string; companyId?: string }, targetId: string, role: string) {
    if (requester.id === targetId) {
      throw new ForbiddenException("Requester cannot change own role");
    }

    const allowed = this.roleMatrix[requester.role] ?? [];
    if (!allowed.includes(role)) {
      throw new ForbiddenException("Role assignment not permitted");
    }

    const target = await this.prisma.user.findUnique({
      where: { id: targetId },
      select: { id: true, role: true, companyId: true },
    });
    if (!target) throw new NotFoundException("Target user not found");

    if (requester.role !== "SUPER_ADMIN") {
      if (!requester.companyId) throw new ForbiddenException("Company scope missing");
      if (target.companyId !== requester.companyId) {
        throw new ForbiddenException("Cross-company role assignment denied");
      }
    }

    const updated = await this.prisma.user.update({
      where: { id: targetId },
      data: { role: role as any, requestedRole: null },
    });

    await this.prisma.activityLog.create({
      data: {
        userId: requester.id,
        projectId: null,
        action: "ROLE_CHANGE",
        entityType: "user",
        entityId: targetId,
        details: {
          performed_by_user_id: requester.id,
          target_user_id: targetId,
          old_role: target.role,
          new_role: role,
        },
        ipAddress: null,
      },
    });

    return updated;
  }
}
