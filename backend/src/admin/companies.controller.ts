import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { AdminService } from "./admin.service";
import { CreateCompanyDto } from "./dto/create-company.dto";
import { UpdateCompanyDto } from "./dto/update-company.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiTags("admin-companies")
@ApiBearerAuth("access-token")
@Controller("admin/companies")
@UseGuards(JwtAuthGuard)
@Roles("SUPER_ADMIN")
export class AdminCompaniesController {
  constructor(private readonly admin: AdminService) {}

  @Post()
  create(@Body() dto: CreateCompanyDto) {
    return this.admin.createCompany(dto.name, dto.slug);
  }

  @Get()
  list() {
    return this.admin.listCompanies();
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateCompanyDto) {
    return this.admin.updateCompany(id, dto);
  }
}
