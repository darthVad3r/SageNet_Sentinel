# Audit

Version: 1.0.0
Owner: Governance Engineering
Classification: Internal / Enterprise
Status: Active

## 1. Purpose

This document defines the audit model for the JLA, including what must be recorded, how evidence is stored, and how audit readiness is maintained. It complements the auditability requirements in [SYSTEM.md](../SYSTEM.md) and [SECURITY.md](../SECURITY.md).

## 2. Audit Objectives

- Prove what happened, when, and why
- Prove which agent, skill, pipeline, and tenant produced a result
- Prove that required checks executed before output release
- Prove that incidents and escalations were handled according to policy

## 3. Audit Record Requirements

Every auditable event must include:

- event_type
- tenant_id
- agent_id
- skill_id
- pipeline_id
- command_id (if applicable)
- timestamp
- schema_version
- context_hash
- input_hash
- output_hash
- decision/result
- evidence references

## 4. Audit Event Categories

- Command invocation
- Agent handoff
- Skill execution
- Pipeline step transition
- Validation result
- Compliance check result
- Access decision
- Memory write/read/delete
- Integration call
- Incident escalation
- Policy enforcement action

## 5. Retention

- Operational logs: 1 year
- Security logs: 3 years
- Compliance logs: 7 years
- Audit evidence: 7 years
- Deletion records: 7 years

## 6. Audit Storage Rules

- Evidence must be immutable after write
- Evidence must be checksum-verified on read
- Evidence must be tenant-isolated
- Evidence must be accessible to Governance agents and authorized auditors only
- Evidence export must preserve provenance

## 7. Audit Review Cadence

- Weekly: evidence completeness review
- Monthly: control sampling review
- Quarterly: full audit readiness review
- Annual: external audit support package refresh

## 8. Audit Failure Behavior

If audit evidence is missing, inconsistent, or tampered with:

- The affected pipeline or control area is flagged
- A governance incident is raised
- The issue is routed to risk_review or incident_response as appropriate
- Remediation must be tracked to closure

## 9. Evidence Package Standard

Every significant event should be accompanied by:

- event summary
- raw logs or trace spans
- validation/compliance results
- change artifacts or diffs
- approval records when relevant
- remediation notes when applicable
