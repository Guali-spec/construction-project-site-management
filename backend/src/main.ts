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

  // CORS : autoriser le frontend Next.js (généralement sur 3000 ou 3001)
  app.enableCors({
    origin: (origin, callback) => {
      console.log('CORS - Origin reçue:', origin);
      // En développement, autoriser localhost, 127.0.0.1 et les adresses IP locales
      if (!origin || 
          origin.startsWith('http://localhost:') || 
          origin.startsWith('http://127.0.0.1:') ||
          origin.startsWith('http://192.168.') ||
          origin.startsWith('http://10.') ||
          origin.startsWith('http://172.')) {
        console.log('CORS - Autorisée pour:', origin);
        callback(null, true);
      } else {
        console.log('CORS - Refusée pour:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS", "PUT"],
    allowedHeaders: ["Authorization", "Content-Type", "X-Requested-With"],
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

  const port = parseInt(process.env.PORT ?? "3000", 10);
  await app.listen(port);
  console.log(`🚀 Backend démarré sur http://localhost:${port}`);
  console.log(`📚 Documentation Swagger: http://localhost:${port}/docs`);
}
bootstrap();
