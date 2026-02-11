import { IsDateString, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateAttendanceDto {
  @IsUUID()
  @IsNotEmpty()
  workerId: string;

  @IsOptional()
  @IsDateString()
  checkIn?: string;

  @IsOptional()
  @IsString()
  note?: string;
}
