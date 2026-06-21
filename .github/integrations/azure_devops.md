# Azure DevOps Integration

Version: 1.0.0
Owner: Platform Engineering
Classification: Internal / Enterprise
Status: Active

## 1. Purpose

This document defines the governed Azure DevOps integration for the JLA. Azure DevOps is used for repository access, work item references, pipeline status retrieval, and controlled write actions through approved workflows.

## 2. Allowed Operations

- Read repositories, work items, branches, pull requests, commits, and pipelines
- Update work items when explicitly approved by a pipeline
- Create or update pull requests through governed execution
- Query build and release status
- Export audit evidence related to DevOps workflows

## 3. Authentication

- Scoped Azure AD application or personal access token with least privilege
- Tokens must be tenant-scoped and operation-scoped
- Tokens must be stored only in approved secret storage
- No tokens in memory, logs, or outputs

## 4. Rate Limiting

- Must respect Azure DevOps API limits
- Backoff required on throttling or transient failures
- Rate-limit violations must be logged as IntegrationError

## 5. Data Boundaries

- Only approved project and repository scopes may be accessed
- RESTRICTED data may not be posted to work items or comments without explicit authorization
- Cross-tenant and cross-project access is forbidden unless specifically granted

## 6. Logging

Every call must log:

- tenant_id
- agent_id
- pipeline_id
- operation
- project
- repository
- timestamp
- request_hash
- response_hash
- schema_version

## 7. Failure Behavior

- Authentication or authorization failure halts the pipeline
- Missing project scope triggers immediate escalation
- Repeated API errors must be treated as IntegrationError and routed to incident handling

## 8. Usage Notes

Azure DevOps is the governed integration path for Microsoft-hosted development workflows and evidence capture where applicable.
