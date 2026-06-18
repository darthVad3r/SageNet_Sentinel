# JLA Dual-Pipeline Status

## Imported Issues

### Frontend (ai-automation-lab)

- #114 Lead Capture and Intake
- #117 Onboarding questionnaire and automation roadmap
- #120 Dashboard and Reporting
- #121 Client automation dashboard
- #122 Impact metrics (basic)
- #123 Workflow management
- #124 Create and edit workflows
- #125 Workflow status and lifecycle
- #126 Integrations
- #127 Integration catalog
- #128 Client integration connection
- #129 Account, roles, and settings
- #130 Client account profile
- #131 Roles and access (basic)
- #132 Billing and engagement model
- #133 Engagement overview
- #134 Invoice history (even if manual)
- #135 Support and guidance
- #136 Help and support entry point
- #137 Onboarding guide

### Backend (ai-automation-backend)

- #12 Validate Supabase JWTs in the API
- #14 Migrate lead submission to the .NET backend
- #15 Expose authenticated lead retrieval
- #16 Protect lead intake from spam and abuse
- #17 Implement workflow CRUD APIs
- #18 Trigger workflow runs on demand
- #19 List workflow run history
- #20 Add queued workflow execution
- #23 Enforce backend CI quality gates
- #24 Build preview and production deployment pipelines
- #25 Document backend setup and operations
- #26 Add structured logs and tracing
- #27 Publish health and readiness endpoints
- #30 Enforce backend CI quality gates
- #31 Build preview and production deployment pipelines
- #32 Document backend setup and operations

## Classification

- FRONTEND: #114, #117, #120-#137
- BACKEND: #12, #17-#32
- CROSS-PROJECT:
  - Frontend #114 depends on backend #12, #14, #15, #16.

## Dependency Chain

1. Backend #12: JWT validation in API
2. Backend #14: lead submission endpoint
3. Backend #16: abuse protection for intake endpoint
4. Backend #15: authenticated lead retrieval endpoint
5. Frontend #114: point frontend to backend base URL and keep contract parity

## Execution Outcome (This Cycle)

Completed backend-first and frontend-second sequence for the lead-intake migration chain:

- Backend implemented and tested for #12, #14, #15, #16.
- Frontend integration completed for #114 with runtime-configured backend base URL support.
- Cross-project API contract maintained with schemaVersion 2026-06-11.

Completed backend-first and frontend-second sequence for workflow management:

- Backend implemented and tested for #17, #18, #19.
- Frontend integration completed for #123, #124, #125.
- Cross-project API contract maintained with schemaVersion 2026-06-14.

## Validation Artifacts (Latest)

- Backend (`ai-automation-backend`): `dotnet test ai-automation-backend.slnx` passed (9/9 tests).
- Frontend (`ai-automation-landing`):
  - `npm run typecheck` passed.
  - `npm run auth:config:test` passed.
  - `npm run test -- --watch=false --include src/app/core/services/workflow.service.spec.ts` passed (3/3 tests).

## Notable Stabilization

- Backend startup DB initialization now tolerates concurrent SQLite table creation races in integration test startup by swallowing "already exists" table-creation collisions.

## Next Parallel Candidates

- Active next slice: Backend #20 (queued workflow execution) with frontend UX follow-up for queued/running visibility.
- Backend #23/#24/#30/#31 (quality/deployment) + Frontend CI alignment docs.
