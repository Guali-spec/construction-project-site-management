import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateAttendanceDto } from "./dto/create-attendance.dto";
import { UpdateAttendanceDto } from "./dto/update-attendance.dto";
import { PaginationDto } from "../common/dto/pagination.dto";

@Injectable()
export class AttendancesService {
  constructor(private readonly prisma: PrismaService) {}

  private async ensureWorkerInProject(companyId: string, projectId: string, workerId: string) {
    const worker = await this.prisma.worker.findFirst({
      where: { id: workerId, projectId, project: { companyId } },
      select: { id: true },
    });
    if (!worker) throw new BadRequestException("Worker not found in project");
  }

  async create(companyId: string, projectId: string, dto: CreateAttendanceDto) {
    await this.ensureWorkerInProject(companyId, projectId, dto.workerId);
    return this.prisma.attendance.create({
      data: {
        projectId,
        workerId: dto.workerId,
        date: new Date(dto.date),
        present: dto.present ?? true,
        notes: dto.notes,
      },
    });
  }

  async findAll(companyId: string, projectId: string, pagination: PaginationDto) {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 20;
    const skip = (page - 1) * limit;

    const where = { projectId, project: { companyId } };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.attendance.findMany({
        where,
        orderBy: { date: "desc" },
        skip,
        take: limit,
      }),
      this.prisma.attendance.count({ where }),
    ]);

    return { items, meta: { page, limit, total } };
  }

  async update(companyId: string, projectId: string, id: string, dto: UpdateAttendanceDto) {
    const existing = await this.prisma.attendance.findFirst({
      where: { id, projectId, project: { companyId } },
    });
    if (!existing) throw new NotFoundException("Attendance not found");

    return this.prisma.attendance.update({
      where: { id },
      data: {
        date: dto.date ? new Date(dto.date) : undefined,
        present: dto.present,
        notes: dto.notes,
      },
    });
  }

  async remove(companyId: string, projectId: string, id: string) {
    const existing = await this.prisma.attendance.findFirst({
      where: { id, projectId, project: { companyId } },
      select: { id: true },
    });
    if (!existing) throw new NotFoundException("Attendance not found");

    return this.prisma.attendance.delete({ where: { id } });
  }
}
