import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards, UploadedFile, UseInterceptors, BadRequestException } from "@nestjs/common";
import type { Request } from "express";
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ProjectRoleGuard } from "../auth/guards/project-role.guard";
import { ProjectRoles } from "../auth/decorators/project-roles.decorator";
import { Roles } from "../auth/decorators/roles.decorator";
import { ProjectMemberRole } from "@prisma/client";
import { PhotosService } from "./photos.service";
import { CreateProgressPhotoDto } from "./dto/create-progress-photo.dto";
import { PaginationDto } from "../common/dto/pagination.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { join, extname } from "path";
import * as fs from "fs";
import { CreateProgressPhotoUploadDto } from "./dto/create-progress-photo-upload.dto";

@ApiTags("photos")
@ApiBearerAuth("access-token")
@ApiParam({ name: "projectId", type: String })
@Controller("projects/:projectId/photos")
@UseGuards(JwtAuthGuard, ProjectRoleGuard)
export class PhotosController {
  constructor(private readonly photos: PhotosService) {}

  @Roles("CHEF_PROJET", "SUPERVISEUR", "ADMIN_ENTREPRISE", "SUPER_ADMIN")
  @ProjectRoles(ProjectMemberRole.OWNER, ProjectMemberRole.MANAGER, ProjectMemberRole.SUPERVISOR)
  @Post("upload")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const dir = join(process.cwd(), "uploads", "progress");
          fs.mkdirSync(dir, { recursive: true });
          cb(null, dir);
        },
        filename: (req, file, cb) => {
          const ext = extname(file.originalname || "");
          const safeExt = ext || ".jpg";
          const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${safeExt}`;
          cb(null, name);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype && file.mimetype.startsWith("image/")) {
          cb(null, true);
        } else {
          cb(new BadRequestException("Only image files are allowed"), false);
        }
      },
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  @ApiCreatedResponse({ description: "Progress photo uploaded" })
  upload(
    @Req() req: Request,
    @Param("projectId") projectId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateProgressPhotoUploadDto,
  ) {
    if (!file) {
      throw new BadRequestException("File is required");
    }
    const user = req.user as any;
    const url = `/uploads/progress/${file.filename}`;
    return this.photos.create(user.companyId, projectId, user.sub, {
      url,
      caption: dto.caption,
      taskId: dto.taskId,
    });
  }

  @Roles("CHEF_PROJET", "SUPERVISEUR", "ADMIN_ENTREPRISE", "SUPER_ADMIN")
  @ProjectRoles(ProjectMemberRole.OWNER, ProjectMemberRole.MANAGER, ProjectMemberRole.SUPERVISOR)
  @Post()
  @ApiCreatedResponse({ description: "Progress photo created" })
  create(@Req() req: Request, @Param("projectId") projectId: string, @Body() dto: CreateProgressPhotoDto) {
    const user = req.user as any;
    return this.photos.create(user.companyId, projectId, user.sub, dto);
  }

  @ProjectRoles(ProjectMemberRole.OWNER, ProjectMemberRole.MANAGER, ProjectMemberRole.SUPERVISOR, ProjectMemberRole.WORKER)
  @Roles("SUPER_ADMIN", "ADMIN_ENTREPRISE", "CHEF_PROJET", "SUPERVISEUR", "COMPTABLE", "CONSULTANT")
  @Get()
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiOkResponse({
    description: "Paginated photos list",
    schema: { example: { items: [], meta: { page: 1, limit: 20, total: 0 } } },
  })
  list(@Req() req: Request, @Param("projectId") projectId: string, @Query() pagination: PaginationDto) {
    const user = req.user as any;
    return this.photos.findAll(user.companyId, projectId, pagination);
  }

  @Roles("CHEF_PROJET", "SUPERVISEUR", "COMPTABLE", "ADMIN_ENTREPRISE", "SUPER_ADMIN")
  @ProjectRoles(ProjectMemberRole.OWNER, ProjectMemberRole.MANAGER, ProjectMemberRole.SUPERVISOR)
  @Delete(":id")
  @ApiOkResponse({ description: "Photo deleted (soft)" })
  remove(@Req() req: Request, @Param("projectId") projectId: string, @Param("id") id: string) {
    const user = req.user as any;
    return this.photos.remove(user.companyId, projectId, id);
  }
}
