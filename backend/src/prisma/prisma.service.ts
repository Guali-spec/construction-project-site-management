import {
  Injectable,
  OnApplicationShutdown,
  OnModuleDestroy,
  OnModuleInit,
} from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy, OnApplicationShutdown
{
  constructor() {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error("DATABASE_URL is missing. Check backend/.env and ConfigModule.");
    }

    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);

    super({ adapter });

    const softDeleteModels = new Set<string>([
      "User",
      "Project",
      "ProjectMember",
      "Phase",
      "Lot",
      "Task",
      "Worker",
      "Attendance",
      "Material",
      "Expense",
      "ProgressPhoto",
      "Report",
      "ActivityLog",
      "RefreshToken",
    ]);

    const extended = this.$extends({
      query: {
        $allModels: {
          async findFirst({ model, args, query }) {
            if (!softDeleteModels.has(model)) return query(args);
            args.where = args.where ?? {};
            if (!("deletedAt" in args.where)) {
              args.where = { ...args.where, deletedAt: null };
            }
            return query(args);
          },
          async findMany({ model, args, query }) {
            if (!softDeleteModels.has(model)) return query(args);
            args.where = args.where ?? {};
            if (!("deletedAt" in args.where)) {
              args.where = { ...args.where, deletedAt: null };
            }
            return query(args);
          },
          async count({ model, args, query }) {
            if (!softDeleteModels.has(model)) return query(args);
            args.where = args.where ?? {};
            if (!("deletedAt" in args.where)) {
              args.where = { ...args.where, deletedAt: null };
            }
            return query(args);
          },
          async delete({ model, args }) {
            const client: any = this as any;
            if (!softDeleteModels.has(model)) {
              return client[model].delete(args);
            }
            return client[model].update({
              ...args,
              data: { deletedAt: new Date() },
            });
          },
          async deleteMany({ model, args }) {
            const client: any = this as any;
            if (!softDeleteModels.has(model)) {
              return client[model].deleteMany(args);
            }
            return client[model].updateMany({
              ...args,
              data: { deletedAt: new Date() },
            });
          },
        },
      },
    });

    Object.assign(this, extended);
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async onApplicationShutdown() {
    await this.$disconnect();
  }
}
