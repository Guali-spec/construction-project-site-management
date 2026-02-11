import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const isHttp = exception instanceof HttpException;
    const status = isHttp ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const resBody = isHttp ? exception.getResponse() : null;

    if (!isHttp) {
      // Log raw unexpected errors for debugging/observability
      // eslint-disable-next-line no-console
      console.error(exception);
    }

    const message =
      typeof resBody === "string"
        ? resBody
        : (resBody as any)?.message || "Internal server error";

    const code =
      typeof resBody === "object" && (resBody as any)?.error
        ? (resBody as any).error
        : status === 500
          ? "INTERNAL_SERVER_ERROR"
          : `HTTP_${status}`;

    const details =
      typeof resBody === "object" && (resBody as any)?.message
        ? (resBody as any).message
        : undefined;

    response.status(status).json({
      code,
      message: Array.isArray(message) ? message.join(", ") : message,
      details,
      path: request.originalUrl,
      timestamp: new Date().toISOString(),
    });
  }
}
