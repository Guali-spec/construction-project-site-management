import { Test } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import request from "supertest";
import { AppModule } from "../src/app.module";
import { PrismaService } from "../src/prisma/prisma.service";

describe("E2E: Auth + Projects + Tasks", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    const prisma = app.get(PrismaService);
    if (prisma?.$disconnect) {
      await prisma.$disconnect();
    }
    await app.close();
  });

  it("registers, logs in, creates project and task flow", async () => {
    const suffix = Date.now();
    const email = `e2e_${suffix}@test.com`;
    const password = "StrongPass123!";

    // Register
    await request(app.getHttpServer())
      .post("/auth/register")
      .send({ email, password, firstName: "E2E", lastName: "User" })
      .expect(201);

    // Login
    const loginRes = await request(app.getHttpServer())
      .post("/auth/login")
      .send({ email, password })
      .expect(201);

    const accessToken = loginRes.body?.accessToken;
    expect(accessToken).toBeDefined();

    // Create project
    const projectRes = await request(app.getHttpServer())
      .post("/projects")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ name: `Project ${suffix}` })
      .expect(201);

    const projectId = projectRes.body?.id;
    expect(projectId).toBeDefined();

    // Create phase
    const phaseRes = await request(app.getHttpServer())
      .post(`/projects/${projectId}/phases`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ name: "Phase 1", order: 1 })
      .expect(201);

    const phaseId = phaseRes.body?.id;
    expect(phaseId).toBeDefined();

    // Create lot
    const lotRes = await request(app.getHttpServer())
      .post(`/projects/${projectId}/phases/${phaseId}/lots`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ name: "Lot 1", order: 1 })
      .expect(201);

    const lotId = lotRes.body?.id;
    expect(lotId).toBeDefined();

    // Create worker
    const workerRes = await request(app.getHttpServer())
      .post(`/projects/${projectId}/workers`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ firstName: "John", lastName: "Doe" })
      .expect(201);

    const workerId = workerRes.body?.id;
    expect(workerId).toBeDefined();

    // Create task assigned to worker
    const taskRes = await request(app.getHttpServer())
      .post(`/projects/${projectId}/lots/${lotId}/tasks`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ name: "Task 1", assignedWorkerId: workerId })
      .expect(201);

    const taskId = taskRes.body?.id;
    expect(taskId).toBeDefined();

    // Fetch tasks list (paginated)
    const tasksList = await request(app.getHttpServer())
      .get(`/projects/${projectId}/lots/${lotId}/tasks?page=1&limit=10`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);

    expect(tasksList.body?.items?.length).toBeGreaterThanOrEqual(1);

    // Fetch task detail
    await request(app.getHttpServer())
      .get(`/projects/${projectId}/lots/${lotId}/tasks/${taskId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);
  }, 30000);
});
