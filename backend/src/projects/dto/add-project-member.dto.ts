import { ProjectMemberRole } from "@prisma/client";
import { IsEmail, IsEnum, IsNotEmpty, NotEquals } from "class-validator";

export class AddProjectMemberDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsEnum(ProjectMemberRole)
  @NotEquals(ProjectMemberRole.OWNER)
  role: ProjectMemberRole;
}
