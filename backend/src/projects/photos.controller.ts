import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { ProjectMemberRole } from "@prisma/client";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ProjectRoleGuard } from "../auth/guards/project-role.guard";
import { ProjectRoles } from "../auth/decorators/project-roles.decorator";
import { PhotosService } from "./photos.service";
import { CreateProgressPhotoDto } from "./dto/create-progress-photo.dto";
import { PaginationDto } from "../common/dto/pagination.dto";

@ApiTags("photos")
@ApiBearerAuth("access-token")
@ApiParam({ name: "projectId", type: String })
@Controller("projects/:projectId/photos")
@UseGuards(JwtAuthGuard, ProjectRoleGuard)
export class PhotosController {
  constructor(private readonly photos: PhotosService) {}

  @ProjectRoles(ProjectMemberRole.OWNER, ProjectMemberRole.MANAGER, ProjectMemberRole.SUPERVISOR)
  @Post()
  @ApiCreatedResponse({ description: "Progress photo created" })
  create(
    @Req() req: Request,
    @Param("projectId") projectId: string,
    @Body() dto: CreateProgressPhotoDto,
  ) {
    const user = req.user as any;
    return this.photos.create(projectId, user.sub, dto);
  }

  @ProjectRoles(ProjectMemberRole.OWNER, ProjectMemberRole.MANAGER, ProjectMemberRole.SUPERVISOR, ProjectMemberRole.WORKER)
  @Get()
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiOkResponse({
    description: "Paginated photos list",
    schema: { example: { items: [], meta: { page: 1, limit: 20, total: 0 } } },
  })
  list(@Param("projectId") projectId: string, @Query() pagination: PaginationDto) {
    return this.photos.findAll(projectId, pagination);
  }

  @ProjectRoles(ProjectMemberRole.OWNER, ProjectMemberRole.MANAGER)
  @Delete(":id")
  @ApiOkResponse({ description: "Photo deleted (soft)" })
  remove(@Param("projectId") projectId: string, @Param("id") id: string) {
    return this.photos.remove(projectId, id);
  }
}
