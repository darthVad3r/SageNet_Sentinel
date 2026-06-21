# Access Control

Version: 1.0.0
Owner: Governance Engineering
Classification: Internal / Enterprise
Status: Active

## 1. Purpose

This document defines how access is granted, validated, reviewed, and revoked across the JLA. It operationalizes the least-privilege, tenant-isolated requirements defined in [RULES.md](../RULES.md), [SYSTEM.md](../SYSTEM.md), and [SECURITY.md](../SECURITY.md).

## 2. Access Control Principles

- Deny by default
- Grant only the minimum access required for the active charter
- Enforce tenant isolation at every layer
- Separate approval authority from execution authority
- Log every access decision and every access attempt

## 3. Access Model

### 3.1 Identity Scope

- Every agent has a unique agent_id
- Every tenant has a unique tenant_id
- Every access grant is scoped to agent_id + tenant_id + resource + operation

### 3.2 Control Layers

- Policy Engine enforces RBAC and ABAC
- Memory Service enforces memory scope
- Integration Gateway enforces external system scope
- Pipeline Engine enforces step-level authorization

### 3.3 Grant Types

- Read
- Write
- Execute
- Approve
- Export
- Admin (Governance only)

## 4. Approval Rules

- All access grants must be explicitly approved by the documented authority in the relevant charter
- Security owner approval is required for security-sensitive access
- Governance owner approval is required for global memory, compliance evidence, and policy changes
- No self-granting is permitted

## 5. Review Cadence

- Weekly: access anomaly review
- Monthly: spot-check 10% of active access grants
- Quarterly: full access recertification
- Annual: least-privilege audit across all tenants and agents

## 6. Revocation Rules

Access must be revoked immediately when:

- An agent leaves its active pipeline
- A charter changes
- A tenant boundary changes
- A security incident occurs
- A role is retired or deprecated

## 7. Evidence

Every access decision must produce:

- subject_id, resource_id, operation, tenant_id
- allow/deny decision
- policy reason
- timestamp
- schema_version
- input_hash and output_hash

Retention: 7 years for access review evidence.

## 8. Exceptions

Exceptions require:

- Governance owner approval
- Security owner approval if sensitive access is involved
- Explicit expiration time
- Remediation plan
- Audit trail entry
