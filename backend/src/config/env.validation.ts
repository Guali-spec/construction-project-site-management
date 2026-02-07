import * as Joi from "joi";

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string().valid("development", "test", "production").default("development"),
  PORT: Joi.number().default(3000),
  DATABASE_URL: Joi.string().uri().required(),

  JWT_ACCESS_SECRET: Joi.string().min(16).required(),
  JWT_REFRESH_SECRET: Joi.string().min(16).required(),
  JWT_ACCESS_EXPIRES_IN: Joi.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default("7d"),
  REFRESH_TOKEN_DAYS: Joi.number().integer().min(1).default(7),

  THROTTLE_TTL: Joi.number().integer().min(1).default(60),
  THROTTLE_LIMIT: Joi.number().integer().min(1).default(100),
  CORS_ORIGINS: Joi.string().default("http://localhost:3000,http://localhost:5173"),
});
