import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class CompanyScopeGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const user = req.user;

    // Public routes (no user attached)
    if (!user) return true;

    if (user.role === "SUPER_ADMIN") {
      return true;
    }

    if (!user.companyId) {
      throw new UnauthorizedException("Company scope missing");
    }

    req.companyId = user.companyId;
    return true;
  }
}
