import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { ProjectsService } from "./projects.service";

describe("ProjectsService", () => {
  const prisma = {
    project: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
    projectMember: {
      findFirst: jest.fn(),
    },
    $transaction: jest.fn(),
  } as any;

  let service: ProjectsService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ProjectsService(prisma);
  });

  it("returns paginated projects with meta", async () => {
    prisma.$transaction.mockResolvedValueOnce([[{ id: "p1" }], 1]);
    const result = await service.findAllForUser("u1", { page: 1, limit: 20 });
    expect(result).toEqual({ items: [{ id: "p1" }], meta: { page: 1, limit: 20, total: 1 } });
  });

  it("throws NotFound when project is not visible", async () => {
    prisma.project.findFirst.mockResolvedValueOnce(null);
    await expect(service.findOneForUser("u1", "p1")).rejects.toBeInstanceOf(NotFoundException);
  });

  it("blocks update if role is insufficient", async () => {
    prisma.projectMember.findFirst.mockResolvedValueOnce({ role: "SUPERVISOR" });
    await expect(
      service.update("u1", "p1", { name: "X" }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });
});
