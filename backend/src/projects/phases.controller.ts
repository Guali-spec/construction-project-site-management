import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ProjectRoleGuard } from "../auth/guards/project-role.guard";
import { ProjectRoles } from "../auth/decorators/project-roles.decorator";
import { ProjectMemberRole } from "@prisma/client";
import { Roles } from "../auth/decorators/roles.decorator";
import { PhasesService } from "./phases.service";
import { CreatePhaseDto } from "./dto/create-phase.dto";
import { UpdatePhaseDto } from "./dto/update-phase.dto";
import { PaginationDto } from "../common/dto/pagination.dto";

const ALL_PROJECT_ROLES = [
  ProjectMemberRole.OWNER,
  ProjectMemberRole.MANAGER,
  ProjectMemberRole.SUPERVISOR,
  ProjectMemberRole.WORKER,
];

@ApiTags("phases")
@ApiBearerAuth("access-token")
@ApiParam({ name: "projectId", type: String })
@Controller("projects/:projectId/phases")
@UseGuards(JwtAuthGuard, ProjectRoleGuard)
export class PhasesController {
  constructor(private readonly phases: PhasesService) {}

  @ProjectRoles(ProjectMemberRole.OWNER, ProjectMemberRole.MANAGER)
  @Roles("SUPER_ADMIN", "ADMIN_ENTREPRISE", "CHEF_PROJET", "SUPERVISEUR", "COMPTABLE")
  @Post()
  @ApiCreatedResponse({ description: "Phase created" })
  create(@Req() req: Request, @Param("projectId") projectId: string, @Body() dto: CreatePhaseDto) {
    const user = req.user as any;
    return this.phases.create(user.companyId, projectId, dto);
  }

  @ProjectRoles(...ALL_PROJECT_ROLES)
  @Roles("SUPER_ADMIN", "ADMIN_ENTREPRISE", "CHEF_PROJET", "SUPERVISEUR", "COMPTABLE", "CONSULTANT")
  @Get()
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiOkResponse({
    description: "Paginated phases list",
    schema: { example: { items: [], meta: { page: 1, limit: 20, total: 0 } } },
  })
  findAll(@Req() req: Request, @Param("projectId") projectId: string, @Query() pagination: PaginationDto) {
    const user = req.user as any;
    return this.phases.findAll(user.companyId, projectId, pagination);
  }

  @ProjectRoles(...ALL_PROJECT_ROLES)
  @Roles("SUPER_ADMIN", "ADMIN_ENTREPRISE", "CHEF_PROJET", "SUPERVISEUR", "COMPTABLE", "CONSULTANT")
  @ApiParam({ name: "phaseId", type: String })
  @Get(":phaseId")
  @ApiOkResponse({ description: "Phase details" })
  findOne(
    @Req() req: Request,
    @Param("projectId") projectId: string,
    @Param("phaseId") phaseId: string,
  ) {
    const user = req.user as any;
    return this.phases.findOne(user.companyId, projectId, phaseId);
  }

  @ProjectRoles(ProjectMemberRole.OWNER, ProjectMemberRole.MANAGER)
  @Roles("SUPER_ADMIN", "ADMIN_ENTREPRISE", "CHEF_PROJET", "SUPERVISEUR", "COMPTABLE")
  @ApiParam({ name: "phaseId", type: String })
  @Patch(":phaseId")
  @ApiOkResponse({ description: "Phase updated" })
  update(
    @Req() req: Request,
    @Param("projectId") projectId: string,
    @Param("phaseId") phaseId: string,
    @Body() dto: UpdatePhaseDto,
  ) {
    const user = req.user as any;
    return this.phases.update(user.companyId, projectId, phaseId, dto);
  }

  @ApiParam({ name: "phaseId", type: String })
  @ProjectRoles(ProjectMemberRole.OWNER, ProjectMemberRole.MANAGER)
  @Roles("SUPER_ADMIN", "ADMIN_ENTREPRISE", "CHEF_PROJET", "SUPERVISEUR", "COMPTABLE")
  @Delete(":phaseId")
  @ApiOkResponse({ description: "Phase deleted (soft)" })
  remove(@Req() req: Request, @Param("projectId") projectId: string, @Param("phaseId") phaseId: string) {
    const user = req.user as any;
    return this.phases.remove(user.companyId, projectId, phaseId);
  }
}
