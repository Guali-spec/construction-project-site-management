import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { ProjectMemberRole } from "@prisma/client";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ProjectRoleGuard } from "../auth/guards/project-role.guard";
import { ProjectRoles } from "../auth/decorators/project-roles.decorator";
import { CreateWorkerDto } from "./dto/create-worker.dto";
import { UpdateWorkerDto } from "./dto/update-worker.dto";
import { WorkersService } from "./workers.service";
import { PaginationDto } from "../common/dto/pagination.dto";

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

  @ProjectRoles(ProjectMemberRole.OWNER, ProjectMemberRole.MANAGER)
  @Post()
  @ApiCreatedResponse({ description: "Worker created" })
  create(@Param("projectId") projectId: string, @Body() dto: CreateWorkerDto) {
    return this.workers.create(projectId, dto);
  }

  @ProjectRoles(...ALL_PROJECT_ROLES)
  @Get()
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiOkResponse({
    description: "Paginated workers list",
    schema: { example: { items: [], meta: { page: 1, limit: 20, total: 0 } } },
  })
  findAll(@Param("projectId") projectId: string, @Query() pagination: PaginationDto) {
    return this.workers.findAll(projectId, pagination);
  }

  @ProjectRoles(...ALL_PROJECT_ROLES)
  @ApiParam({ name: "workerId", type: String })
  @Get(":workerId")
  @ApiOkResponse({ description: "Worker details" })
  findOne(@Param("projectId") projectId: string, @Param("workerId") workerId: string) {
    return this.workers.findOne(projectId, workerId);
  }

  @ProjectRoles(ProjectMemberRole.OWNER, ProjectMemberRole.MANAGER)
  @ApiParam({ name: "workerId", type: String })
  @Patch(":workerId")
  @ApiOkResponse({ description: "Worker updated" })
  update(
    @Param("projectId") projectId: string,
    @Param("workerId") workerId: string,
    @Body() dto: UpdateWorkerDto,
  ) {
    return this.workers.update(projectId, workerId, dto);
  }

  @ApiParam({ name: "workerId", type: String })
  @ProjectRoles(ProjectMemberRole.OWNER, ProjectMemberRole.MANAGER)
  @Delete(":workerId")
  @ApiOkResponse({ description: "Worker deleted (soft)" })
  remove(@Param("projectId") projectId: string, @Param("workerId") workerId: string) {
    return this.workers.remove(projectId, workerId);
  }
}
