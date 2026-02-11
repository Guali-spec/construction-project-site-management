import { IsBoolean, IsDateString, IsOptional, IsString } from "class-validator";

export class UpdateAttendanceDto {
  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsBoolean()
  present?: boolean;

  @IsOptional()
  @IsString()
  notes?: string;
}
