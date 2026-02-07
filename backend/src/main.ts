import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import helmet from "helmet";
import { Logger } from "nestjs-pino";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useLogger(app.get(Logger));

  app.getHttpAdapter().getInstance().set("trust proxy", 1);

  app.use(
    helmet({
      contentSecurityPolicy: process.env.NODE_ENV === "production" ? undefined : false,
    }),
  );

  const corsOriginsRaw = process.env.CORS_ORIGINS ?? "http://localhost:3000,http://localhost:5173";
  const corsOrigins = corsOriginsRaw
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);

  app.enableCors({
    origin: corsOrigins,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Authorization", "Content-Type"],
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle("Construction Project & Site Management API")
    .setVersion("1.0")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        in: "header",
        name: "Authorization",
      },
      "access-token",
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(parseInt(process.env.PORT ?? "3000", 10));
}
bootstrap();
