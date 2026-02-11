import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateExpenseDto } from "./dto/create-expense.dto";
import { UpdateExpenseStatusDto } from "./dto/update-expense-status.dto";
import { PaginationDto } from "../common/dto/pagination.dto";

@Injectable()
export class ExpensesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(companyId: string, projectId: string, userId: string, dto: CreateExpenseDto) {
    return this.prisma.expense.create({
      data: {
        projectId,
        amount: dto.amount as any,
        category: dto.category,
        description: dto.description,
        createdById: userId,
      },
    });
  }

  async findAll(companyId: string, projectId: string, pagination: PaginationDto) {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 20;
    const skip = (page - 1) * limit;

    const where = { projectId, project: { companyId } };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.expense.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      this.prisma.expense.count({ where }),
    ]);

    return { items, meta: { page, limit, total } };
  }

  async updateStatus(companyId: string, projectId: string, id: string, dto: UpdateExpenseStatusDto) {
    const existing = await this.prisma.expense.findFirst({
      where: { id, projectId, project: { companyId } },
      select: { id: true },
    });
    if (!existing) throw new NotFoundException("Expense not found");

    return this.prisma.expense.update({
      where: { id },
      data: { status: dto.status },
    });
  }

  async remove(companyId: string, projectId: string, id: string) {
    const existing = await this.prisma.expense.findFirst({
      where: { id, projectId, project: { companyId } },
      select: { id: true },
    });
    if (!existing) throw new NotFoundException("Expense not found");

    return this.prisma.expense.delete({ where: { id } });
  }
}
