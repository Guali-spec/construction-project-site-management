import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class CreateExpenseDto {
  @IsNumber()
  @Min(0)
  amount: number;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsOptional()
  @IsString()
  description?: string;
}
