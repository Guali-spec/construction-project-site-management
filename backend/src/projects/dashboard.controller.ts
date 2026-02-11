import { Controller, Get, Param, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { ApiBearerAuth, ApiOkResponse, ApiParam, ApiTags } from "@nestjs/swagger";
import { ProjectMemberRole } from "@prisma/client";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ProjectRoleGuard } from "../auth/guards/project-role.guard";
import { ProjectRoles } from "../auth/decorators/project-roles.decorator";
import { Roles } from "../auth/decorators/roles.decorator";
import { DashboardService } from "./dashboard.service";

const ALL_PROJECT_ROLES = [
  ProjectMemberRole.OWNER,
  ProjectMemberRole.MANAGER,
  ProjectMemberRole.SUPERVISOR,
  ProjectMemberRole.WORKER,
];

@ApiTags("dashboard")
@ApiBearerAuth("access-token")
@ApiParam({ name: "projectId", type: String })
@Controller("projects/:projectId/dashboard")
@UseGuards(JwtAuthGuard, ProjectRoleGuard)
export class DashboardController {
  constructor(private readonly dashboard: DashboardService) {}

  @ProjectRoles(...ALL_PROJECT_ROLES)
  @Roles("SUPER_ADMIN", "ADMIN_ENTREPRISE", "CHEF_PROJET", "SUPERVISEUR", "COMPTABLE", "CONSULTANT")
  @Get()
  @ApiOkResponse({
    description: "Project dashboard summary",
    schema: {
      example: {
        project: { id: "uuid", name: "Site A", status: "ACTIVE", budget: 100000 },
        tasks: { total: 12, done: 4 },
        workers: { total: 5 },
        materials: { total: 3 },
        expenses: { total: 2500 },
      },
    },
  })
  get(@Req() req: Request, @Param("projectId") projectId: string) {
    const user = req.user as any;
    return this.dashboard.getProjectDashboard(user.companyId, projectId);
  }
}
