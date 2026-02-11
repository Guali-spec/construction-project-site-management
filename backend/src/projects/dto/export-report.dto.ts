import { ReportType } from "@prisma/client";
import { IsEnum, IsIn, IsOptional } from "class-validator";

export class ExportReportDto {
  @IsEnum(ReportType)
  type: ReportType;

  @IsOptional()
  @IsIn(["json", "csv"])
  format?: "json" | "csv";
}
