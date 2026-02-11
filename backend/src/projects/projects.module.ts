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
import { MaterialsController } from "./materials.controller";
import { MaterialsService } from "./materials.service";
import { ExpensesController } from "./expenses.controller";
import { ExpensesService } from "./expenses.service";
import { AttendancesController } from "./attendances.controller";
import { AttendancesService } from "./attendances.service";
import { PhotosController } from "./photos.controller";
import { PhotosService } from "./photos.service";
import { ReportsController } from "./reports.controller";
import { ReportsService } from "./reports.service";
import { DashboardController } from "./dashboard.controller";
import { DashboardService } from "./dashboard.service";

@Module({
  controllers: [
    ProjectsController,
    ProjectsMembersController,
    PhasesController,
    LotsController,
    TasksController,
    WorkersController,
    MaterialsController,
    ExpensesController,
    AttendancesController,
    PhotosController,
    ReportsController,
    DashboardController,
  ],
  providers: [
    ProjectsService,
    ProjectsMembersService,
    PhasesService,
    LotsService,
    TasksService,
    WorkersService,
    MaterialsService,
    ExpensesService,
    AttendancesService,
    PhotosService,
    ReportsService,
    DashboardService,
    ProjectRoleGuard,
  ],
})
export class ProjectsModule {}
