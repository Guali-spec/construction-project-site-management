import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { ProjectsMembersService } from "./projects-members.service";

describe("ProjectsMembersService", () => {
  const prisma = {
    projectMember: {
      count: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
  } as any;

  let service: ProjectsMembersService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ProjectsMembersService(prisma);
  });

  it("blocks adding member as OWNER", async () => {
    prisma.projectMember.findFirst.mockResolvedValueOnce({ role: "OWNER" });
    await expect(
      service.addMember("actor", "project", "test@example.com", "OWNER"),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it("blocks demoting the last OWNER", async () => {
    prisma.projectMember.findFirst
      .mockResolvedValueOnce({ role: "OWNER" }) // actor role
      .mockResolvedValueOnce({ role: "OWNER" }) // target role
      .mockResolvedValueOnce({ id: "m1" }); // member for update
    prisma.projectMember.count.mockResolvedValueOnce(1);

    await expect(
      service.changeRole("actor", "project", "target", "MANAGER"),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it("blocks removing the last OWNER", async () => {
    prisma.projectMember.findFirst
      .mockResolvedValueOnce({ role: "OWNER" }) // actor role
      .mockResolvedValueOnce({ role: "OWNER", userId: "target" }) // target
      .mockResolvedValueOnce({ id: "m1" }); // member for delete
    prisma.projectMember.count.mockResolvedValueOnce(1);

    await expect(
      service.removeMember("actor", "project", "target"),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it("revives a soft-deleted member instead of creating a new one", async () => {
    prisma.projectMember.findFirst
      .mockResolvedValueOnce({ role: "OWNER" }) // actor role
      .mockResolvedValueOnce(null) // existing active
      .mockResolvedValueOnce({ id: "soft-1" }); // soft-deleted

    prisma.user.findUnique.mockResolvedValueOnce({ id: "u1" });
    prisma.projectMember.update.mockResolvedValueOnce({ id: "soft-1" });

    const result = await service.addMember("actor", "project", "a@b.com", "WORKER");
    expect(result).toEqual({ id: "soft-1" });
  });

  it("throws if actor is not a member", async () => {
    prisma.projectMember.findFirst.mockResolvedValueOnce(null);
    await expect(
      service.addMember("actor", "project", "a@b.com", "WORKER"),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
