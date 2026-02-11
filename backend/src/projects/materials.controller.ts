import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ProjectRoleGuard } from "../auth/guards/project-role.guard";
import { ProjectRoles } from "../auth/decorators/project-roles.decorator";
import { ProjectMemberRole } from "@prisma/client";
import { MaterialsService } from "./materials.service";
import { CreateMaterialDto } from "./dto/create-material.dto";
import { UpdateMaterialDto } from "./dto/update-material.dto";
import { PaginationDto } from "../common/dto/pagination.dto";
import { Roles } from "../auth/decorators/roles.decorator";

@ApiTags("materials")
@ApiBearerAuth("access-token")
@ApiParam({ name: "projectId", type: String })
@Controller("projects/:projectId/materials")
@UseGuards(JwtAuthGuard, ProjectRoleGuard)
export class MaterialsController {
  constructor(private readonly materials: MaterialsService) {}

  @ProjectRoles(ProjectMemberRole.OWNER, ProjectMemberRole.MANAGER)
  @Roles("SUPER_ADMIN", "ADMIN_ENTREPRISE", "CHEF_PROJET", "SUPERVISEUR", "COMPTABLE")
  @Post()
  @ApiCreatedResponse({ description: "Material created" })
  create(@Req() req: Request, @Param("projectId") projectId: string, @Body() dto: CreateMaterialDto) {
    const user = req.user as any;
    return this.materials.create(user.companyId, projectId, dto);
  }

  @ProjectRoles(ProjectMemberRole.OWNER, ProjectMemberRole.MANAGER, ProjectMemberRole.SUPERVISOR, ProjectMemberRole.WORKER)
  @Roles("SUPER_ADMIN", "ADMIN_ENTREPRISE", "CHEF_PROJET", "SUPERVISEUR", "COMPTABLE")
  @Get()
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiOkResponse({
    description: "Paginated materials list",
    schema: { example: { items: [], meta: { page: 1, limit: 20, total: 0 } } },
  })
  findAll(@Req() req: Request, @Param("projectId") projectId: string, @Query() pagination: PaginationDto) {
    const user = req.user as any;
    return this.materials.findAll(user.companyId, projectId, pagination);
  }

  @ProjectRoles(ProjectMemberRole.OWNER, ProjectMemberRole.MANAGER)
  @Roles("SUPER_ADMIN", "ADMIN_ENTREPRISE", "CHEF_PROJET", "SUPERVISEUR", "COMPTABLE")
  @Patch(":id")
  @ApiOkResponse({ description: "Material updated" })
  update(
    @Req() req: Request,
    @Param("projectId") projectId: string,
    @Param("id") id: string,
    @Body() dto: UpdateMaterialDto,
  ) {
    const user = req.user as any;
    return this.materials.update(user.companyId, projectId, id, dto);
  }

  @ProjectRoles(ProjectMemberRole.OWNER, ProjectMemberRole.MANAGER)
  @Roles("SUPER_ADMIN", "ADMIN_ENTREPRISE", "CHEF_PROJET", "SUPERVISEUR", "COMPTABLE")
  @Delete(":id")
  @ApiOkResponse({ description: "Material deleted (soft)" })
  remove(@Req() req: Request, @Param("projectId") projectId: string, @Param("id") id: string) {
    const user = req.user as any;
    return this.materials.remove(user.companyId, projectId, id);
  }
}
