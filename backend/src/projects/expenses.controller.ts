import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ProjectRoleGuard } from "../auth/guards/project-role.guard";
import { ProjectRoles } from "../auth/decorators/project-roles.decorator";
import { Roles } from "../auth/decorators/roles.decorator";
import { ProjectMemberRole } from "@prisma/client";
import { ExpensesService } from "./expenses.service";
import { CreateExpenseDto } from "./dto/create-expense.dto";
import { UpdateExpenseStatusDto } from "./dto/update-expense-status.dto";
import { PaginationDto } from "../common/dto/pagination.dto";

@ApiTags("expenses")
@ApiBearerAuth("access-token")
@ApiParam({ name: "projectId", type: String })
@Controller("projects/:projectId/expenses")
@UseGuards(JwtAuthGuard, ProjectRoleGuard)
export class ExpensesController {
  constructor(private readonly expenses: ExpensesService) {}

  @Roles("SUPERVISEUR", "ADMIN_ENTREPRISE", "SUPER_ADMIN")
  @ProjectRoles(ProjectMemberRole.SUPERVISOR)
  @Post()
  @ApiCreatedResponse({ description: "Expense created" })
  create(@Req() req: Request, @Param("projectId") projectId: string, @Body() dto: CreateExpenseDto) {
    const user = req.user as any;
    return this.expenses.create(user.companyId, projectId, user.sub, dto);
  }

  @Roles("CHEF_PROJET", "COMPTABLE", "ADMIN_ENTREPRISE", "SUPER_ADMIN")
  @ProjectRoles(ProjectMemberRole.OWNER, ProjectMemberRole.MANAGER, ProjectMemberRole.SUPERVISOR)
  @Get()
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiOkResponse({
    description: "Paginated expenses list",
    schema: { example: { items: [], meta: { page: 1, limit: 20, total: 0 } } },
  })
  list(@Req() req: Request, @Param("projectId") projectId: string, @Query() pagination: PaginationDto) {
    const user = req.user as any;
    return this.expenses.findAll(user.companyId, projectId, pagination);
  }

  @Roles("CHEF_PROJET", "COMPTABLE", "ADMIN_ENTREPRISE", "SUPER_ADMIN")
  @ProjectRoles(ProjectMemberRole.OWNER, ProjectMemberRole.MANAGER)
  @Patch(":id/status")
  @ApiOkResponse({ description: "Expense status updated" })
  updateStatus(
    @Req() req: Request,
    @Param("projectId") projectId: string,
    @Param("id") id: string,
    @Body() dto: UpdateExpenseStatusDto,
  ) {
    const user = req.user as any;
    return this.expenses.updateStatus(user.companyId, projectId, id, dto);
  }

  @Roles("CHEF_PROJET", "COMPTABLE", "ADMIN_ENTREPRISE", "SUPER_ADMIN")
  @ProjectRoles(ProjectMemberRole.OWNER, ProjectMemberRole.MANAGER)
  @Delete(":id")
  @ApiOkResponse({ description: "Expense deleted (soft)" })
  remove(@Req() req: Request, @Param("projectId") projectId: string, @Param("id") id: string) {
    const user = req.user as any;
    return this.expenses.remove(user.companyId, projectId, id);
  }
}
