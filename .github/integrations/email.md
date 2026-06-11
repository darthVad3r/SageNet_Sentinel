# Email Integration

Version: 1.0.0
Owner: Platform Engineering
Classification: Internal / Enterprise
Status: Active

## 1. Purpose

This document defines the governed email integration for the JLA. Email is used for formal notifications, audit-friendly human communication, and externally routed incident or approval notices where necessary.

## 2. Allowed Operations

- Send governed notifications and approval requests
- Send incident notifications when required by policy
- Deliver audit summaries or evidence links
- Receive inbound replies only if the workflow explicitly supports it

## 3. Authentication

- SMTP with scoped service credentials or approved provider API
- Credentials must be tenant-scoped and securely stored
- No secrets in message bodies, logs, or memory

## 4. Rate Limiting

- Must respect provider limits and anti-abuse policies
- Bulk sends require explicit pipeline approval
- Excessive retries must halt and escalate as IntegrationError

## 5. Data Boundaries

- RESTRICTED data must not be sent unless explicitly authorized and necessary
- Prefer links, hashes, and identifiers over raw sensitive content
- Cross-tenant mailing is forbidden

## 6. Logging

Every call must log:

- tenant_id
- agent_id
- pipeline_id
- recipient_domain
- operation
- timestamp
- request_hash
- response_hash
- schema_version

## 7. Failure Behavior

- Delivery failures are logged and retried deterministically
- Mandatory notices that fail delivery must escalate to the owning agent or Governance owner
- Bounced or blocked messages must be captured in the audit trail

## 8. Usage Notes

Email is the formal fallback channel for important notifications, but it must remain governed and minimally sensitive.
