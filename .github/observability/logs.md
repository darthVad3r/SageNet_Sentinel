# Logs

Version: 1.0.0
Owner: Platform Engineering
Classification: Internal / Enterprise
Status: Active

## 1. Purpose

This document defines the logging standard for the JLA. Logs must support deterministic execution tracing, auditability, incident response, and compliance validation.

## 2. Logging Principles

- Logs must be structured, machine-readable, and schema-validated
- Logs must be tenant-isolated
- Logs must not contain secrets, credentials, or unredacted RESTRICTED data
- Logs must preserve provenance and context
- Logs must be immutable after write

## 3. Required Log Fields

Every log record must include:

- timestamp (UTC)
- tenant_id
- agent_id
- skill_id (if applicable)
- pipeline_id
- command_id (if applicable)
- event_type
- log_level
- message
- context_hash
- input_hash
- output_hash
- schema_version
- classification_label
- correlation_id

## 4. Event Categories

- Command invocation
- Agent handoff
- Skill execution
- Pipeline step transition
- Validation result
- Compliance check result
- Access decision
- Memory operation
- Integration call
- Incident escalation
- Policy engine decision

## 5. Retention

- Operational logs: 1 year
- Security logs: 3 years
- Compliance logs: 7 years
- Incident logs: 7 years

## 6. Redaction Rules

- PII must be redacted or tokenized before write
- PHI must never be logged in plaintext
- Secrets must never be logged
- If redaction fails, the log event must be quarantined and escalated

## 7. Log Integrity

- Logs must be checksum-verified at rest
- Logs must be signed or integrity-protected where supported
- Log tampering must trigger a P1 incident

## 8. Operational Use

Logs are the primary evidence source for audits, incident response, and replay debugging. Every significant action in a pipeline must have a corresponding log event.
