# Data Handling

Version: 1.0.0
Owner: Governance Engineering
Classification: Internal / Enterprise
Status: Active

## 1. Purpose

This document defines how data is classified, processed, stored, retained, redacted, and deleted within the JLA. It is the operational companion to the data handling rules in [SECURITY.md](../SECURITY.md), [RULES.md](../RULES.md), and [SYSTEM.md](../SYSTEM.md).

## 2. Data Classification

### RESTRICTED

- PII, PHI, secrets, credentials, keys, compliance evidence
- Must be encrypted at rest and in transit
- Access requires explicit approval
- Must be logged on every access

### CONFIDENTIAL

- Tenant business data, code under review, agent-generated work products
- Must be encrypted at rest and in transit
- Access limited to the owning tenant and pipeline context

### INTERNAL

- System metadata, telemetry aggregates, schema versions, non-sensitive logs
- Must be protected and tenant-isolated

### PUBLIC

- Documentation approved for external release
- Must still preserve provenance and versioning

## 3. Handling Rules

- Data must be labeled at write time
- Classification must propagate through memory, logs, traces, exports, and integrations
- RESTRICTED data may not be exported without explicit approval
- Personal data must be minimized to the smallest workable scope
- Redaction is preferred over deletion when audit retention is required

## 4. Storage Rules

- Encryption at rest: AES-256 or stronger
- Encryption in transit: TLS 1.2+
- Per-tenant keys are required
- Storage must be tenant-isolated
- Backups must preserve encryption and classification labels

## 5. Retention Rules

- RESTRICTED: 90 days unless a longer legal retention is required
- Operational telemetry: 1 year
- Security logs: 3 years
- Compliance evidence: 7 years
- Deletion records: 7 years

## 6. Deletion and Redaction

- Deletion requires Governance + Security approval when the data is RESTRICTED
- Redaction must preserve auditability where possible
- GDPR right-to-erasure requests must be completed within 30 days
- Deleted data must not be recoverable from active systems

## 7. Transfers and Egress

- Outbound data must be checked against classification and destination rules
- External transfers require explicit integration authorization
- Cross-tenant transfers are forbidden
- Sensitive data may only leave the platform through approved export paths

## 8. Violations

Any data handling violation must:

- halt the affected pipeline
- be logged with evidence
- be escalated according to the severity rules
- be added to the risk register if the issue is systemic
