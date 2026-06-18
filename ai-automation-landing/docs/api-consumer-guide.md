# Workflow API Consumer Guide

This guide provides comprehensive examples and best practices for consuming the workflow and dashboard APIs.

## Quick Start

### 1. Get Authentication Token

First, authenticate with Supabase to get a JWT token:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://dkukhtfakrkuyevyocrw.supabase.co', 'your-anon-key');

const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password',
});

const token = data.session?.access_token; // Use this in Authorization header
```

### 2. Create a Workflow

```typescript
const response = await fetch('https://your-app.vercel.app/api/workflows', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    name: 'Lead Qualification Flow',
    description: 'Automated lead scoring and routing',
    client: 'Acme Corp',
    stage: 'implementation',
    status: 'active',
    steps: [
      {
        type: 'manual',
        owner: 'Sales Team',
        description: 'Receive lead submission form',
      },
      {
        type: 'automated',
        owner: 'API',
        description: 'Validate email and phone',
      },
      {
        type: 'automated',
        owner: 'AI Engine',
        description: 'Score lead based on profile',
      },
      {
        type: 'manual',
        owner: 'SDR',
        description: 'Call qualified leads',
      },
    ],
  }),
});

const workflow = await response.json();
console.log('Created workflow:', workflow.data.id);
```

### 3. Trigger a Run

```typescript
const runResponse = await fetch(`https://your-app.vercel.app/api/workflows/${workflowId}/runs`, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({}),
});

const run = await runResponse.json();
console.log('Started run:', run.data.id, run.data.status); // 'queued'
```

### 4. Check Dashboard Stats

```typescript
const dashResponse = await fetch('https://your-app.vercel.app/api/dashboard/summary', {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const dashboard = await dashResponse.json();
console.log('Active workflows:', dashboard.data.activeWorkflowCount);
console.log('Queued runs:', dashboard.data.queuedRunCount);
console.log('By stage:', dashboard.data.workflowsByStage);
```

### 5. Read Recent Run Activity (Paginated)

```typescript
const recentRunsResponse = await fetch(
  'https://your-app.vercel.app/api/dashboard/recent-runs?page=1&pageSize=10',
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

const recentRunsEnvelope = await recentRunsResponse.json();
console.log('Total runs:', recentRunsEnvelope.data.total);
console.log('Current page:', recentRunsEnvelope.data.page);
console.log('Page size:', recentRunsEnvelope.data.pageSize);
console.log('Rows on page:', recentRunsEnvelope.data.data.length);
```

## Using the Angular Service

If you're using the provided Angular service:

```typescript
import { WorkflowService } from '@app/core/services/workflow.service';
import { inject } from '@angular/core';

export class WorkflowManagerComponent {
  private workflowService = inject(WorkflowService);

  async createWorkflow() {
    try {
      const workflow = await this.workflowService.createWorkflow({
        name: 'My Workflow',
        description: 'Description',
        client: 'Client Name',
        stage: 'discovery',
        status: 'active',
        steps: [
          {
            type: 'manual',
            owner: 'Someone',
            description: 'Do something',
          },
        ],
      });
      console.log('Created:', workflow.id);
    } catch (error) {
      console.error('Failed:', error.message);
    }
  }

  async listWorkflows() {
    const workflows = await this.workflowService.listWorkflows();
    console.log('Found', workflows.length, 'workflows');
  }

  async triggerRun(workflowId: string) {
    const run = await this.workflowService.triggerRun(workflowId);
    console.log('Run triggered:', run.id, 'status:', run.status);
  }

  async checkRuns(workflowId: string) {
    const page = await this.workflowService.listRuns(workflowId, 1, 20);
    console.log('Total runs:', page.total);
    console.log('First page:', page.data.length);
  }
}
```

## Common Patterns

### Pagination

Get paginated results with custom page size:

```typescript
// Get page 2 with 25 items per page
const page = await fetch('https://api.example.com/api/workflows/123/runs?page=2&pageSize=25', {
  headers: { Authorization: `Bearer ${token}` },
});
```

**Important:** `pageSize` is capped at 50. Larger values will be ignored.

### Workflow Lifecycle

Track workflow stage progression:

```typescript
// Get the workflow with full history
const response = await fetch('https://api.example.com/api/workflows/123', {
  headers: { Authorization: `Bearer ${token}` },
});

const workflow = await response.json();

// Access stage history
for (const change of workflow.data.stageHistory) {
  console.log(`${change.stage} on ${change.changedAt} by ${change.actor}`);
}
```

### Batch Operations

Create multiple workflows efficiently:

```typescript
const workflowConfigs = [
  { name: 'Flow 1', ... },
  { name: 'Flow 2', ... },
  { name: 'Flow 3', ... },
];

// Create in parallel
const promises = workflowConfigs.map(config =>
  workflowService.createWorkflow(config)
);

const results = await Promise.all(promises);
console.log('Created', results.length, 'workflows');
```

### Error Handling

Handle various error scenarios:

```typescript
try {
  const workflow = await workflowService.createWorkflow(input);
} catch (error) {
  if (error.message.includes('Unauthorized')) {
    console.error('Token expired or invalid');
    // Refresh token and retry
  } else if (error.message.includes('not found')) {
    console.error('Workflow does not exist');
  } else if (error.message.includes('stages must be')) {
    console.error('Invalid stage value');
  } else {
    console.error('Unexpected error:', error.message);
  }
}
```

## Response Examples

### Successful Workflow Creation

```json
{
  "schemaVersion": "2026-06-14",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Lead Qualification",
    "description": "Score and route leads",
    "client": "Acme",
    "stage": "discovery",
    "status": "active",
    "createdAt": "2026-06-15T10:30:00.000Z",
    "updatedAt": "2026-06-15T10:30:00.000Z",
    "steps": [
      {
        "id": "uuid",
        "order": 0,
        "type": "manual",
        "owner": "Sales",
        "description": "Receive submission"
      }
    ],
    "stageHistory": [
      {
        "stage": "discovery",
        "changedAt": "2026-06-15T10:30:00.000Z",
        "actor": "api"
      }
    ]
  }
}
```

### Dashboard Summary Response

```json
{
  "schemaVersion": "2026-06-14",
  "data": {
    "leadCount": 42,
    "workflowCount": 5,
    "activeWorkflowCount": 4,
    "queuedRunCount": 2,
    "runningRunCount": 1,
    "succeededRunCount": 89,
    "failedRunCount": 3,
    "workflowsByStage": [
      { "stage": "discovery", "count": 2 },
      { "stage": "implementation", "count": 2 },
      { "stage": "testing", "count": 1 },
      { "stage": "live", "count": 0 },
      { "stage": "paused", "count": 0 }
    ]
  }
}
```

### Dashboard Recent Runs Response

```json
{
  "schemaVersion": "2026-06-14",
  "data": {
    "total": 128,
    "page": 2,
    "pageSize": 10,
    "data": [
      {
        "runId": "run-123",
        "workflowId": "wf-123",
        "workflowName": "Lead Qualification",
        "status": "succeeded",
        "triggeredAt": "2026-06-15T12:30:00.000Z",
        "completedAt": "2026-06-15T12:30:45.000Z"
      }
    ]
  }
}
```

### Error Response

```json
{
  "error": "Workflow not found."
}
```

## Best Practices

### 1. Token Management

- Store tokens securely (use httpOnly cookies in browsers)
- Implement token refresh logic before expiration
- Don't log or expose tokens in error messages

```typescript
async function getValidToken() {
  const tokenExpiry = localStorage.getItem('tokenExpiry');
  if (Date.now() > parseInt(tokenExpiry || '0')) {
    // Token expired, refresh it
    return await refreshToken();
  }
  return localStorage.getItem('token');
}
```

### 2. Error Recovery

- Implement exponential backoff for transient failures
- Log errors with request context for debugging
- Provide user-friendly error messages

```typescript
async function callApiWithRetry(url: string, options: RequestInit, maxRetries = 3) {
  let lastError;
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.status === 500 && i < maxRetries - 1) {
        // Retry on server error
        await new Promise((r) => setTimeout(r, 1000 * Math.pow(2, i)));
        continue;
      }
      return response;
    } catch (error) {
      lastError = error;
      if (i < maxRetries - 1) {
        await new Promise((r) => setTimeout(r, 1000 * Math.pow(2, i)));
      }
    }
  }
  throw lastError;
}
```

### 3. Data Validation

- Validate input before sending to API
- Check response envelope structure
- Handle unexpected data gracefully

```typescript
function validateWorkflowInput(input: unknown): WorkflowInput {
  if (!input || typeof input !== 'object') {
    throw new Error('Invalid input');
  }

  const obj = input as Record<string, unknown>;
  if (typeof obj.name !== 'string' || !obj.name.trim()) {
    throw new Error('Name is required');
  }

  if (!Array.isArray(obj.steps) || obj.steps.length === 0) {
    throw new Error('At least one step is required');
  }

  return obj as WorkflowInput;
}
```

### 4. Performance

- Use pagination for large result sets (max pageSize: 50)
- Batch operations when creating multiple workflows
- Avoid polling; use event subscriptions if available

```typescript
// Bad: Sequential calls
for (const config of configs) {
  const workflow = await this.workflowService.createWorkflow(config);
}

// Good: Parallel calls
const workflows = await Promise.all(
  configs.map((config) => this.workflowService.createWorkflow(config))
);
```

### 5. Monitoring

- Log API requests and responses (exclude sensitive data)
- Track response times and error rates
- Set up alerts for endpoint failures

```typescript
class ApiLogger {
  logRequest(url: string, method: string) {
    const start = Date.now();
    return () => {
      const duration = Date.now() - start;
      console.log(`[API] ${method} ${url} took ${duration}ms`);
    };
  }
}
```

## Troubleshooting

### 401 Unauthorized

**Cause:** Missing or invalid Bearer token

**Solution:**

```typescript
// Ensure token is fresh
const token = await getValidToken();
const headers = {
  Authorization: `Bearer ${token}`,
};
```

### 404 Not Found

**Cause:** Workflow doesn't exist or workflow ID is wrong

**Solution:**

```typescript
// List workflows first to find correct ID
const workflows = await workflowService.listWorkflows();
const workflow = workflows.find((w) => w.name === 'My Workflow');
```

### 405 Method Not Allowed

**Cause:** Using wrong HTTP method for endpoint

**Solution:**

```typescript
// Correct: PUT for updates
PUT /api/workflows/:id

// Incorrect: POST for updates
POST /api/workflows/:id
```

### 422 Validation Error

**Cause:** Invalid input data

**Solution:**

```typescript
// Check required fields
const input = {
  name: '', // ❌ Empty string
  steps: [], // ❌ Empty array
};

// Should be:
const input = {
  name: 'Workflow Name', // ✅ Non-empty
  steps: [{ type: 'manual', owner: 'Team', description: 'Step' }], // ✅ At least one
};
```

## Rate Limiting

The API has implicit rate limiting via Vercel and Supabase. For production use:

- Implement request queuing for burst traffic
- Monitor response status codes (429 would indicate rate limit)
- Space out requests to 10-100 per second depending on load

## Support & Feedback

For issues, feature requests, or feedback:

1. Check this guide for common patterns
2. Review endpoint documentation in `api-release-v1.md`
3. Open an issue on GitHub with error messages and request details
4. Contact the development team for production support
