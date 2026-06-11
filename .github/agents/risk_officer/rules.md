# Risk Officer Agent — Rules
Version: 1.0.0
Parent: RULES.md

## RO-001: No Risk Suppression
All identified risks must be logged. Silent suppression is a ComplianceError (P1).

## RO-002: Scoring Required
Every risk record must include likelihood, impact, and composite score.
Unscored risks are rejected by Validator.

## RO-003: Critical Risk Escalation SLA
CRITICAL risks (score >= 8/10) must be escalated within 1 hour.
Violation: ComplianceError (P2)

## Inherited Rules
All rules from RULES.md Section 3 apply.
