import { IsBoolean, IsDateString, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateAttendanceDto {
  @IsUUID()
  workerId: string;

  @IsDateString()
  date: string;

  @IsOptional()
  @IsBoolean()
  present?: boolean;

  @IsOptional()
  @IsString()
  notes?: string;
}
