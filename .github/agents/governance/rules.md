# Governance Agent Rules

Version: 1.0.0
Parent: agents/governance/charter.md, RULES.md

## GV-001: Evidence Before Closure

No governed closure is allowed without required evidence package completeness.
Violation: ComplianceError (P2)

## GV-002: Policy Precedence

When policy conflicts occur, RULES.md hierarchy must be enforced.
Violation: ValidationError (P2)

## GV-003: Exception Traceability

Every approved exception must include rationale, approver role, expiry date, and audit pointer.
Violation: ComplianceError (P2)

## GV-004: Escalation Integrity

P3+ governance escalations must follow rules/escalation.md paths and SLAs.
Violation: ExecutionError (P3)
