import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ProjectRoleGuard } from "../auth/guards/project-role.guard";
import { ProjectRoles } from "../auth/decorators/project-roles.decorator";
import { Roles } from "../auth/decorators/roles.decorator";
import { ProjectMemberRole } from "@prisma/client";
import { AttendancesService } from "./attendances.service";
import { CreateAttendanceDto } from "./dto/create-attendance.dto";
import { UpdateAttendanceDto } from "./dto/update-attendance.dto";
import { PaginationDto } from "../common/dto/pagination.dto";

@ApiTags("attendances")
@ApiBearerAuth("access-token")
@ApiParam({ name: "projectId", type: String })
@Controller("projects/:projectId/attendances")
@UseGuards(JwtAuthGuard, ProjectRoleGuard)
export class AttendancesController {
  constructor(private readonly attendances: AttendancesService) {}

  @Roles("CHEF_PROJET", "SUPERVISEUR", "COMPTABLE", "ADMIN_ENTREPRISE", "SUPER_ADMIN")
  @ProjectRoles(ProjectMemberRole.OWNER, ProjectMemberRole.MANAGER, ProjectMemberRole.SUPERVISOR, ProjectMemberRole.WORKER)
  @Get()
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiOkResponse({
    description: "Paginated attendances list",
    schema: { example: { items: [], meta: { page: 1, limit: 20, total: 0 } } },
  })
  list(
    @Req() req: Request,
    @Param("projectId") projectId: string,
    @Query() pagination: PaginationDto,
  ) {
    const user = req.user as any;
    return this.attendances.findAll(user.companyId, projectId, pagination);
  }

  @Roles("SUPERVISEUR", "ADMIN_ENTREPRISE", "SUPER_ADMIN")
  @ProjectRoles(ProjectMemberRole.SUPERVISOR)
  @Post()
  @ApiCreatedResponse({ description: "Attendance created" })
  create(
    @Req() req: Request,
    @Param("projectId") projectId: string,
    @Body() dto: CreateAttendanceDto,
  ) {
    const user = req.user as any;
    return this.attendances.create(user.companyId, projectId, dto);
  }

  @Roles("SUPERVISEUR", "ADMIN_ENTREPRISE", "SUPER_ADMIN")
  @ProjectRoles(ProjectMemberRole.SUPERVISOR)
  @Patch(":id")
  @ApiOkResponse({ description: "Attendance updated" })
  update(
    @Req() req: Request,
    @Param("projectId") projectId: string,
    @Param("id") id: string,
    @Body() dto: UpdateAttendanceDto,
  ) {
    const user = req.user as any;
    return this.attendances.update(user.companyId, projectId, id, dto);
  }

  @Roles("CHEF_PROJET", "ADMIN_ENTREPRISE", "SUPER_ADMIN")
  @ProjectRoles(ProjectMemberRole.OWNER, ProjectMemberRole.MANAGER)
  @Delete(":id")
  @ApiOkResponse({ description: "Attendance deleted (soft)" })
  remove(
    @Req() req: Request,
    @Param("projectId") projectId: string,
    @Param("id") id: string,
  ) {
    const user = req.user as any;
    return this.attendances.remove(user.companyId, projectId, id);
  }
}
