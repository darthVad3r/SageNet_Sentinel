# API Release v1.0 - Workflow & Dashboard Endpoints

**Release Date:** 2026-06-15  
**Status:** Production Ready

## Overview

Complete backend infrastructure for workflow management and dashboard analytics. All endpoints live on Vercel with Supabase persistence.

## New Endpoints

### Workflow Management

#### GET /api/workflows

List all workflows ordered by most recently updated.

- **Authentication:** Required (Bearer token)
- **Response:** `{ schemaVersion, data: Workflow[] }`

**Example:**

```bash
curl -H "Authorization: Bearer <JWT>" https://api.example.com/api/workflows
```

#### POST /api/workflows

Create a new workflow.

- **Authentication:** Required (Bearer token)
- **Request Body:**

```json
{
  "name": "string (required)",
  "description": "string (required)",
  "client": "string (required)",
  "stage": "discovery|implementation|testing|live|paused",
  "status": "active|paused|archived",
  "steps": [
    {
      "type": "manual|automated|integration",
      "owner": "string",
      "description": "string"
    }
  ]
}
```

- **Response:** `{ schemaVersion, data: Workflow }`
- **Status:** 201 Created

#### PUT /api/workflows/:id

Update an existing workflow. Automatically tracks stage changes in history.

- **Authentication:** Required (Bearer token)
- **Request Body:** Same as POST /api/workflows
- **Response:** `{ schemaVersion, data: Workflow }`
- **Status:** 200 OK or 404 Not Found

#### GET /api/workflows/:id/runs

List workflow runs with pagination.

- **Authentication:** Required (Bearer token)
- **Query Parameters:**
  - `page` (default: 1)
  - `pageSize` (default: 10, max: 50)
- **Response:** `{ schemaVersion, total, page, pageSize, data: WorkflowRun[] }`

#### POST /api/workflows/:id/runs

Trigger a new workflow run.

- **Authentication:** Required (Bearer token)
- **Request Body:** Empty object `{}`
- **Response:** `{ schemaVersion, data: WorkflowRun }`
- **Status:** 201 Created or 404 Not Found

### Dashboard Analytics

#### GET /api/dashboard/summary

Get aggregated workflow and run statistics.

- **Authentication:** Required (Bearer token)
- **Response:**

```json
{
  "schemaVersion": "2026-06-14",
  "data": {
    "leadCount": 42,
    "workflowCount": 15,
    "activeWorkflowCount": 12,
    "queuedRunCount": 3,
    "runningRunCount": 1,
    "succeededRunCount": 128,
    "failedRunCount": 5,
    "totalRunCount": 137,
    "totalEstimatedHoursSaved": 68.5,
    "hasImpactData": true,
    "automationImpact": [
      {
        "workflowId": "wf-123",
        "workflowName": "Lead Qualification",
        "runCount": 84,
        "estimatedMinutesSavedPerRun": 30,
        "estimatedHoursSaved": 42
      }
    ],
    "workflowsByStage": [
      { "stage": "discovery", "count": 5 },
      { "stage": "implementation", "count": 8 },
      { "stage": "testing", "count": 2 },
      { "stage": "live", "count": 0 },
      { "stage": "paused", "count": 0 }
    ]
  }
}
```

#### GET /api/dashboard/recent-runs

Get recent workflow runs with workflow names.

- **Authentication:** Required (Bearer token)
- **Query Parameters:**
  - `page` (default: 1)
  - `pageSize` (default: 10, max: 50)
  - `limit` (legacy alias for `pageSize`)
- **Response:**

```json
{
  "schemaVersion": "2026-06-14",
  "data": {
    "total": 128,
    "page": 1,
    "pageSize": 10,
    "data": [
      {
        "runId": "uuid",
        "workflowId": "uuid",
        "workflowName": "Lead Qualification",
        "status": "succeeded|queued|running|failed",
        "triggeredAt": "2026-06-15T12:30:00.000Z",
        "completedAt": "2026-06-15T12:30:45.000Z"
      }
    ]
  }
}
```

## Data Models

### Workflow

```typescript
interface Workflow {
  id: string; // UUID
  name: string;
  description: string;
  client: string;
  stage: 'discovery' | 'implementation' | 'testing' | 'live' | 'paused';
  status: string; // 'active' | 'paused' | 'archived'
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
  steps: WorkflowStep[];
  stageHistory: WorkflowStageChange[];
}

interface WorkflowStep {
  id: string; // UUID
  order: number;
  type: 'manual' | 'automated' | 'integration';
  owner: string;
  description: string;
}

interface WorkflowStageChange {
  stage: string;
  changedAt: string; // ISO 8601
  actor: string; // 'api' or user identifier
}
```

### WorkflowRun

```typescript
interface WorkflowRun {
  id: string; // UUID
  workflowId: string; // UUID
  status: 'queued' | 'running' | 'succeeded' | 'failed';
  triggeredAt: string; // ISO 8601
  startedAt: string | null; // ISO 8601
  completedAt: string | null; // ISO 8601
  summary: string;
}
```

## Error Handling

All endpoints return error responses in this format:

```json
{
  "error": "Human-readable error message"
}
```

Common HTTP Status Codes:

- `200 OK` - Successful GET or PUT
- `201 Created` - Successful POST
- `401 Unauthorized` - Missing or invalid Bearer token
- `404 Not Found` - Resource not found
- `405 Method Not Allowed` - Unsupported HTTP method
- `500 Internal Server Error` - Server-side error

## Authentication

All endpoints require a valid JWT Bearer token from Supabase authentication:

```
Authorization: Bearer <JWT_TOKEN>
```

Tokens are validated via Supabase's `auth.getUser()` endpoint.

## Database

**Supabase Project:** dkukhtfakrkuyevyocrw

**Tables:**

- `workflows` - Stores workflow definitions with JSON metadata
- `workflow_runs` - Stores workflow execution history

**Key Features:**

- Automatic `updated_at` timestamp management
- Foreign key constraints with CASCADE delete
- Indexes on frequently queried columns (updated_at DESC, stage, status, workflow_id)
- Constraint checks for valid enum values
- Timestamp ordering validation (completed_at >= started_at >= triggered_at)

## Deployment

**Platform:** Vercel Serverless (Node.js runtime)

**Environment Variables Required:**

- `LAB_SUPABASE_URL` - Supabase project URL
- `LAB_SUPABASE_SERVICE_ROLE_KEY` - Service role key for API requests
- `LAB_SUPABASE_ANON_KEY` - Anonymous key for token verification

**CI/CD:**

- Automatic deployment on main branch push
- TypeScript and ESLint checks pass on all commits
- All tests passing (120 tests)

## Frontend Integration

The Angular frontend has been updated to call these endpoints:

- `WorkflowService` handles all HTTP requests with Bearer token auth
- `WorkflowBuilderComponent` saves drafts to POST /api/workflows
- Loading states and error messages display during API calls

## Performance

- **Concurrent Queries:** Dashboard summary uses Promise.all() for ~5 parallel queries
- **Pagination:** Efficient range queries via Supabase
- **Caching:** Endpoints leverage HTTP caching headers
- **Query Optimization:** Strategic use of HEAD queries for count-only operations
- **Database Indexes:** Query patterns covered by 6 composite and single-column indexes

## Next Steps

1. Dashboard UI connects to `/api/dashboard/summary` and `/api/dashboard/recent-runs`
2. Workflow details page loads runs via paginated `/api/workflows/:id/runs`
3. Run triggers via workflow management interface
4. Monitoring and logging setup for production observability
5. Advanced filtering and search capabilities

## Testing

All endpoints are covered by:

- TypeScript type checking (strict mode)
- Unit tests for data layer functions
- Integration tests via Angular services
- Manual testing in development environment

**Test Results:** ✅ 120/120 passing

## Support

For API issues or questions, contact the development team or open an issue in the repository.
