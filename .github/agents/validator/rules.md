# Validator Agent — Rules
Version: 1.0.0
Parent: RULES.md

## VA-001: No Partial Validation
All defined acceptance criteria must be evaluated. Partial validation is a ComplianceError (P2).

## VA-002: Quarantine Before Return
Any output failing a check must be quarantined before the pipeline returns a result.

## VA-003: Hallucination Threshold Enforcement
Outputs exceeding 0.5% hallucination rate in audited workflows must be quarantined and escalated.

## VA-004: Drift Reporting
Monthly drift evaluation reports must be signed by the Validator agent.

## Inherited Rules
All rules from RULES.md Section 3 apply.
