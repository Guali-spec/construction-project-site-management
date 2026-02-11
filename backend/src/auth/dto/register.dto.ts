import { IsEmail, IsIn, IsOptional, IsString, MinLength } from "class-validator";
import { GlobalRole } from "@prisma/client";

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsOptional()
  @IsIn([GlobalRole.CHEF_PROJET, GlobalRole.SUPERVISEUR, GlobalRole.COMPTABLE, GlobalRole.CONSULTANT])
  requestedRole?: GlobalRole;
}
