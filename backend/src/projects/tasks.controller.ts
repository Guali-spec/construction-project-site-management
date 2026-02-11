import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { ProjectMemberRole } from "@prisma/client";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ProjectRoleGuard } from "../auth/guards/project-role.guard";
import { ProjectRoles } from "../auth/decorators/project-roles.decorator";
import { TasksService } from "./tasks.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { UpdateTaskStatusDto } from "./dto/update-task-status.dto";
import { PaginationDto } from "../common/dto/pagination.dto";
import { Roles } from "../auth/decorators/roles.decorator";

const ALL_PROJECT_ROLES = [
  ProjectMemberRole.OWNER,
  ProjectMemberRole.MANAGER,
  ProjectMemberRole.SUPERVISOR,
  ProjectMemberRole.WORKER,
];

@ApiTags("tasks")
@ApiBearerAuth("access-token")
@ApiParam({ name: "projectId", type: String })
@ApiParam({ name: "lotId", type: String })
@Controller("projects/:projectId/lots/:lotId/tasks")
@UseGuards(JwtAuthGuard, ProjectRoleGuard)
export class TasksController {
  constructor(private readonly tasks: TasksService) {}

  @ProjectRoles(ProjectMemberRole.OWNER, ProjectMemberRole.MANAGER)
  @Roles("SUPER_ADMIN", "ADMIN_ENTREPRISE", "CHEF_PROJET", "SUPERVISEUR", "COMPTABLE")
  @Post()
  @ApiCreatedResponse({ description: "Task created" })
  create(
    @Req() req: Request,
    @Param("projectId") projectId: string,
    @Param("lotId") lotId: string,
    @Body() dto: CreateTaskDto,
  ) {
    const user = req.user as any;
    return this.tasks.create(user.companyId, projectId, lotId, dto);
  }

  @ProjectRoles(...ALL_PROJECT_ROLES)
  @Roles("SUPER_ADMIN", "ADMIN_ENTREPRISE", "CHEF_PROJET", "SUPERVISEUR", "COMPTABLE", "CONSULTANT")
  @Get()
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiOkResponse({
    description: "Paginated tasks list",
    schema: { example: { items: [], meta: { page: 1, limit: 20, total: 0 } } },
  })
  findAll(
    @Req() req: Request,
    @Param("projectId") projectId: string,
    @Param("lotId") lotId: string,
    @Query() pagination: PaginationDto,
  ) {
    const user = req.user as any;
    return this.tasks.findAll(user.companyId, projectId, lotId, pagination);
  }

  @ProjectRoles(...ALL_PROJECT_ROLES)
  @Roles("SUPER_ADMIN", "ADMIN_ENTREPRISE", "CHEF_PROJET", "SUPERVISEUR", "COMPTABLE", "CONSULTANT")
  @ApiParam({ name: "taskId", type: String })
  @Get(":taskId")
  @ApiOkResponse({ description: "Task details" })
  findOne(
    @Req() req: Request,
    @Param("projectId") projectId: string,
    @Param("lotId") lotId: string,
    @Param("taskId") taskId: string,
  ) {
    const user = req.user as any;
    return this.tasks.findOne(user.companyId, projectId, lotId, taskId);
  }

  @ProjectRoles(ProjectMemberRole.OWNER, ProjectMemberRole.MANAGER)
  @Roles("SUPER_ADMIN", "ADMIN_ENTREPRISE", "CHEF_PROJET", "SUPERVISEUR", "COMPTABLE")
  @ApiParam({ name: "taskId", type: String })
  @Patch(":taskId")
  @ApiOkResponse({ description: "Task updated" })
  update(
    @Req() req: Request,
    @Param("projectId") projectId: string,
    @Param("lotId") lotId: string,
    @Param("taskId") taskId: string,
    @Body() dto: UpdateTaskDto,
  ) {
    const user = req.user as any;
    return this.tasks.update(user.companyId, projectId, lotId, taskId, dto);
  }

  @ApiParam({ name: "taskId", type: String })
  @ProjectRoles(ProjectMemberRole.OWNER, ProjectMemberRole.MANAGER, ProjectMemberRole.SUPERVISOR)
  @Roles("SUPER_ADMIN", "ADMIN_ENTREPRISE", "CHEF_PROJET", "SUPERVISEUR", "COMPTABLE")
  @Patch(":taskId/status")
  @ApiOkResponse({ description: "Task status/progress updated" })
  updateStatus(
    @Req() req: Request,
    @Param("projectId") projectId: string,
    @Param("lotId") lotId: string,
    @Param("taskId") taskId: string,
    @Body() dto: UpdateTaskStatusDto,
  ) {
    const user = req.user as any;
    return this.tasks.updateStatus(user.companyId, projectId, lotId, taskId, dto);
  }

  @ApiParam({ name: "taskId", type: String })
  @ProjectRoles(ProjectMemberRole.OWNER, ProjectMemberRole.MANAGER)
  @Roles("SUPER_ADMIN", "ADMIN_ENTREPRISE", "CHEF_PROJET", "SUPERVISEUR", "COMPTABLE")
  @Delete(":taskId")
  @ApiOkResponse({ description: "Task deleted (soft)" })
  remove(
    @Req() req: Request,
    @Param("projectId") projectId: string,
    @Param("lotId") lotId: string,
    @Param("taskId") taskId: string,
  ) {
    const user = req.user as any;
    return this.tasks.remove(user.companyId, projectId, lotId, taskId);
  }
}
