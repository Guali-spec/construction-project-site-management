import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ActivityLogInterceptor implements NestInterceptor {
  constructor(private readonly prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const method = req.method as string;

    if (["GET", "HEAD", "OPTIONS"].includes(method)) {
      return next.handle();
    }

    return next.handle().pipe(
      tap((data) => {
        const userId = req.user?.sub;
        if (!userId) return;

        const projectId =
          req.params?.projectId || req.body?.projectId || req.query?.projectId || null;

        const entityType = this.resolveEntityType(req.originalUrl || "");
        const entityId = this.resolveEntityId(data);

        void this.prisma.activityLog.create({
          data: {
            userId,
            projectId,
            action: method,
            entityType,
            entityId,
            details: { path: req.originalUrl },
            ipAddress: req.ip,
          },
        });
      }),
    );
  }

  private resolveEntityType(url: string): string {
    const path = url.split("?")[0];
    const parts = path.split("/").filter(Boolean);
    if (parts.length === 0) return "unknown";

    if (parts[0] === "projects") {
      if (parts[2] === "phases") return "phase";
      if (parts[2] === "workers") return "worker";
      if (parts[2] === "members") return "project_member";
      if (parts[2] === "lots") return "lot";
      if (parts[2] === "tasks") return "task";
      if (parts[4] === "lots") return "lot";
      if (parts[4] === "tasks") return "task";
      return "project";
    }

    return parts[0];
  }

  private resolveEntityId(data: any): string | null {
    if (!data || Array.isArray(data)) return null;
    if (typeof data === "object" && typeof data.id === "string") return data.id;
    return null;
  }
}
