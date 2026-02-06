import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  async getHello(): Promise<string> {
    // Requête simple : compter les users (table vide OK)
    const count = await this.prisma.user.count();
    return `API OK — users count: ${count}`;
  }
}
