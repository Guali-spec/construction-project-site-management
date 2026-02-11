import { IsDateString, IsOptional, IsString } from "class-validator";

export class UpdateAttendanceDto {
  @IsOptional()
  @IsDateString()
  checkOut?: string;

  @IsOptional()
  @IsString()
  note?: string;
}
