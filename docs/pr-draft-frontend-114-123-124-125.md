# PR Draft: Frontend integration for leads and workflows

## Title

feat(frontend): integrate backend API runtime base URL, lead intake wiring, and workflow management UI

## Summary

This PR completes the frontend side of the backend-first integration chain:

- Lead API integration dependencies for #114.
- Workflow management UX and API integration for #123, #124, #125.

It adds runtime backend URL resolution, expands authenticated API interception rules, and replaces static workflow mock content with a fully interactive manager backed by workflow endpoints.

## Linked Issues

- Closes #114
- Closes #123
- Closes #124
- Closes #125

## Backend Dependency Notes

This PR depends on backend availability for:

- JWT validation and authenticated lead endpoints (#12, #14, #15, #16)
- Workflow CRUD/run/history endpoints (#17, #18, #19)

## Scope of Changes

- Runtime config:
  - Add backend API base URL support from runtime config (`window.__LAB_RUNTIME_CONFIG__.backendApiBaseUrl`).
  - Generate runtime config from `LAB_BACKEND_API_BASE_URL`.
- Auth/API behavior:
  - Ensure bearer token injection for both same-origin `/api/*` and configured backend-host `/api/*` routes.
- Lead integration:
  - Route lead service requests through runtime API URL resolver.
  - Add/adjust tests for backend URL targeting.
- Workflow integration:
  - Add workflow contract types and API service:
    - `GET /api/workflows`
    - `POST /api/workflows`
    - `PUT /api/workflows/{id}`
    - `POST /api/workflows/{id}/runs`
    - `GET /api/workflows/{id}/runs`
  - Replace static workflows page with interactive manager:
    - create/edit workflows
    - stage/status updates
    - step add/remove/reorder
    - trigger runs and inspect run history
  - Add workflow service unit coverage.
- Documentation:
  - Update README and environment example.
  - Add/update cross-project integration notes and checklist.

## Validation

Executed locally:

- `npm run typecheck` (pass)
- `npm run auth:config:test` (pass)
- `npm run test -- --watch=false --include src/app/core/services/workflow.service.spec.ts` (pass; 3/3)

## Lightweight Integration Checklist

- [ ] Set `LAB_BACKEND_API_BASE_URL` in frontend `.env.local` for split-repo/local integration.
- [ ] Run runtime config generation and confirm backend URL appears in generated runtime config.
- [ ] Verify lead create/list behavior works against backend environment.
- [ ] Verify workflow list/create/update/trigger/history flows from UI.
- [ ] Confirm stage-transition validation errors surface clearly in the UI.
- [ ] Confirm CORS and auth token flow in non-same-origin environments.

## Risk and Rollout

- Runtime behavior remains same-origin if backend base URL is not configured.
- Main integration risk is environment misconfiguration (auth/CORS/base URL).
- Rollout can be gradual by enabling backend base URL per environment.

## Post-merge Follow-ups

- Extend workflow component test coverage for more UI interaction paths.
- Align CI validations to run targeted workflow tests in PR pipelines.
