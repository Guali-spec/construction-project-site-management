import { Controller, Get, Post, Put, Delete, UseGuards, Param, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProjectManagementService } from './project-management.service';

@Controller('project-management')
@UseGuards(JwtAuthGuard)
export class ProjectManagementController {
  constructor(private readonly projectManagementService: ProjectManagementService) {}

  // Phases
  @Get('projects/:projectId/phases')
  async getPhases(@Param('projectId') projectId: string) {
    return this.projectManagementService.getPhases(projectId);
  }

  @Post('projects/:projectId/phases')
  async createPhase(@Param('projectId') projectId: string, @Body() createPhaseDto: any) {
    return this.projectManagementService.createPhase(projectId, createPhaseDto);
  }

  @Put('phases/:id')
  async updatePhase(@Param('id') id: string, @Body() updatePhaseDto: any) {
    return this.projectManagementService.updatePhase(id, updatePhaseDto);
  }

  @Delete('phases/:id')
  async deletePhase(@Param('id') id: string) {
    return this.projectManagementService.deletePhase(id);
  }

  // Lots
  @Get('phases/:phaseId/lots')
  async getLots(@Param('phaseId') phaseId: string) {
    return this.projectManagementService.getLots(phaseId);
  }

  @Post('phases/:phaseId/lots')
  async createLot(@Param('phaseId') phaseId: string, @Body() createLotDto: any) {
    return this.projectManagementService.createLot(phaseId, createLotDto);
  }

  @Put('lots/:id')
  async updateLot(@Param('id') id: string, @Body() updateLotDto: any) {
    return this.projectManagementService.updateLot(id, updateLotDto);
  }

  @Delete('lots/:id')
  async deleteLot(@Param('id') id: string) {
    return this.projectManagementService.deleteLot(id);
  }

  // Tasks
  @Get('lots/:lotId/tasks')
  async getTasks(@Param('lotId') lotId: string) {
    return this.projectManagementService.getTasks(lotId);
  }

  @Post('lots/:lotId/tasks')
  async createTask(@Param('lotId') lotId: string, @Body() createTaskDto: any) {
    return this.projectManagementService.createTask(lotId, createTaskDto);
  }

  @Put('tasks/:id')
  async updateTask(@Param('id') id: string, @Body() updateTaskDto: any) {
    return this.projectManagementService.updateTask(id, updateTaskDto);
  }

  @Delete('tasks/:id')
  async deleteTask(@Param('id') id: string) {
    return this.projectManagementService.deleteTask(id);
  }

  // Budget par poste
  @Get('projects/:projectId/budget')
  async getProjectBudget(@Param('projectId') projectId: string) {
    return this.projectManagementService.getProjectBudget(projectId);
  }

  @Post('projects/:projectId/budget')
  async updateProjectBudget(@Param('projectId') projectId: string, @Body() budgetDto: any) {
    return this.projectManagementService.updateProjectBudget(projectId, budgetDto);
  }

  // Affectation équipe
  @Get('projects/:projectId/team')
  async getProjectTeam(@Param('projectId') projectId: string) {
    return this.projectManagementService.getProjectTeam(projectId);
  }

  @Post('projects/:projectId/team')
  async assignWorkerToProject(@Param('projectId') projectId: string, @Body() assignmentDto: any) {
    return this.projectManagementService.assignWorkerToProject(projectId, assignmentDto);
  }

  @Put('team/:id')
  async updateWorkerAssignment(@Param('id') id: string, @Body() updateDto: any) {
    return this.projectManagementService.updateWorkerAssignment(id, updateDto);
  }

  @Delete('team/:id')
  async removeWorkerFromProject(@Param('id') id: string) {
    return this.projectManagementService.removeWorkerFromProject(id);
  }
}
