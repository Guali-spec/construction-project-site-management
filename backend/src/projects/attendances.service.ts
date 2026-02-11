import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateAttendanceDto } from "./dto/create-attendance.dto";
import { UpdateAttendanceDto } from "./dto/update-attendance.dto";
import { PaginationDto } from "../common/dto/pagination.dto";

@Injectable()
export class AttendancesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(projectId: string, dto: CreateAttendanceDto) {
    const worker = await this.prisma.worker.findFirst({
      where: { id: dto.workerId, projectId, deletedAt: null },
      select: { id: true },
    });
    if (!worker) throw new NotFoundException("Worker not found");

    return this.prisma.attendance.create({
      data: {
        projectId,
        workerId: dto.workerId,
        checkIn: dto.checkIn ? new Date(dto.checkIn) : new Date(),
        note: dto.note,
      },
    });
  }

  async findAll(projectId: string, pagination: PaginationDto) {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 20;
    const skip = (page - 1) * limit;

    const where = { projectId, deletedAt: null };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.attendance.findMany({
        where,
        orderBy: { checkIn: "desc" },
        skip,
        take: limit,
      }),
      this.prisma.attendance.count({ where }),
    ]);

    return { items, meta: { page, limit, total } };
  }

  async update(projectId: string, id: string, dto: UpdateAttendanceDto) {
    const existing = await this.prisma.attendance.findFirst({
      where: { id, projectId, deletedAt: null },
      select: { id: true },
    });
    if (!existing) throw new NotFoundException("Attendance not found");

    return this.prisma.attendance.update({
      where: { id },
      data: {
        checkOut: dto.checkOut ? new Date(dto.checkOut) : undefined,
        note: dto.note,
      },
    });
  }

  async remove(projectId: string, id: string) {
    const existing = await this.prisma.attendance.findFirst({
      where: { id, projectId, deletedAt: null },
      select: { id: true },
    });
    if (!existing) throw new NotFoundException("Attendance not found");
    return this.prisma.attendance.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
