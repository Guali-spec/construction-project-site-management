import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateProgressPhotoDto {
  @IsString()
  @IsNotEmpty()
  url: string;

  @IsOptional()
  @IsString()
  caption?: string;

  @IsOptional()
  @IsUUID()
  taskId?: string;
}
