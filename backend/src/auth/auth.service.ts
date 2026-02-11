import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import { PrismaService } from "../prisma/prisma.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import type { SignOptions } from "jsonwebtoken";

type JwtPayload = { sub: string; email: string; role: string; companyId: string | null };

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  private accessSecret() {
    return process.env.JWT_ACCESS_SECRET!;
  }
  private refreshSecret() {
    return process.env.JWT_REFRESH_SECRET!;
  }
    private accessExpiresIn(): SignOptions["expiresIn"] {
    return (process.env.JWT_ACCESS_EXPIRES_IN || "15m") as SignOptions["expiresIn"];
  }

  private refreshExpiresIn(): SignOptions["expiresIn"] {
    return (process.env.JWT_REFRESH_EXPIRES_IN || "7d") as SignOptions["expiresIn"];
  }


  private async signAccessToken(payload: JwtPayload) {
    return this.jwt.signAsync(payload, {
      secret: this.accessSecret(),
      expiresIn: this.accessExpiresIn(),
    });
  }

  private async signRefreshToken(payload: JwtPayload, jti: string) {
    // On inclut jti dans le refresh token pour retrouver le record DB
    return this.jwt.signAsync({ ...payload, jti }, {
      secret: this.refreshSecret(),
      expiresIn: this.refreshExpiresIn(),
    });
  }

   private computeRefreshExpiryDate(): Date {
    const daysRaw = process.env.REFRESH_TOKEN_DAYS || "7";
    const days = Number.parseInt(daysRaw, 10);
    const safeDays = Number.isFinite(days) && days > 0 ? days : 7;

    const expires = new Date();
    expires.setDate(expires.getDate() + safeDays);
    return expires;
  }


  private async getDefaultCompanyId(): Promise<string> {
    const existing = await this.prisma.company.findUnique({ where: { slug: "default" } });
    if (existing) return existing.id;

    const created = await this.prisma.company.create({
      data: { name: "Default", slug: "default" },
    });
    return created.id;
  }

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new BadRequestException("Email already in use");

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const companyId = await this.getDefaultCompanyId();

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        companyId,
        requestedRole: dto.requestedRole ?? null,
      },
    });

    return this.issueTokens(user.id, user.email, user.role, user.companyId ?? null);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException("Invalid credentials");

    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) throw new UnauthorizedException("Invalid credentials");

    return this.issueTokens(user.id, user.email, user.role, user.companyId ?? null);
  }

  private async issueTokens(userId: string, email: string, role: string, companyId: string | null) {
    const payload: JwtPayload = { sub: userId, email, role, companyId };

    const accessToken = await this.signAccessToken(payload);

    const jti = randomUUID();
    const refreshToken = await this.signRefreshToken(payload, jti);
    const tokenHash = await bcrypt.hash(refreshToken, 10);

    // Stockage DB du refresh (hashé)
    await this.prisma.refreshToken.create({
      data: {
        userId,
        jti,
        tokenHash,
        expiresAt: this.computeRefreshExpiryDate(),
      },
    });

    return { accessToken, refreshToken };
  }

  async refresh(refreshToken: string) {
    // 1) Vérifier signature refresh token
    let decoded: any;
    try {
      decoded = await this.jwt.verifyAsync(refreshToken, { secret: this.refreshSecret() });
    } catch {
      throw new UnauthorizedException("Invalid refresh token");
    }

    const userId = decoded?.sub as string | undefined;
    const jti = decoded?.jti as string | undefined;
    if (!userId || !jti) throw new UnauthorizedException("Invalid refresh token");

    // 2) Charger record DB
    const record = await this.prisma.refreshToken.findUnique({ where: { jti } });
    if (!record) throw new UnauthorizedException("Refresh token not recognized");

    // 3) Si révoqué ou expiré => refuse
    if (record.revokedAt) throw new UnauthorizedException("Refresh token revoked");
    if (record.expiresAt.getTime() < Date.now()) throw new UnauthorizedException("Refresh token expired");

    // 4) Comparer le token envoyé au hash stocké
    const match = await bcrypt.compare(refreshToken, record.tokenHash);
    if (!match) {
      // Anti-reuse: si quelqu’un réutilise un refresh token différent avec le même jti → on révoque toute la famille de tokens de cet utilisateur
      await this.prisma.refreshToken.updateMany({
        where: { userId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
      throw new UnauthorizedException("Refresh token reuse detected. Session revoked.");
    }

    // 5) Rotation: on révoque l’ancien, on génère un nouveau
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException("User not found");

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      companyId: user.companyId ?? null,
    };

    const newAccessToken = await this.signAccessToken(payload);

    const newJti = randomUUID();
    const newRefreshToken = await this.signRefreshToken(payload, newJti);
    const newHash = await bcrypt.hash(newRefreshToken, 10);

    const newRecord = await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        jti: newJti,
        tokenHash: newHash,
        expiresAt: this.computeRefreshExpiryDate(),
      },
    });

    await this.prisma.refreshToken.update({
      where: { id: record.id },
      data: { revokedAt: new Date(), replacedBy: newRecord.id },
    });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async logout(refreshToken: string) {
    // On révoque le refresh token courant (si valide)
    let decoded: any;
    try {
      decoded = await this.jwt.verifyAsync(refreshToken, { secret: this.refreshSecret() });
    } catch {
      // même si token invalide, on répond OK (ne pas leak d’info)
      return { success: true };
    }

    const jti = decoded?.jti as string | undefined;
    if (!jti) return { success: true };

    await this.prisma.refreshToken.updateMany({
      where: { jti, revokedAt: null },
      data: { revokedAt: new Date() },
    });

    return { success: true };
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, deletedAt: null },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        requestedRole: true,
        phone: true,
        avatar: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) throw new NotFoundException("User not found");
    return user;
  }
}
