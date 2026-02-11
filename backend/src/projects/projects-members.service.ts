import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { ProjectMemberRole } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

type MemberRole = ProjectMemberRole;

@Injectable()
export class ProjectsMembersService {
  constructor(private readonly prisma: PrismaService) {}

  private async countOwners(projectId: string, companyId: string): Promise<number> {
    return this.prisma.projectMember.count({
      where: { projectId, role: "OWNER", deletedAt: null, project: { companyId } },
    });
  }

  private async getActorRole(userId: string, companyId: string, projectId: string): Promise<MemberRole> {
    const m = await this.prisma.projectMember.findFirst({
      where: { projectId, userId, deletedAt: null, project: { companyId } },
      select: { role: true },
    });
    if (!m) throw new NotFoundException("Project not found");
    return m.role as MemberRole;
  }

  async addMember(
    actorId: string,
    companyId: string,
    projectId: string,
    email: string,
    role: MemberRole,
  ) {
    const actorRole = await this.getActorRole(actorId, companyId, projectId);

    if (role === "OWNER") {
      throw new ForbiddenException("Cannot add member as OWNER");
    }

    // Règles : MANAGER ne peut pas ajouter MANAGER
    if (actorRole === "MANAGER" && role === "MANAGER") {
      throw new ForbiddenException("Managers cannot add other managers");
    }

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException("User not found");
    if (user.companyId !== companyId) throw new BadRequestException("User not in same company");

    // Eviter doublon
    const existing = await this.prisma.projectMember.findFirst({
      where: { projectId, userId: user.id, deletedAt: null, project: { companyId } },
    });
    if (existing) throw new BadRequestException("User already member");

    const softDeleted = await this.prisma.projectMember.findFirst({
      where: { projectId, userId: user.id, deletedAt: { not: null }, project: { companyId } },
      orderBy: { deletedAt: "desc" },
    });

    if (softDeleted) {
      return this.prisma.projectMember.update({
        where: { id: softDeleted.id },
        data: { role, deletedAt: null, assignedAt: new Date() },
      });
    }

    return this.prisma.projectMember.create({
      data: { projectId, userId: user.id, role },
    });
  }

  async changeRole(
    actorId: string,
    companyId: string,
    projectId: string,
    targetUserId: string,
    role: MemberRole,
  ) {
    const actorRole = await this.getActorRole(actorId, companyId, projectId);

    if (role === "OWNER") {
      throw new ForbiddenException("Cannot set role to OWNER");
    }

    const target = await this.prisma.projectMember.findFirst({
      where: { projectId, userId: targetUserId, deletedAt: null, project: { companyId } },
      select: { role: true },
    });
    if (!target) throw new NotFoundException("Member not found");

    if (target.role === "OWNER") {
      if (actorRole !== "OWNER") {
        throw new ForbiddenException("Only OWNER can change another OWNER");
      }
      const ownersCount = await this.countOwners(projectId, companyId);
      if (ownersCount <= 1) {
        throw new ForbiddenException("Cannot demote the last OWNER");
      }
    }

    // MANAGER ne peut pas promouvoir quelqu’un en MANAGER
    if (actorRole === "MANAGER" && role === "MANAGER") {
      throw new ForbiddenException("Managers cannot promote to MANAGER");
    }

    const member = await this.prisma.projectMember.findFirst({
      where: { projectId, userId: targetUserId, deletedAt: null, project: { companyId } },
      select: { id: true },
    });
    if (!member) throw new NotFoundException("Member not found");

    return this.prisma.projectMember.update({
      where: { id: member.id },
      data: { role },
    });
  }

  async removeMember(actorId: string, companyId: string, projectId: string, targetUserId: string) {
    // seul OWNER a accès à cette route (guard), mais on renforce ici aussi
    const actorRole = await this.getActorRole(actorId, companyId, projectId);
    if (actorRole !== "OWNER") throw new ForbiddenException("Not allowed");

    const target = await this.prisma.projectMember.findFirst({
      where: { projectId, userId: targetUserId, deletedAt: null, project: { companyId } },
      select: { role: true, userId: true },
    });
    if (!target) throw new NotFoundException("Member not found");

    if (target.role === "OWNER") {
      const ownersCount = await this.countOwners(projectId, companyId);
      if (ownersCount <= 1) {
        throw new ForbiddenException("Cannot remove the last OWNER");
      }
    }
    if (target.userId === actorId) throw new ForbiddenException("Owner cannot remove himself");

    const member = await this.prisma.projectMember.findFirst({
      where: { projectId, userId: targetUserId, deletedAt: null, project: { companyId } },
      select: { id: true },
    });
    if (!member) throw new NotFoundException("Member not found");

    return this.prisma.projectMember.delete({
      where: { id: member.id },
    });
  }
}
