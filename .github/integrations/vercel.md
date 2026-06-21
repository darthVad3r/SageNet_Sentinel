# Vercel Integration

Version: 1.0.0
Owner: Platform Engineering
Classification: Internal / Enterprise
Status: Active

## 1. Purpose

This document defines the governed Vercel integration for the JLA. Vercel is used for deployment-related status, preview environment references, and controlled platform interactions where applicable.

## 2. Allowed Operations

- Read deployment and preview status
- Reference preview URLs in governed artifacts
- Query project and deployment metadata
- Trigger or monitor deployment workflows only when explicitly approved by pipeline policy

## 3. Authentication

- Scoped Vercel token or approved integration account only
- Tokens must be tenant-scoped and project-scoped
- Secrets must be stored only in approved secret storage

## 4. Rate Limiting

- Must respect Vercel API limits
- Retries on transient failures must be bounded and deterministic
- Rate-limit violations must be surfaced as IntegrationError

## 5. Data Boundaries

- RESTRICTED data must not be published to preview environments without explicit authorization
- Preview URLs and deployment metadata must be treated according to tenant classification
- Cross-tenant deployment access is forbidden

## 6. Logging

Every call must log:

- tenant_id
- agent_id
- pipeline_id
- project_id
- deployment_id
- operation
- timestamp
- request_hash
- response_hash
- schema_version

## 7. Failure Behavior

- Authentication or authorization failure halts the deployment-related step
- Preview or deployment reference failures are logged and escalated if user-facing
- Unapproved deployment actions are forbidden

## 8. Usage Notes

Vercel is a deployment integration, not a general-purpose data transport. It must only be used within approved deployment workflows.
