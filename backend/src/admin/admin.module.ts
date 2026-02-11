import { Module } from "@nestjs/common";
import { AdminCompaniesController } from "./companies.controller";
import { AdminUsersController } from "./users.controller";
import { AdminService } from "./admin.service";

@Module({
  controllers: [AdminCompaniesController, AdminUsersController],
  providers: [AdminService],
})
export class AdminModule {}
