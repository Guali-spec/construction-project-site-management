import { Controller, Get, Post, Put, Delete, UseGuards, Param, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ResourcesService } from './resources.service';

@Controller('resources')
@UseGuards(JwtAuthGuard)
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Get('workers')
  async getWorkers() {
    return this.resourcesService.getWorkers();
  }

  @Get('workers/:id')
  async getWorker(@Param('id') id: string) {
    return this.resourcesService.getWorker(id);
  }

  @Post('workers')
  async createWorker(@Body() createWorkerDto: any) {
    return this.resourcesService.createWorker(createWorkerDto);
  }

  @Put('workers/:id')
  async updateWorker(@Param('id') id: string, @Body() updateWorkerDto: any) {
    return this.resourcesService.updateWorker(id, updateWorkerDto);
  }

  @Delete('workers/:id')
  async deleteWorker(@Param('id') id: string) {
    return this.resourcesService.deleteWorker(id);
  }

  @Get('stats')
  async getResourcesStats() {
    return this.resourcesService.getResourcesStats();
  }
}
