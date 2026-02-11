import { Body, Controller, Get, Param, Patch, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { AdminService } from "./admin.service";
import { ApiBearerAuth, ApiParam, ApiTags } from "@nestjs/swagger";
import type { Request } from "express";
import { UpdateUserRoleDto } from "./dto/update-user-role.dto";

@ApiTags("admin-users")
@ApiBearerAuth("access-token")
@Controller()
@UseGuards(JwtAuthGuard)
export class AdminUsersController {
  constructor(private readonly admin: AdminService) {}

  @Get("company/users")
  @Roles("ADMIN_ENTREPRISE")
  listCompanyUsers(@Req() req: Request) {
    const user = req.user as any;
    return this.admin.listCompanyUsers(user);
  }

  @Get("admin/users/pending")
  @Roles("SUPER_ADMIN", "ADMIN_ENTREPRISE")
  listPending(@Req() req: Request) {
    const user = req.user as any;
    return this.admin.listPendingUsers(user);
  }

  @Patch("admin/users/:id/role")
  @Roles("SUPER_ADMIN", "ADMIN_ENTREPRISE", "CHEF_PROJET")
  @ApiParam({ name: "id", type: String })
  assignRole(@Req() req: Request, @Param("id") id: string, @Body() dto: UpdateUserRoleDto) {
    const user = req.user as any;
    return this.admin.assignUserRole(user, id, dto.role);
  }
}
