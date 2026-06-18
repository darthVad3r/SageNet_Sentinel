# Frontend-Backend Integration PR Notes

## Summary

This PR wires the frontend lead-intake client to a configurable backend base URL while preserving same-origin defaults.
It also integrates workflow management with backend CRUD, trigger-run, and run-history APIs.

## What Changed

- Added runtime config support for backend API base URL via `window.__LAB_RUNTIME_CONFIG__.backendApiBaseUrl`.
- Extended runtime config generation to read `LAB_BACKEND_API_BASE_URL` from `.env.local`.
- Updated lead intake service to resolve `/api/leads` through runtime base URL resolution.
- Updated HTTP interceptor to attach bearer tokens for both:
  - Same-origin `/api/*`
  - Configured backend `${LAB_BACKEND_API_BASE_URL}/api/*`
- Added/updated tests for:
  - Runtime config script output
  - Lead intake endpoint targeting when backend base URL is configured
- Updated docs and `.env.local.example` with backend base URL setup.
- Added workflow contract and API client support for:
  - `GET /api/workflows`
  - `POST /api/workflows`
  - `PUT /api/workflows/{id}`
  - `POST /api/workflows/{id}/runs`
  - `GET /api/workflows/{id}/runs`
- Replaced static workflows page data with an interactive manager supporting:
  - Create and edit
  - Stage and status updates
  - Step add/remove/reorder
  - Trigger run and view run history
- Added workflow service unit tests for contract parsing and endpoint behavior.

## Lightweight Integration Checklist

- [ ] Backend base URL is set in frontend `.env.local` as `LAB_BACKEND_API_BASE_URL`.
- [ ] Frontend `auth:config` script is run and generated runtime config includes backend base URL.
- [ ] Backend exposes `GET /api/leads` and `POST /api/leads` with expected schema envelope.
- [ ] Backend accepts Supabase bearer tokens from the frontend and returns `401` for invalid/missing tokens.
- [ ] Backend CORS policy allows frontend origin (for non-same-origin local/dev deployments).
- [ ] Lead submit flow from `/book` succeeds against backend environment.
- [ ] Settings page refresh for recent leads succeeds against backend environment.
- [ ] Contract/version mismatch paths return clear errors and are logged in backend observability tooling.

## Lightweight Workflow Checklist

- [ ] Backend workflow endpoints are deployed and authenticated with JWT bearer.
- [ ] Frontend can list workflows from `GET /api/workflows`.
- [ ] Creating a workflow from the UI persists and appears after refresh.
- [ ] Editing stage enforces backend transition rules and surfaces validation errors.
- [ ] Triggering a run from the UI creates a run visible in run-history view.
- [ ] Run history pagination returns predictable ordering (latest first).
- [ ] Workflow contract uses schemaVersion `2026-06-14` on success and error envelopes.

## Notes

- If `LAB_BACKEND_API_BASE_URL` is omitted, frontend behavior remains same-origin (`/api/*`).
- This supports local split-repo development without hardcoding backend hosts in client code.
