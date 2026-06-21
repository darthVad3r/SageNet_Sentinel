# API Monitoring & Logging Setup

This document describes the production monitoring and logging infrastructure for the workflow API.

## Overview

The API includes comprehensive logging for:

- **Request/Response Metrics** - Method, path, status code, duration
- **Authentication Events** - Token validation attempts
- **Database Operations** - Query performance and errors
- **Error Tracking** - Exception details and context

## Structured Logging

All logs are output in JSON format for easy parsing by logging services:

```json
{
  "timestamp": "2026-06-15T12:30:00.000Z",
  "level": "info",
  "service": "workflow-api",
  "operation": "POST /api/workflows",
  "message": "Request completed",
  "statusCode": 201,
  "durationMs": 245,
  "requestId": "req-1718456400000-abc12345",
  "context": {
    "userId": "user-123"
  }
}
```

## Request Tracing

Each request receives a unique ID for tracking across logs:

```
X-Request-ID: req-1718456400000-abc12345
```

This allows correlating all logs for a single request across services.

## Metrics to Monitor

### Response Times

Track p50, p95, p99 percentiles:

- **Good:** < 200ms p95
- **Warning:** 200-500ms p95
- **Critical:** > 500ms p95

### Error Rates

Monitor by endpoint and error type:

```
/api/workflows GET    - Target: 99.9% success
/api/workflows POST   - Target: 99.5% success (higher due to validation)
/api/dashboard/*      - Target: 99.9% success
```

### Authentication Failures

```
auth:token_validation failed count - Alert if > 1% of requests
```

### Database Performance

```
db:select on workflows        - Monitor duration
db:insert on workflow_runs    - Monitor duration
db:update on workflows        - Monitor duration
```

## Production Logging Services Integration

### Option 1: Vercel Analytics (Built-in)

Vercel provides basic monitoring via:

- Edge metrics (response times, status codes)
- Function cold starts
- Memory usage

Access via Vercel Dashboard → Project → Analytics

### Option 2: Sentry (Recommended for Errors)

```typescript
// Add to api/_shared/logger.ts
import * as Sentry from '@sentry/vercel-edge';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
});

// In ApiLogger.writeLog()
if (entry.level === 'error') {
  Sentry.captureException(new Error(entry.message), {
    extra: entry.context,
    tags: {
      service: entry.service,
      operation: entry.operation,
      requestId: entry.requestId,
    },
    level: 'error',
  });
}
```

**Setup:**

1. Create Sentry account at https://sentry.io
2. Create project for Node.js
3. Set `SENTRY_DSN` environment variable
4. Install: `npm install @sentry/vercel-edge`

### Option 3: DataDog (Recommended for Full Stack)

```typescript
// Add to api/_shared/logger.ts
import { v4 as uuidv4 } from 'uuid';

const tracer = require('dd-trace');
tracer.init();

// In ApiLogger.writeLog()
const log = {
  timestamp: entry.timestamp,
  dd: {
    service: entry.service,
    version: '1.0.0',
    env: process.env.NODE_ENV,
    trace_id: entry.requestId,
  },
  level: entry.level,
  operation: entry.operation,
  message: entry.message,
  ...entry.context,
};

console.log(JSON.stringify(log));
```

**Setup:**

1. Create DataDog account
2. Install Agent: `npm install datadog-browser-logs`
3. Configure with API key
4. Set up dashboards for workflows API

### Option 4: Self-Hosted (ELK Stack)

For on-premise logging:

1. **Elasticsearch** - Data storage
2. **Logstash** - Log ingestion pipeline
3. **Kibana** - Visualization

Send logs via HTTP:

```typescript
const logEntry = {
  /* ... */
};
await fetch('https://logstash.example.com/logs', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(logEntry),
});
```

## Alert Rules

### Critical Alerts

Set up alerts for:

1. **Error Rate > 5%**
   - Condition: `errors / total_requests > 0.05`
   - Action: Page on-call engineer

2. **Response Time p99 > 1s**
   - Condition: `p99_duration > 1000ms`
   - Action: Notify team, investigate performance

3. **Authentication Failures > 10 in 5 min**
   - Condition: `auth_failures > 10` (rolling 5m window)
   - Action: Check for security incident

4. **Database Query > 5s**
   - Condition: `db_query_duration > 5000ms`
   - Action: Investigate slow queries, consider optimization

### Warning Alerts

1. **Error Rate > 1%**
   - Condition: `errors / total_requests > 0.01`
   - Action: Investigate

2. **Response Time p95 > 500ms**
   - Condition: `p95_duration > 500ms`
   - Action: Monitor, investigate if sustained

3. **Cold Starts > 3s**
   - Condition: `cold_start_duration > 3000ms`
   - Action: Consider warmer, monitor trends

## Dashboard Setup

### Key Metrics Dashboard

Display on team dashboard:

```
┌─────────────────────────────────────────┐
│ Workflow API - Last 24 Hours            │
├─────────────────────────────────────────┤
│ Total Requests: 45,231                  │
│ Success Rate:   99.8%                   │
│ Error Rate:     0.2%                    │
│ p95 Duration:   156ms                   │
│ p99 Duration:   289ms                   │
│ Cold Starts:    3                       │
├─────────────────────────────────────────┤
│ By Endpoint:                            │
│ GET /workflows      10.2K req (99.9%)   │
│ POST /workflows      3.1K req (98.5%)   │
│ PUT /workflows       1.8K req (99.1%)   │
│ GET /runs           28.4K req (99.9%)   │
│ POST /runs           1.6K req (99.4%)   │
│ GET /dashboard       0.1K req (100%)    │
├─────────────────────────────────────────┤
│ Errors (last 6 hours):                  │
│ 401 Unauthorized:    3                  │
│ 404 Not Found:       8                  │
│ 500 Internal Error:  2                  │
└─────────────────────────────────────────┘
```

## Log Querying Examples

### Find All Errors in Last Hour

```
level:error AND timestamp:[now-1h TO now]
```

### Find Slow Requests

```
durationMs > 1000 AND timestamp:[now-1d TO now]
```

### Find Failed Auth Attempts

```
operation:auth AND level:warn AND timestamp:[now-1h TO now]
```

### Find Requests by User

```
context.userId:"user-123" AND timestamp:[now-1d TO now]
```

### Find Requests by Request ID (for debugging)

```
requestId:"req-1718456400000-abc12345"
```

## Local Development

In development, logs are pretty-printed to console:

```
[2026-06-15T12:30:00.000Z] [INFO] workflow-api/workflows: Incoming POST /api/workflows
[2026-06-15T12:30:00.245Z] [INFO] workflow-api/POST /api/workflows: Request completed
  Duration: 245ms
```

Use `NODE_ENV=production` to test JSON output:

```bash
NODE_ENV=production npm run dev
```

## Performance Baseline

Expected performance under normal load:

| Operation                  | p50   | p95   | p99   |
| -------------------------- | ----- | ----- | ----- |
| GET /workflows             | 45ms  | 120ms | 250ms |
| POST /workflows            | 85ms  | 200ms | 450ms |
| PUT /workflows             | 75ms  | 180ms | 400ms |
| GET /runs                  | 55ms  | 150ms | 300ms |
| POST /runs                 | 95ms  | 220ms | 500ms |
| GET /dashboard/summary     | 120ms | 300ms | 600ms |
| GET /dashboard/recent-runs | 75ms  | 180ms | 400ms |

## Troubleshooting

### High Error Rate

1. Check recent deployments
2. Review error logs for patterns
3. Check database connectivity (Supabase status)
4. Verify environment variables are set
5. Check for rate limiting (429 errors)

### Slow Requests

1. Check database query performance
2. Monitor Vercel cold starts
3. Profile endpoints locally
4. Check for N+1 queries
5. Review Supabase connection pool

### Authentication Issues

1. Verify SUPABASE_ANON_KEY is correct
2. Check token expiration
3. Verify token format (Bearer <token>)
4. Check Supabase project health

### Memory Leaks

1. Monitor function memory usage over time
2. Check for unclosed database connections
3. Review error handlers (ensure cleanup)
4. Consider function memory size adjustment

## Next Steps

1. Integrate with error tracking service (Sentry recommended)
2. Set up production dashboards
3. Configure alert rules and thresholds
4. Establish on-call rotation
5. Define incident response procedures
