import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { ProjectMemberRole } from "@prisma/client";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ProjectRoleGuard } from "../auth/guards/project-role.guard";
import { ProjectRoles } from "../auth/decorators/project-roles.decorator";
import { PaginationDto } from "../common/dto/pagination.dto";
import { AttendancesService } from "./attendances.service";
import { CreateAttendanceDto } from "./dto/create-attendance.dto";
import { UpdateAttendanceDto } from "./dto/update-attendance.dto";

const ALL_PROJECT_ROLES = [
  ProjectMemberRole.OWNER,
  ProjectMemberRole.MANAGER,
  ProjectMemberRole.SUPERVISOR,
  ProjectMemberRole.WORKER,
];

@ApiTags("attendances")
@ApiBearerAuth("access-token")
@ApiParam({ name: "projectId", type: String })
@Controller("projects/:projectId/attendances")
@UseGuards(JwtAuthGuard, ProjectRoleGuard)
export class AttendancesController {
  constructor(private readonly attendances: AttendancesService) {}

  @ProjectRoles(ProjectMemberRole.OWNER, ProjectMemberRole.MANAGER, ProjectMemberRole.SUPERVISOR)
  @Post()
  @ApiCreatedResponse({ description: "Attendance created" })
  create(@Param("projectId") projectId: string, @Body() dto: CreateAttendanceDto) {
    return this.attendances.create(projectId, dto);
  }

  @ProjectRoles(...ALL_PROJECT_ROLES)
  @Get()
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiOkResponse({
    description: "Paginated attendances list",
    schema: { example: { items: [], meta: { page: 1, limit: 20, total: 0 } } },
  })
  list(@Param("projectId") projectId: string, @Query() pagination: PaginationDto) {
    return this.attendances.findAll(projectId, pagination);
  }

  @ProjectRoles(ProjectMemberRole.OWNER, ProjectMemberRole.MANAGER, ProjectMemberRole.SUPERVISOR)
  @Patch(":id")
  @ApiOkResponse({ description: "Attendance updated" })
  update(
    @Param("projectId") projectId: string,
    @Param("id") id: string,
    @Body() dto: UpdateAttendanceDto,
  ) {
    return this.attendances.update(projectId, id, dto);
  }

  @ProjectRoles(ProjectMemberRole.OWNER, ProjectMemberRole.MANAGER)
  @Delete(":id")
  @ApiOkResponse({ description: "Attendance deleted (soft)" })
  remove(@Param("projectId") projectId: string, @Param("id") id: string) {
    return this.attendances.remove(projectId, id);
  }
}
