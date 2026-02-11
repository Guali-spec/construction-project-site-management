import { Body, Controller, Delete, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ProjectRoleGuard } from "../auth/guards/project-role.guard";
import { ProjectRoles } from "../auth/decorators/project-roles.decorator";
import { ProjectsMembersService } from "./projects-members.service";
import { ProjectMemberRole } from "@prisma/client";
import { AddProjectMemberDto } from "./dto/add-project-member.dto";
import { UpdateProjectMemberRoleDto } from "./dto/update-project-member-role.dto";
import { Roles } from "../auth/decorators/roles.decorator";

@Controller("projects/:projectId/members")
@UseGuards(JwtAuthGuard, ProjectRoleGuard)
export class ProjectsMembersController {
  constructor(private readonly members: ProjectsMembersService) {}

  @ProjectRoles(ProjectMemberRole.OWNER, ProjectMemberRole.MANAGER)
  @Roles("SUPER_ADMIN", "ADMIN_ENTREPRISE", "CHEF_PROJET", "SUPERVISEUR", "COMPTABLE")
  @Post()
  addMember(
    @Req() req: Request,
    @Param("projectId") projectId: string,
    @Body() body: AddProjectMemberDto,
  ) {
    const user = req.user as any;
    return this.members.addMember(user.sub, user.companyId, projectId, body.email, body.role);
  }

  @ProjectRoles(ProjectMemberRole.OWNER, ProjectMemberRole.MANAGER)
  @Roles("SUPER_ADMIN", "ADMIN_ENTREPRISE", "CHEF_PROJET", "SUPERVISEUR", "COMPTABLE")
  @Patch(":userId")
  changeRole(
    @Req() req: Request,
    @Param("projectId") projectId: string,
    @Param("userId") userId: string,
    @Body() body: UpdateProjectMemberRoleDto,
  ) {
    const user = req.user as any;
    return this.members.changeRole(user.sub, user.companyId, projectId, userId, body.role);
  }

  @ProjectRoles(ProjectMemberRole.OWNER)
  @Roles("SUPER_ADMIN", "ADMIN_ENTREPRISE", "CHEF_PROJET", "SUPERVISEUR", "COMPTABLE")
  @Delete(":userId")
  removeMember(
    @Req() req: Request,
    @Param("projectId") projectId: string,
    @Param("userId") userId: string,
  ) {
    const user = req.user as any;
    return this.members.removeMember(user.sub, user.companyId, projectId, userId);
  }
}
