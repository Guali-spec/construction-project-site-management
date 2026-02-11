import { BadRequestException, CanActivate, ExecutionContext, Injectable, NotFoundException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ProjectMemberRole } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { PROJECT_ROLES_KEY } from "../decorators/project-roles.decorator";

@Injectable()
export class ProjectRoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<ProjectMemberRole[]>(
      PROJECT_ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Si aucune règle projet demandée, on laisse passer
    if (!requiredRoles) return true;

    const req = context.switchToHttp().getRequest();
    const user = req.user as any;

    // On accepte projectId ou id dans params, sinon fallback body/query
    const projectId =
      req.params?.projectId ||
      req.params?.id ||
      req.body?.projectId ||
      req.query?.projectId;
    if (!projectId) {
      throw new BadRequestException("projectId is required");
    }

    // Vérifier membership
    const membership = await this.prisma.projectMember.findFirst({
      where: {
        projectId,
        userId: user.sub,
        deletedAt: null,
        ...(user.role === "SUPER_ADMIN" ? {} : { project: { companyId: user.companyId } }),
      },
      select: { role: true },
    });

    if (!membership) {
      // On renvoie "not found" pour ne pas leak l'existence du projet
      throw new NotFoundException("Project not found");
    }

    return requiredRoles.includes(membership.role);
  }
}
