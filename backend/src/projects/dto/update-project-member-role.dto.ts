import { ProjectMemberRole } from "@prisma/client";
import { IsEnum, IsNotEmpty, NotEquals } from "class-validator";

export class UpdateProjectMemberRoleDto {
  @IsNotEmpty()
  @IsEnum(ProjectMemberRole)
  @NotEquals(ProjectMemberRole.OWNER)
  role: ProjectMemberRole;
}
