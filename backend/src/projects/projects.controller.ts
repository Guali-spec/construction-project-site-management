import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ProjectsService } from "./projects.service";
import { CreateProjectDto } from "./dto/create-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiTags("projects")
@ApiBearerAuth("access-token")
@Controller("projects")
@UseGuards(JwtAuthGuard)


@Controller("projects")
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private readonly projects: ProjectsService) {}

  @Post()
  create(@Req() req: Request, @Body() dto: CreateProjectDto) {
    const user = req.user as any;
    return this.projects.create(user.sub, dto);
  }

  @Get()
  findAll(@Req() req: Request) {
    const user = req.user as any;
    return this.projects.findAllForUser(user.sub);
  }

  @Get(":id")
  findOne(@Req() req: Request, @Param("id") id: string) {
    const user = req.user as any;
    return this.projects.findOneForUser(user.sub, id);
  }

  @Patch(":id")
  update(@Req() req: Request, @Param("id") id: string, @Body() dto: UpdateProjectDto) {
    const user = req.user as any;
    return this.projects.update(user.sub, id, dto);
  }

  @Delete(":id")
  archive(@Req() req: Request, @Param("id") id: string) {
    const user = req.user as any;
    return this.projects.archive(user.sub, id);
  }
}
