import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ProjectRoleGuard } from "../auth/guards/project-role.guard";
import { ProjectRoles } from "../auth/decorators/project-roles.decorator";
import { ProjectMemberRole } from "@prisma/client";
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
  @Post()
  @ApiCreatedResponse({ description: "Phase created" })
  create(@Param("projectId") projectId: string, @Body() dto: CreatePhaseDto) {
    return this.phases.create(projectId, dto);
  }

  @ProjectRoles(...ALL_PROJECT_ROLES)
  @Get()
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiOkResponse({
    description: "Paginated phases list",
    schema: { example: { items: [], meta: { page: 1, limit: 20, total: 0 } } },
  })
  findAll(@Param("projectId") projectId: string, @Query() pagination: PaginationDto) {
    return this.phases.findAll(projectId, pagination);
  }

  @ProjectRoles(...ALL_PROJECT_ROLES)
  @ApiParam({ name: "phaseId", type: String })
  @Get(":phaseId")
  @ApiOkResponse({ description: "Phase details" })
  findOne(@Param("projectId") projectId: string, @Param("phaseId") phaseId: string) {
    return this.phases.findOne(projectId, phaseId);
  }

  @ProjectRoles(ProjectMemberRole.OWNER, ProjectMemberRole.MANAGER)
  @ApiParam({ name: "phaseId", type: String })
  @Patch(":phaseId")
  @ApiOkResponse({ description: "Phase updated" })
  update(
    @Param("projectId") projectId: string,
    @Param("phaseId") phaseId: string,
    @Body() dto: UpdatePhaseDto,
  ) {
    return this.phases.update(projectId, phaseId, dto);
  }

  @ApiParam({ name: "phaseId", type: String })
  @ProjectRoles(ProjectMemberRole.OWNER, ProjectMemberRole.MANAGER)
  @Delete(":phaseId")
  @ApiOkResponse({ description: "Phase deleted (soft)" })
  remove(@Param("projectId") projectId: string, @Param("phaseId") phaseId: string) {
    return this.phases.remove(projectId, phaseId);
  }
}
