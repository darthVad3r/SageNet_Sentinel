import type { VercelRequest, VercelResponse } from '@vercel/node';

export interface LogEntry {
  readonly timestamp: string;
  readonly level: 'info' | 'warn' | 'error';
  readonly service: string;
  readonly operation: string;
  readonly message: string;
  readonly requestId?: string;
  readonly statusCode?: number;
  readonly duration?: number;
  readonly error?: string;
  readonly context?: Record<string, unknown>;
}

export interface RequestMetrics {
  readonly method: string;
  readonly path: string;
  readonly statusCode: number;
  readonly duration: number;
  readonly userId?: string;
  readonly error?: string;
}

/**
 * Central logging utility for API endpoints.
 * Provides structured logging with context and metrics tracking.
 */
export class ApiLogger {
  private static readonly SERVICE_NAME = 'workflow-api';

  /**
   * Log an info-level message with optional context
   */
  static logInfo(
    operation: string,
    message: string,
    context?: Record<string, unknown>,
    requestId?: string
  ): void {
    ApiLogger.writeLog({
      timestamp: new Date().toISOString(),
      level: 'info',
      service: ApiLogger.SERVICE_NAME,
      operation,
      message,
      requestId,
      context,
    });
  }

  /**
   * Log a warning-level message (e.g., unusual but handled situation)
   */
  static logWarn(
    operation: string,
    message: string,
    context?: Record<string, unknown>,
    requestId?: string
  ): void {
    ApiLogger.writeLog({
      timestamp: new Date().toISOString(),
      level: 'warn',
      service: ApiLogger.SERVICE_NAME,
      operation,
      message,
      requestId,
      context,
    });
  }

  /**
   * Log an error-level message with error details
   */
  static logError(
    operation: string,
    message: string,
    error?: Error,
    context?: Record<string, unknown>,
    requestId?: string
  ): void {
    ApiLogger.writeLog({
      timestamp: new Date().toISOString(),
      level: 'error',
      service: ApiLogger.SERVICE_NAME,
      operation,
      message,
      error: error?.message,
      requestId,
      context,
    });
  }

  /**
   * Log API request metrics (method, path, status, duration)
   */
  static logRequestMetrics(metrics: RequestMetrics, requestId?: string): void {
    const logMessage =
      metrics.statusCode >= 400
        ? `Request failed: ${metrics.method} ${metrics.path}`
        : `Request completed: ${metrics.method} ${metrics.path}`;

    ApiLogger.writeLog({
      timestamp: new Date().toISOString(),
      level: metrics.statusCode >= 500 ? 'error' : metrics.statusCode >= 400 ? 'warn' : 'info',
      service: ApiLogger.SERVICE_NAME,
      operation: `${metrics.method} ${metrics.path}`,
      message: logMessage,
      statusCode: metrics.statusCode,
      duration: metrics.duration,
      requestId,
      context: {
        userId: metrics.userId,
        error: metrics.error,
      },
    });
  }

  /**
   * Extract or generate a unique request ID from headers
   */
  static getRequestId(req: VercelRequest): string {
    const headerValue = req.headers['x-request-id'];
    if (typeof headerValue === 'string') {
      return headerValue;
    }

    // Generate a new request ID if not provided
    return `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Create a middleware function to log all requests
   */
  static createRequestLogger(operation: string) {
    return (req: VercelRequest, res: VercelResponse) => {
      const startTime = Date.now();
      const requestId = ApiLogger.getRequestId(req);
      const method = req.method ?? 'UNKNOWN';
      const path = req.url ?? '/';

      // Log incoming request
      ApiLogger.logInfo(
        operation,
        `Incoming ${method} ${path}`,
        {
          path,
          method,
          contentType: req.headers['content-type'],
        },
        requestId
      );

      // Capture original res.end to log response
      const originalEnd = res.end.bind(res);
      res.end = ((chunk?: unknown, encoding?: BufferEncoding, cb?: () => void) => {
        const duration = Date.now() - startTime;
        const status = res.statusCode;

        ApiLogger.logRequestMetrics(
          {
            method,
            path,
            statusCode: status,
            duration,
          },
          requestId
        );

        return originalEnd(chunk as never, encoding as never, cb);
      }) as typeof res.end;

      // Add requestId to response headers for tracing
      res.setHeader('X-Request-ID', requestId);
    };
  }

  /**
   * Format logs for structured logging (JSON for production, pretty for dev)
   */
  private static writeLog(entry: LogEntry): void {
    const isDev = process.env['NODE_ENV'] === 'development';

    if (isDev) {
      // Pretty print for development
      console.log(
        `[${entry.timestamp}] [${entry.level.toUpperCase()}] ${entry.service}/${entry.operation}: ${entry.message}`
      );
      if (entry.error) {
        console.error('  Error:', entry.error);
      }
      if (entry.context) {
        console.log('  Context:', JSON.stringify(entry.context, null, 2));
      }
      if (entry.duration) {
        console.log(`  Duration: ${entry.duration}ms`);
      }
    } else {
      // JSON structured logging for production (compatible with cloud logging)
      const logOutput = {
        timestamp: entry.timestamp,
        level: entry.level,
        service: entry.service,
        operation: entry.operation,
        message: entry.message,
        requestId: entry.requestId,
        statusCode: entry.statusCode,
        durationMs: entry.duration,
        error: entry.error,
        context: entry.context,
      };

      console.log(JSON.stringify(logOutput));
    }

    // TODO: Send to external logging service (Sentry, DataDog, etc.)
    // if (entry.level === 'error') {
    //   sentryClient.captureException(new Error(entry.message), {
    //     extra: entry.context,
    //     tags: { service: entry.service, operation: entry.operation },
    //   });
    // }
  }
}

/**
 * Logger specifically for database operations
 */
export class DbLogger {
  static logQuery(operation: string, table: string, duration: number, requestId?: string): void {
    ApiLogger.logInfo(
      `db:${operation}`,
      `Database query completed on ${table}`,
      {
        table,
        operation,
        durationMs: duration,
      },
      requestId
    );
  }

  static logQueryError(operation: string, table: string, error: string, requestId?: string): void {
    ApiLogger.logError(
      `db:${operation}`,
      `Database query failed on ${table}`,
      new Error(error),
      { table, operation },
      requestId
    );
  }
}

/**
 * Logger for authentication events
 */
export class AuthLogger {
  static logTokenValidation(isValid: boolean, requestId?: string): void {
    if (isValid) {
      ApiLogger.logInfo(
        'auth:token_validation',
        'Bearer token validated successfully',
        {},
        requestId
      );
    } else {
      ApiLogger.logWarn('auth:token_validation', 'Bearer token validation failed', {}, requestId);
    }
  }

  static logAuthError(error: string, requestId?: string): void {
    ApiLogger.logError('auth', 'Authentication failed', new Error(error), {}, requestId);
  }
}
