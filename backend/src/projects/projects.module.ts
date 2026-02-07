import { Module } from "@nestjs/common";
import { ProjectsController } from "./projects.controller";
import { ProjectsService } from "./projects.service";
import { ProjectsMembersController } from "./projects-members.controller";
import { ProjectsMembersService } from "./projects-members.service";
import { ProjectRoleGuard } from "../auth/guards/project-role.guard";
import { PhasesController } from "./phases.controller";
import { PhasesService } from "./phases.service";
import { LotsController } from "./lots.controller";
import { LotsService } from "./lots.service";
import { TasksController } from "./tasks.controller";
import { TasksService } from "./tasks.service";
import { WorkersController } from "./workers.controller";
import { WorkersService } from "./workers.service";

@Module({
  controllers: [
    ProjectsController,
    ProjectsMembersController,
    PhasesController,
    LotsController,
    TasksController,
    WorkersController,
  ],
  providers: [
    ProjectsService,
    ProjectsMembersService,
    PhasesService,
    LotsService,
    TasksService,
    WorkersService,
    ProjectRoleGuard,
  ],
})
export class ProjectsModule {}
