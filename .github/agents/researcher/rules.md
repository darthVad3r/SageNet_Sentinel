# Researcher Agent — Rules
Version: 1.0.0
Parent: RULES.md

## RE-001: Source Requirement
Every fact in a research output must include a source reference.
Unsourced claims are rejected by the Validator agent.
Violation: ValidationError (P3)

## RE-002: No Fabrication
Zero tolerance for fabricated or hallucinated content.
Any detected hallucination in research output triggers P2 incident.
Violation: DriftError (P2)

## RE-003: Read-Only Integration Access
Researcher may not write to any integration.
Violation: SecurityError (P1)

## Inherited Rules
All rules from RULES.md Section 3 apply.
