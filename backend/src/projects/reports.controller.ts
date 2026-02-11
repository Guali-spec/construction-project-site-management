import { Controller, Get, Param, Query, Req, UseGuards, Res } from "@nestjs/common";
import type { Request, Response } from "express";
import { ApiBearerAuth, ApiOkResponse, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { ProjectMemberRole } from "@prisma/client";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ProjectRoleGuard } from "../auth/guards/project-role.guard";
import { ProjectRoles } from "../auth/decorators/project-roles.decorator";
import { Roles } from "../auth/decorators/roles.decorator";
import { ReportsService } from "./reports.service";
import { ExportReportDto } from "./dto/export-report.dto";
import { PaginationDto } from "../common/dto/pagination.dto";

const ALL_PROJECT_ROLES = [
  ProjectMemberRole.OWNER,
  ProjectMemberRole.MANAGER,
  ProjectMemberRole.SUPERVISOR,
  ProjectMemberRole.WORKER,
];

@ApiTags("reports")
@ApiBearerAuth("access-token")
@ApiParam({ name: "projectId", type: String })
@Controller("projects/:projectId/reports")
@UseGuards(JwtAuthGuard, ProjectRoleGuard)
export class ReportsController {
  constructor(private readonly reports: ReportsService) {}

  @ProjectRoles(...ALL_PROJECT_ROLES)
  @Roles("SUPER_ADMIN", "ADMIN_ENTREPRISE", "CHEF_PROJET", "SUPERVISEUR", "COMPTABLE", "CONSULTANT")
  @Get()
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiOkResponse({
    description: "Paginated reports list",
    schema: { example: { items: [], meta: { page: 1, limit: 20, total: 0 } } },
  })
  list(@Req() req: Request, @Param("projectId") projectId: string, @Query() pagination: PaginationDto) {
    const user = req.user as any;
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 20;
    return this.reports.list(user.companyId, projectId, page, limit);
  }

  @ProjectRoles(...ALL_PROJECT_ROLES)
  @Roles("SUPER_ADMIN", "ADMIN_ENTREPRISE", "CHEF_PROJET", "SUPERVISEUR", "COMPTABLE", "CONSULTANT")
  @Get("export")
  @ApiQuery({ name: "type", required: true })
  @ApiQuery({ name: "format", required: false, enum: ["json", "csv"] })
  @ApiOkResponse({
    description: "Report export JSON or CSV",
    schema: { example: { format: "json", data: {} } },
  })
  async export(
    @Req() req: Request,
    @Param("projectId") projectId: string,
    @Query() query: ExportReportDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = req.user as any;
    const result = await this.reports.export(
      user.companyId,
      projectId,
      user.sub,
      query.type,
      query.format ?? "json",
    );

    if (result.format === "csv") {
      res.type("text/csv");
      return result.data;
    }
    return result.data;
  }
}
