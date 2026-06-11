# Memory Rules
Version: 1.1.0
Owner: Governance Engineering
Classification: Internal / Enterprise
Status: Active
Parent: RULES.md

## 1. Purpose
This file defines the rules governing memory access, writes, retention, deletion, and governance within the JLA.

## 2. Memory Scopes
- Agent memory: scoped to agent_id + tenant_id; read/write by owning agent only
- Skill memory: rare; read-only lookup tables only; no agent writes permitted
- Project memory: scoped to project_id + tenant_id; read by agents with explicit charter grant; write by assigned agents only
- Global memory: system-wide; read-only for all agents except Governance agents; write requires Governance owner approval

## 3. Memory Access Rules
- Agents may only access memory scopes explicitly granted in their charter
- All memory reads must be logged with: agent_id, scope, record_id, timestamp, tenant_id
- All memory writes must be logged with the same fields plus: classification label, schema_version, previous_record_hash
- Cross-scope access attempts: halt pipeline + P2 incident
- Cross-tenant memory access attempts: halt pipeline + P1 incident

## 4. Memory Write Requirements
Every memory write record must include:
- memory_record schema (validated against canonical schema)
- schema_version
- timestamp (UTC)
- agent_id
- tenant_id
- classification label (RESTRICTED / CONFIDENTIAL / INTERNAL / PUBLIC)
- previous_record_hash (for chain-of-custody integrity)
- write_reason

## 5. Memory Encryption
- All memory is encrypted at rest using per-tenant AES-256 keys
- Encryption key rotation: every 90 days (automated)
- Re-encryption after key rotation: within 72 hours
- No memory may be stored without encryption

## 6. Memory Retention Rules
| Data Type                  | Retention Period |
|----------------------------|-----------------|
| Default agent memory       | 1 year          |
| RESTRICTED / sensitive data| 90 days         |
| Compliance evidence        | 7 years         |
| Security logs              | 3 years         |
| Audit records              | 7 years         |
| Deletion records           | 7 years         |

Retention policies are enforced by automated TTL policies; manual enforcement is not permitted.
Tenant-specific overrides are permitted if documented and Governance owner-approved.

## 7. Memory Deletion Rules
Deletion requires:
- Governance owner approval (signed record with timestamp)
- Security owner approval (signed record with timestamp)
- Immutable audit log entry: requestor_id, agent_id, tenant_id, memory_scope, classification, reason, timestamp
- Post-deletion verification by Validator agent
- Deletion record retained for 7 years

For GDPR right-to-erasure requests:
- Deletion must complete within 30 days of verified request
- Must apply to: agent memory, project memory, telemetry exports, integration caches
- Completion confirmation sent to requestor

## 8. Forbidden Memory Behaviors
- Agents may not store secrets, tokens, or credentials in any memory scope
- Agents may not read memory outside their charter scope
- Agents may not delete memory without governance approval
- Agents may not write to global memory without explicit Governance owner authorization
- Memory records may not be modified after creation; only new records may be appended (immutable)

## 9. Enforcement
- Memory scope enforcement is performed by the Memory Service before every read/write
- Violations trigger immediate halt + incident classification per RULES.md Section 9.3
- Memory operation logs are immutable and retained per Section 6
