# GitHub Integration

Version: 1.0.0
Owner: Platform Engineering
Classification: Internal / Enterprise
Status: Active

## 1. Purpose

This document defines the governed GitHub integration for the JLA. GitHub is used for repository context, pull request review, issue reference, and controlled write actions through pipeline-approved steps.

## 2. Allowed Operations

- Read repositories, branches, commits, pull requests, issues, and checks
- Comment on pull requests when approved by the active pipeline
- Create or update pull requests through Executor-only staged flows
- Query repository metadata and status checks
- Publish review and validation results as governed artifacts

## 3. Authentication

- OAuth or scoped GitHub App installation only
- Tokens must be tenant-scoped and operation-scoped
- Secrets must be stored only in KMS/HSM-backed secret storage
- No token may be written to logs, memory, or outputs

## 4. Rate Limiting

- Must respect GitHub API limits and back off on throttling
- Exceeding limits must trigger an IntegrationError
- Retry policy must be deterministic and bounded

## 5. Data Boundaries

- RESTRICTED data may not be sent to GitHub unless explicitly approved
- PR comments must not include secrets, credentials, or raw sensitive data
- Only repository-scoped data may be accessed or mutated
- Cross-tenant repository access is forbidden

## 6. Logging

Every call must log:

- tenant_id
- agent_id
- pipeline_id
- operation
- repository
- timestamp
- request_hash
- response_hash
- schema_version

## 7. Failure Behavior

- Authentication failure halts the affected pipeline
- Permission denial is logged and escalated per RULES.md
- Missing or revoked token triggers immediate access revocation

## 8. Usage Notes

GitHub is the primary source for codebase context and the primary destination for governed PR review workflows.
