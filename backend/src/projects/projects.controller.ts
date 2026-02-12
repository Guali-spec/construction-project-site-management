import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { ProjectsService } from "./projects.service";
import { CreateProjectDto } from "./dto/create-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";
import { UpdateProjectStatusDto } from "./dto/update-project-status.dto";
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiQuery, ApiTags } from "@nestjs/swagger";
import { PaginationDto } from "../common/dto/pagination.dto";

@ApiTags("projects")
@ApiBearerAuth("access-token")
@Controller("projects")
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private readonly projects: ProjectsService) {}

  @Post()
  @Roles("SUPER_ADMIN", "ADMIN_ENTREPRISE", "CHEF_PROJET", "COMPTABLE")
  @ApiCreatedResponse({ description: "Project created" })
  create(@Req() req: Request, @Body() dto: CreateProjectDto) {
    const user = req.user as any;
    return this.projects.create(user.sub, user.companyId, dto);
  }

  @Get()
  @Roles("SUPER_ADMIN", "ADMIN_ENTREPRISE", "CHEF_PROJET", "SUPERVISEUR", "COMPTABLE", "CONSULTANT")
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiOkResponse({
    description: "Paginated projects list",
    schema: {
      example: { items: [], meta: { page: 1, limit: 20, total: 0 } },
    },
  })
  findAll(@Req() req: Request, @Query() pagination: PaginationDto) {
    const user = req.user as any;
    return this.projects.findAllForUser(user.sub, user.companyId, pagination);
  }

  @Get(":id")
  @Roles("SUPER_ADMIN", "ADMIN_ENTREPRISE", "CHEF_PROJET", "SUPERVISEUR", "COMPTABLE", "CONSULTANT")
  @ApiOkResponse({ description: "Project details" })
  findOne(@Req() req: Request, @Param("id") id: string) {
    const user = req.user as any;
    return this.projects.findOneForUser(user.sub, user.companyId, id);
  }

  @Patch(":id")
  @Roles("SUPER_ADMIN", "ADMIN_ENTREPRISE", "CHEF_PROJET", "SUPERVISEUR", "COMPTABLE")
  @ApiOkResponse({ description: "Project updated" })
  update(@Req() req: Request, @Param("id") id: string, @Body() dto: UpdateProjectDto) {
    const user = req.user as any;
    return this.projects.update(user.sub, user.companyId, id, dto);
  }

  @Patch(":id/status")
  @Roles("SUPER_ADMIN", "ADMIN_ENTREPRISE", "CHEF_PROJET", "SUPERVISEUR")
  @ApiOkResponse({ description: "Project status updated" })
  updateStatus(@Req() req: Request, @Param("id") id: string, @Body() dto: UpdateProjectStatusDto) {
    const user = req.user as any;
    return this.projects.updateStatus(user.sub, user.companyId, id, dto);
  }

  @Delete(":id")
  @Roles("SUPER_ADMIN", "ADMIN_ENTREPRISE", "CHEF_PROJET", "SUPERVISEUR", "COMPTABLE")
  @ApiOkResponse({ description: "Project archived" })
  archive(@Req() req: Request, @Param("id") id: string) {
    const user = req.user as any;
    return this.projects.archive(user.sub, user.companyId, id);
  }
}
