import "dotenv/config";

export default {
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasources: {
    db: {
      provider: "sqlite",
      url: "file:./dev.db",
    },
  },
};
