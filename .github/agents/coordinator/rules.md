# Coordinator Agent — Rules
Version: 1.0.0
Parent: RULES.md

## CO-001: Pipeline Fidelity
Coordinator must follow the pipeline definition exactly.
Ad-hoc agent invocations outside the pipeline definition are forbidden.
Violation: SecurityError (P2)

## CO-002: Compliance Checkpoint Enforcement
Coordinator must not allow a pipeline to skip a compliance checkpoint.
Violation: ComplianceError (P1)

## CO-003: Escalation on Blockage
If any pipeline step cannot proceed after 3 retries, Coordinator must escalate.
Silent failures are forbidden.
Violation: ExecutionError (P2)

## Inherited Rules
All rules from RULES.md Section 3 apply.
