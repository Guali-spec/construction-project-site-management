import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { ProjectMemberRole } from "@prisma/client";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ProjectRoleGuard } from "../auth/guards/project-role.guard";
import { ProjectRoles } from "../auth/decorators/project-roles.decorator";
import { LotsService } from "./lots.service";
import { CreateLotDto } from "./dto/create-lot.dto";
import { UpdateLotDto } from "./dto/update-lot.dto";
import { PaginationDto } from "../common/dto/pagination.dto";

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
  @Post()
  @ApiCreatedResponse({ description: "Lot created" })
  create(
    @Param("projectId") projectId: string,
    @Param("phaseId") phaseId: string,
    @Body() dto: CreateLotDto,
  ) {
    return this.lots.create(projectId, phaseId, dto);
  }

  @ProjectRoles(...ALL_PROJECT_ROLES)
  @Get()
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiOkResponse({
    description: "Paginated lots list",
    schema: { example: { items: [], meta: { page: 1, limit: 20, total: 0 } } },
  })
  findAll(
    @Param("projectId") projectId: string,
    @Param("phaseId") phaseId: string,
    @Query() pagination: PaginationDto,
  ) {
    return this.lots.findAll(projectId, phaseId, pagination);
  }

  @ProjectRoles(...ALL_PROJECT_ROLES)
  @ApiParam({ name: "lotId", type: String })
  @Get(":lotId")
  @ApiOkResponse({ description: "Lot details" })
  findOne(
    @Param("projectId") projectId: string,
    @Param("phaseId") phaseId: string,
    @Param("lotId") lotId: string,
  ) {
    return this.lots.findOne(projectId, phaseId, lotId);
  }

  @ProjectRoles(ProjectMemberRole.OWNER, ProjectMemberRole.MANAGER)
  @ApiParam({ name: "lotId", type: String })
  @Patch(":lotId")
  @ApiOkResponse({ description: "Lot updated" })
  update(
    @Param("projectId") projectId: string,
    @Param("phaseId") phaseId: string,
    @Param("lotId") lotId: string,
    @Body() dto: UpdateLotDto,
  ) {
    return this.lots.update(projectId, phaseId, lotId, dto);
  }

  @ApiParam({ name: "lotId", type: String })
  @ProjectRoles(ProjectMemberRole.OWNER, ProjectMemberRole.MANAGER)
  @Delete(":lotId")
  @ApiOkResponse({ description: "Lot deleted (soft)" })
  remove(
    @Param("projectId") projectId: string,
    @Param("phaseId") phaseId: string,
    @Param("lotId") lotId: string,
  ) {
    return this.lots.remove(projectId, phaseId, lotId);
  }
}
