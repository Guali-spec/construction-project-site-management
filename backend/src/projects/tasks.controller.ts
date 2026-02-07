import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { ProjectMemberRole } from "@prisma/client";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ProjectRoleGuard } from "../auth/guards/project-role.guard";
import { ProjectRoles } from "../auth/decorators/project-roles.decorator";
import { TasksService } from "./tasks.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { PaginationDto } from "../common/dto/pagination.dto";

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
  @Post()
  @ApiCreatedResponse({ description: "Task created" })
  create(
    @Param("projectId") projectId: string,
    @Param("lotId") lotId: string,
    @Body() dto: CreateTaskDto,
  ) {
    return this.tasks.create(projectId, lotId, dto);
  }

  @ProjectRoles(...ALL_PROJECT_ROLES)
  @Get()
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiOkResponse({
    description: "Paginated tasks list",
    schema: { example: { items: [], meta: { page: 1, limit: 20, total: 0 } } },
  })
  findAll(
    @Param("projectId") projectId: string,
    @Param("lotId") lotId: string,
    @Query() pagination: PaginationDto,
  ) {
    return this.tasks.findAll(projectId, lotId, pagination);
  }

  @ProjectRoles(...ALL_PROJECT_ROLES)
  @ApiParam({ name: "taskId", type: String })
  @Get(":taskId")
  @ApiOkResponse({ description: "Task details" })
  findOne(
    @Param("projectId") projectId: string,
    @Param("lotId") lotId: string,
    @Param("taskId") taskId: string,
  ) {
    return this.tasks.findOne(projectId, lotId, taskId);
  }

  @ProjectRoles(ProjectMemberRole.OWNER, ProjectMemberRole.MANAGER)
  @ApiParam({ name: "taskId", type: String })
  @Patch(":taskId")
  @ApiOkResponse({ description: "Task updated" })
  update(
    @Param("projectId") projectId: string,
    @Param("lotId") lotId: string,
    @Param("taskId") taskId: string,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.tasks.update(projectId, lotId, taskId, dto);
  }

  @ApiParam({ name: "taskId", type: String })
  @ProjectRoles(ProjectMemberRole.OWNER, ProjectMemberRole.MANAGER)
  @Delete(":taskId")
  @ApiOkResponse({ description: "Task deleted (soft)" })
  remove(
    @Param("projectId") projectId: string,
    @Param("lotId") lotId: string,
    @Param("taskId") taskId: string,
  ) {
    return this.tasks.remove(projectId, lotId, taskId);
  }
}
