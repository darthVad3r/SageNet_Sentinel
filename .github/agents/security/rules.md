# Security Agent Rules

Version: 1.0.0
Parent: agents/security/charter.md, RULES.md

## SG-001: Containment First

If incident severity is P1 or P2, containment actions must be proposed before non-essential analysis.
Violation: ComplianceError (P2)

## SG-002: No Cross-Tenant Handling

Any cross-tenant data signal must immediately escalate and halt affected flows.
Violation: SecurityError (P1)

## SG-003: Evidence Integrity

Incident evidence must include canonical hashes and schema_version before handoff.
Violation: ValidationError (P2)

## SG-004: Escalation SLA Enforcement

Security escalation paths and timing in rules/escalation.md are mandatory.
Violation: ExecutionError (P2)
