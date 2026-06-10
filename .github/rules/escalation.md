# Escalation Rules

Version: 1.1.0
Owner: Governance Engineering
Classification: Internal / Enterprise
Status: Active
Parent: RULES.md

## 1. Purpose

This file defines the escalation procedures, targets, SLAs, and evidence requirements for all incidents and violations within the JLA.

## 2. Escalation Triggers

Agents must escalate when any of the following occur:

- P1/P2 error detected
- Compliance failure detected
- Security failure detected
- Drift or hallucination threshold breach
- Undefined or unauthorized pipeline step encountered
- Escalation target unavailable (cascade to next authority)
- Policy Engine health check failure
- Handoff validation failure
- Memory scope violation
- Cross-tenant access attempt

## 3. Escalation Hierarchy

```
P1 (Critical)
  -> Security agent (immediate)
    -> Security owner (within 15 minutes)
      -> System owner (if Security owner unavailable)
        -> On-call escalation (if all primary contacts unreachable)

P2 (Major)
  -> Validator agent (immediate)
    -> Security agent (immediate)
      -> Security owner (within 1 hour)
        -> Governance owner (if Security owner unavailable)

P3 (Moderate)
  -> Governance agent (immediate)
    -> Governance owner (within 4 hours)

P4 (Minor)
  -> Pipeline owner (next business day review)
```

## 4. Escalation SLAs

| Severity | Acknowledge   | Contain     | Resolve         |
| -------- | ------------- | ----------- | --------------- |
| P1       | 15 minutes    | 1 hour      | 24 hours        |
| P2       | 1 hour        | 4 hours     | 5 business days |
| P3       | 4 hours       | 5 bus. days | 30 days         |
| P4       | Next bus. day | N/A         | 30 days         |

SLA breach is flagged in the governance dashboard and reported weekly.

## 5. Required Escalation Evidence

All escalations must include:

- Full log extract scoped to incident window
- Trace spans for affected pipelines
- context_hash at time of escalation
- input_hash, output_hash
- schema_version
- error_type and severity classification
- agent_id, pipeline_id, tenant_id
- timestamp (UTC)

All evidence is immutable and retained for 7 years.

## 6. Escalation Failure Behavior

- If the escalation target is unavailable: escalate to next authority in hierarchy
- If no authority is reachable: pipeline halts; system enters fail-safe mode
- All unresolved P1 escalations trigger on-call page within 15 minutes
- Fail-safe mode: only Governance agents remain active; all other pipelines halted

## 7. Required Pipelines by Severity

- P1: incident_response pipeline
  - Runbook: /runbooks/security/incident-response.md
  - Required agents: Security, Governance, Compliance, Validator
- P2: reliability_incident pipeline
  - Runbook: /runbooks/reliability/reliability-incident.md
  - Required agents: Security, Governance, Validator
- P3: risk_review pipeline
  - Runbook: /runbooks/reliability/drift-remediation.md
  - Required agents: Governance, Validator, Researcher
- P4: logged only; no pipeline required

## 8. Post-Escalation Requirements

- Root cause analysis within 5 business days (P1/P2)
- Remediation plan with owners and due dates
- Control updates if a gap was identified
- 30-day follow-up audit
- Governance owner sign-off on closure
- Evidence package retained in compliance audit store

## 9. Enforcement

- All escalations are logged and auditable
- Escalation SLA compliance measured and reported weekly
- SLA breaches flagged in governance dashboard
- Escalation records retained for 7 years
