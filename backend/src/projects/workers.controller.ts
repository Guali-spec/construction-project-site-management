import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { ProjectMemberRole } from "@prisma/client";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ProjectRoleGuard } from "../auth/guards/project-role.guard";
import { ProjectRoles } from "../auth/decorators/project-roles.decorator";
import { CreateWorkerDto } from "./dto/create-worker.dto";
import { UpdateWorkerDto } from "./dto/update-worker.dto";
import { WorkersService } from "./workers.service";
import { PaginationDto } from "../common/dto/pagination.dto";
import { Roles } from "../auth/decorators/roles.decorator";

const ALL_PROJECT_ROLES = [
  ProjectMemberRole.OWNER,
  ProjectMemberRole.MANAGER,
  ProjectMemberRole.SUPERVISOR,
  ProjectMemberRole.WORKER,
];

@ApiTags("workers")
@ApiBearerAuth("access-token")
@ApiParam({ name: "projectId", type: String })
@Controller("projects/:projectId/workers")
@UseGuards(JwtAuthGuard, ProjectRoleGuard)
export class WorkersController {
  constructor(private readonly workers: WorkersService) {}

  @ProjectRoles(ProjectMemberRole.OWNER, ProjectMemberRole.MANAGER, ProjectMemberRole.SUPERVISOR)
  @Roles("SUPER_ADMIN", "ADMIN_ENTREPRISE", "CHEF_PROJET", "SUPERVISEUR", "COMPTABLE")
  @Post()
  @ApiCreatedResponse({ description: "Worker created" })
  create(@Req() req: Request, @Param("projectId") projectId: string, @Body() dto: CreateWorkerDto) {
    const user = req.user as any;
    return this.workers.create(user.companyId, projectId, dto);
  }

  @ProjectRoles(...ALL_PROJECT_ROLES)
  @Roles("SUPER_ADMIN", "ADMIN_ENTREPRISE", "CHEF_PROJET", "SUPERVISEUR", "COMPTABLE")
  @Get()
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiOkResponse({
    description: "Paginated workers list",
    schema: { example: { items: [], meta: { page: 1, limit: 20, total: 0 } } },
  })
  findAll(@Req() req: Request, @Param("projectId") projectId: string, @Query() pagination: PaginationDto) {
    const user = req.user as any;
    return this.workers.findAll(user.companyId, projectId, pagination);
  }

  @ProjectRoles(...ALL_PROJECT_ROLES)
  @Roles("SUPER_ADMIN", "ADMIN_ENTREPRISE", "CHEF_PROJET", "SUPERVISEUR", "COMPTABLE")
  @ApiParam({ name: "workerId", type: String })
  @Get(":workerId")
  @ApiOkResponse({ description: "Worker details" })
  findOne(
    @Req() req: Request,
    @Param("projectId") projectId: string,
    @Param("workerId") workerId: string,
  ) {
    const user = req.user as any;
    return this.workers.findOne(user.companyId, projectId, workerId);
  }

  @ProjectRoles(ProjectMemberRole.OWNER, ProjectMemberRole.MANAGER, ProjectMemberRole.SUPERVISOR)
  @Roles("SUPER_ADMIN", "ADMIN_ENTREPRISE", "CHEF_PROJET", "SUPERVISEUR", "COMPTABLE")
  @ApiParam({ name: "workerId", type: String })
  @Patch(":workerId")
  @ApiOkResponse({ description: "Worker updated" })
  update(
    @Req() req: Request,
    @Param("projectId") projectId: string,
    @Param("workerId") workerId: string,
    @Body() dto: UpdateWorkerDto,
  ) {
    const user = req.user as any;
    return this.workers.update(user.companyId, projectId, workerId, dto);
  }

  @ApiParam({ name: "workerId", type: String })
  @ProjectRoles(ProjectMemberRole.OWNER, ProjectMemberRole.MANAGER, ProjectMemberRole.SUPERVISOR)
  @Roles("SUPER_ADMIN", "ADMIN_ENTREPRISE", "CHEF_PROJET", "SUPERVISEUR", "COMPTABLE")
  @Delete(":workerId")
  @ApiOkResponse({ description: "Worker deleted (soft)" })
  remove(@Req() req: Request, @Param("projectId") projectId: string, @Param("workerId") workerId: string) {
    const user = req.user as any;
    return this.workers.remove(user.companyId, projectId, workerId);
  }
}
