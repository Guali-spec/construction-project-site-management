import { IsOptional, IsString, IsUUID } from "class-validator";

export class CreateProgressPhotoUploadDto {
  @IsOptional()
  @IsString()
  caption?: string;

  @IsOptional()
  @IsUUID()
  taskId?: string;
}
