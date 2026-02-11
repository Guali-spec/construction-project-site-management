import { AdminService } from "./admin.service";

describe("AdminService - company scoping", () => {
  const prisma = {
    company: { create: jest.fn(), findMany: jest.fn(), findUnique: jest.fn(), update: jest.fn() },
    user: { findMany: jest.fn(), findUnique: jest.fn(), update: jest.fn() },
    activityLog: { create: jest.fn() },
  } as any;

  let service: AdminService;

  beforeEach(() => {
    jest.resetAllMocks();
    service = new AdminService(prisma);
  });

  it("lists pending users cross-company for SUPER_ADMIN", async () => {
    prisma.user.findMany.mockResolvedValueOnce([{ id: "u1" }]);
    const res = await service.listPendingUsers({ role: "SUPER_ADMIN" });
    expect(res).toEqual([{ id: "u1" }]);
  });

  it("lists pending users scoped for ADMIN_ENTREPRISE", async () => {
    prisma.user.findMany.mockResolvedValueOnce([{ id: "u2" }]);
    const res = await service.listPendingUsers({ role: "ADMIN_ENTREPRISE", companyId: "c1" });
    expect(res).toEqual([{ id: "u2" }]);
  });

  it("lists company users scoped", async () => {
    prisma.user.findMany.mockResolvedValueOnce([{ id: "u3" }]);
    const res = await service.listCompanyUsers({ role: "ADMIN_ENTREPRISE", companyId: "c1" });
    expect(res).toEqual([{ id: "u3" }]);
  });

  it("forbids self role change", async () => {
    await expect(
      service.assignUserRole({ id: "u1", role: "SUPER_ADMIN" }, "u1", "ADMIN_ENTREPRISE"),
    ).rejects.toBeDefined();
  });

  it("forbids role assignment outside matrix", async () => {
    prisma.user.findUnique.mockResolvedValueOnce({ id: "u2", role: "PENDING", companyId: "c1" });
    await expect(
      service.assignUserRole({ id: "u1", role: "CHEF_PROJET", companyId: "c1" }, "u2", "CHEF_PROJET"),
    ).rejects.toBeDefined();
  });

  it("forbids cross-company assignment for non super admin", async () => {
    prisma.user.findUnique.mockResolvedValueOnce({ id: "u2", role: "PENDING", companyId: "c2" });
    await expect(
      service.assignUserRole({ id: "u1", role: "ADMIN_ENTREPRISE", companyId: "c1" }, "u2", "SUPERVISEUR"),
    ).rejects.toBeDefined();
  });

  it("allows super admin role assignment", async () => {
    prisma.user.findUnique.mockResolvedValueOnce({ id: "u2", role: "PENDING", companyId: "c2" });
    prisma.user.update.mockResolvedValueOnce({ id: "u2", role: "ADMIN_ENTREPRISE" });
    prisma.activityLog.create.mockResolvedValueOnce({ id: "log1" });

    const res = await service.assignUserRole(
      { id: "u1", role: "SUPER_ADMIN" },
      "u2",
      "ADMIN_ENTREPRISE",
    );
    expect(res).toEqual({ id: "u2", role: "ADMIN_ENTREPRISE" });
  });
});
