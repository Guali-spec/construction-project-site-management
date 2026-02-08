import { IsString, IsOptional, IsInt } from 'class-validator';

export class CreateWorkerDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  @IsOptional()
  trade?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsInt()
  dailyRate: number;
}

export class UpdateWorkerDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  trade?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsInt()
  @IsOptional()
  dailyRate?: number;

  @IsString()
  @IsOptional()
  projectId?: string;
}

export class BudgetPosteDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsInt()
  budget: number;

  @IsOptional()
  lots?: Array<{
    id: string;
    name: string;
    budget: number;
    tasksCount: number;
    tasks?: Array<{
      id: string;
      estimatedCost: number;
    }>;
  }>;
}

export class UpdateProjectBudgetDto {
  @IsOptional()
  phases?: BudgetPosteDto[];
}
