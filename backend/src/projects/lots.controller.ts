import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { ProjectMemberRole } from "@prisma/client";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ProjectRoleGuard } from "../auth/guards/project-role.guard";
import { ProjectRoles } from "../auth/decorators/project-roles.decorator";
import { LotsService } from "./lots.service";
import { CreateLotDto } from "./dto/create-lot.dto";
import { UpdateLotDto } from "./dto/update-lot.dto";
import { PaginationDto } from "../common/dto/pagination.dto";
import { Roles } from "../auth/decorators/roles.decorator";

const ALL_PROJECT_ROLES = [
  ProjectMemberRole.OWNER,
  ProjectMemberRole.MANAGER,
  ProjectMemberRole.SUPERVISOR,
  ProjectMemberRole.WORKER,
];

@ApiTags("lots")
@ApiBearerAuth("access-token")
@ApiParam({ name: "projectId", type: String })
@ApiParam({ name: "phaseId", type: String })
@Controller("projects/:projectId/phases/:phaseId/lots")
@UseGuards(JwtAuthGuard, ProjectRoleGuard)
export class LotsController {
  constructor(private readonly lots: LotsService) {}

  @ProjectRoles(ProjectMemberRole.OWNER, ProjectMemberRole.MANAGER)
  @Roles("SUPER_ADMIN", "ADMIN_ENTREPRISE", "CHEF_PROJET", "SUPERVISEUR", "COMPTABLE")
  @Post()
  @ApiCreatedResponse({ description: "Lot created" })
  create(
    @Req() req: Request,
    @Param("projectId") projectId: string,
    @Param("phaseId") phaseId: string,
    @Body() dto: CreateLotDto,
  ) {
    const user = req.user as any;
    return this.lots.create(user.companyId, projectId, phaseId, dto);
  }

  @ProjectRoles(...ALL_PROJECT_ROLES)
  @Roles("SUPER_ADMIN", "ADMIN_ENTREPRISE", "CHEF_PROJET", "SUPERVISEUR", "COMPTABLE", "CONSULTANT")
  @Get()
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiOkResponse({
    description: "Paginated lots list",
    schema: { example: { items: [], meta: { page: 1, limit: 20, total: 0 } } },
  })
  findAll(
    @Req() req: Request,
    @Param("projectId") projectId: string,
    @Param("phaseId") phaseId: string,
    @Query() pagination: PaginationDto,
  ) {
    const user = req.user as any;
    return this.lots.findAll(user.companyId, projectId, phaseId, pagination);
  }

  @ProjectRoles(...ALL_PROJECT_ROLES)
  @Roles("SUPER_ADMIN", "ADMIN_ENTREPRISE", "CHEF_PROJET", "SUPERVISEUR", "COMPTABLE", "CONSULTANT")
  @ApiParam({ name: "lotId", type: String })
  @Get(":lotId")
  @ApiOkResponse({ description: "Lot details" })
  findOne(
    @Req() req: Request,
    @Param("projectId") projectId: string,
    @Param("phaseId") phaseId: string,
    @Param("lotId") lotId: string,
  ) {
    const user = req.user as any;
    return this.lots.findOne(user.companyId, projectId, phaseId, lotId);
  }

  @ProjectRoles(ProjectMemberRole.OWNER, ProjectMemberRole.MANAGER)
  @Roles("SUPER_ADMIN", "ADMIN_ENTREPRISE", "CHEF_PROJET", "SUPERVISEUR", "COMPTABLE")
  @ApiParam({ name: "lotId", type: String })
  @Patch(":lotId")
  @ApiOkResponse({ description: "Lot updated" })
  update(
    @Req() req: Request,
    @Param("projectId") projectId: string,
    @Param("phaseId") phaseId: string,
    @Param("lotId") lotId: string,
    @Body() dto: UpdateLotDto,
  ) {
    const user = req.user as any;
    return this.lots.update(user.companyId, projectId, phaseId, lotId, dto);
  }

  @ApiParam({ name: "lotId", type: String })
  @ProjectRoles(ProjectMemberRole.OWNER, ProjectMemberRole.MANAGER)
  @Roles("SUPER_ADMIN", "ADMIN_ENTREPRISE", "CHEF_PROJET", "SUPERVISEUR", "COMPTABLE")
  @Delete(":lotId")
  @ApiOkResponse({ description: "Lot deleted (soft)" })
  remove(
    @Req() req: Request,
    @Param("projectId") projectId: string,
    @Param("phaseId") phaseId: string,
    @Param("lotId") lotId: string,
  ) {
    const user = req.user as any;
    return this.lots.remove(user.companyId, projectId, phaseId, lotId);
  }
}
