import { Body, Controller, Delete, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ProjectRoleGuard } from "../auth/guards/project-role.guard";
import { ProjectRoles } from "../auth/decorators/project-roles.decorator";
import { ProjectsMembersService } from "./projects-members.service";
import { AddProjectMemberDto } from "./dto/add-project-member.dto";
import { UpdateProjectMemberRoleDto } from "./dto/update-project-member-role.dto";

@Controller("projects/:projectId/members")
@UseGuards(JwtAuthGuard, ProjectRoleGuard)
export class ProjectsMembersController {
  constructor(private readonly members: ProjectsMembersService) {}

  @ProjectRoles("OWNER", "MANAGER")
  @Post()
  addMember(
    @Req() req: Request,
    @Param("projectId") projectId: string,
    @Body() body: AddProjectMemberDto,
  ) {
    const user = req.user as any;
    return this.members.addMember(user.sub, projectId, body.email, body.role);
  }

  @ProjectRoles("OWNER", "MANAGER")
  @Patch(":userId")
  changeRole(
    @Req() req: Request,
    @Param("projectId") projectId: string,
    @Param("userId") userId: string,
    @Body() body: UpdateProjectMemberRoleDto,
  ) {
    const user = req.user as any;
    return this.members.changeRole(user.sub, projectId, userId, body.role);
  }

  @ProjectRoles("OWNER")
  @Delete(":userId")
  removeMember(
    @Req() req: Request,
    @Param("projectId") projectId: string,
    @Param("userId") userId: string,
  ) {
    const user = req.user as any;
    return this.members.removeMember(user.sub, projectId, userId);
  }
}
