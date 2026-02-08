import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('kpis')
  async getKpis() {
    return this.dashboardService.getKpis();
  }

  @Get('progression')
  async getProgression() {
    return this.dashboardService.getProgression();
  }

  @Get('cost-repartition')
  async getCostRepartition() {
    return this.dashboardService.getCostRepartition();
  }
}
