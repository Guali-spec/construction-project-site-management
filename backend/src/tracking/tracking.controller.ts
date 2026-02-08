import { Controller, Get, Post, Put, Delete, UseGuards, Param, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TrackingService } from './tracking.service';

@Controller('tracking')
@UseGuards(JwtAuthGuard)
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @Get('tasks')
  async getTasks() {
    return this.trackingService.getTasks();
  }

  @Get('tasks/:id')
  async getTask(@Param('id') id: string) {
    return this.trackingService.getTask(id);
  }

  @Post('tasks')
  async createTask(@Body() createTaskDto: any) {
    return this.trackingService.createTask(createTaskDto);
  }

  @Put('tasks/:id')
  async updateTask(@Param('id') id: string, @Body() updateTaskDto: any) {
    return this.trackingService.updateTask(id, updateTaskDto);
  }

  @Delete('tasks/:id')
  async deleteTask(@Param('id') id: string) {
    return this.trackingService.deleteTask(id);
  }

  @Get('progress')
  async getProgress() {
    return this.trackingService.getProgress();
  }

  @Get('delays')
  async getDelays() {
    return this.trackingService.getDelays();
  }

  @Get('stats')
  async getTrackingStats() {
    return this.trackingService.getTrackingStats();
  }
}
