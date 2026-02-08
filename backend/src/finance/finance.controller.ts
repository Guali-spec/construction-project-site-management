import { Controller, Get, Post, Put, Delete, UseGuards, Param, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FinanceService } from './finance.service';

@Controller('finance')
@UseGuards(JwtAuthGuard)
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Get('expenses')
  async getExpenses() {
    return this.financeService.getExpenses();
  }

  @Get('expenses/:id')
  async getExpense(@Param('id') id: string) {
    return this.financeService.getExpense(id);
  }

  @Post('expenses')
  async createExpense(@Body() createExpenseDto: any) {
    return this.financeService.createExpense(createExpenseDto);
  }

  @Put('expenses/:id')
  async updateExpense(@Param('id') id: string, @Body() updateExpenseDto: any) {
    return this.financeService.updateExpense(id, updateExpenseDto);
  }

  @Delete('expenses/:id')
  async deleteExpense(@Param('id') id: string) {
    return this.financeService.deleteExpense(id);
  }

  @Get('budgets')
  async getBudgets() {
    return this.financeService.getBudgets();
  }

  @Get('stats')
  async getFinanceStats() {
    return this.financeService.getFinanceStats();
  }

  @Get('cost-repartition')
  async getCostRepartition() {
    return this.financeService.getCostRepartition();
  }
}
