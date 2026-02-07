import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class CreateWorkerDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsOptional()
  @IsString()
  trade?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  dailyRate?: number;
}
