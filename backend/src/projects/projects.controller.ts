import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ProjectsService } from "./projects.service";
import { CreateProjectDto } from "./dto/create-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiQuery, ApiTags } from "@nestjs/swagger";
import { PaginationDto } from "../common/dto/pagination.dto";

@ApiTags("projects")
@ApiBearerAuth("access-token")
@Controller("projects")
@UseGuards(JwtAuthGuard)


@Controller("projects")
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private readonly projects: ProjectsService) {}

  @Post()
  @ApiCreatedResponse({ description: "Project created" })
  create(@Req() req: Request, @Body() dto: CreateProjectDto) {
    const user = req.user as any;
    return this.projects.create(user.sub, dto);
  }

  @Get()
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
    return this.projects.findAllForUser(user.sub, pagination);
  }

  @Get(":id")
  @ApiOkResponse({ description: "Project details" })
  findOne(@Req() req: Request, @Param("id") id: string) {
    const user = req.user as any;
    return this.projects.findOneForUser(user.sub, id);
  }

  @Patch(":id")
  @ApiOkResponse({ description: "Project updated" })
  update(@Req() req: Request, @Param("id") id: string, @Body() dto: UpdateProjectDto) {
    const user = req.user as any;
    return this.projects.update(user.sub, id, dto);
  }

  @Delete(":id")
  @ApiOkResponse({ description: "Project archived" })
  archive(@Req() req: Request, @Param("id") id: string) {
    const user = req.user as any;
    return this.projects.archive(user.sub, id);
  }
}
