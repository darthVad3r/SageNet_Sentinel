# Jira Integration

Version: 1.0.0
Owner: Platform Engineering
Classification: Internal / Enterprise
Status: Active

## 1. Purpose

This document defines the governed Jira integration for the JLA. Jira is used for issue tracking, risk tracking, task orchestration, and evidence-linked work item updates.

## 2. Allowed Operations

- Read issues, epics, projects, labels, and workflows
- Create issues when explicitly requested by a pipeline
- Update issue status, comments, and fields under approved workflows
- Reference Jira issues in risk and migration plans
- Export traceable evidence for issue-related workflows

## 3. Authentication

- OAuth, service account, or scoped API token only
- Credentials must be tenant-scoped and stored securely
- No credential material may be written to logs or memory

## 4. Rate Limiting

- Must respect Jira API limits
- Transient limits require deterministic retry with backoff
- Excessive limit violations trigger IntegrationError

## 5. Data Boundaries

- Jira updates may not include secrets or RESTRICTED data unless explicitly authorized
- Comments and descriptions must remain tenant-bound and scope-bound
- Cross-tenant issue access is forbidden

## 6. Logging

Every call must log:

- tenant_id
- agent_id
- pipeline_id
- operation
- project_key
- issue_key
- timestamp
- request_hash
- response_hash
- schema_version

## 7. Failure Behavior

- Authentication or permission failure halts the relevant pipeline step
- API errors are logged and escalated according to the severity model
- Unresolvable issue references must be recorded and do not silently disappear

## 8. Usage Notes

Jira is the governed system of record for issue and work tracking when the command or pipeline requires it.
