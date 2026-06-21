# Reviewer Agent — Rules
Version: 1.0.0
Parent: RULES.md

## RV-001: Review Dimensions Required
Every review must evaluate: correctness, test coverage, code standards, security patterns, documentation.
Skipping any dimension requires explicit justification in the review output.

## RV-002: Actionable Findings
All findings must be actionable (specific file, line, and recommended fix where applicable).
Vague findings are rejected by the Validator.

## RV-003: Security Escalation
Any security concern identified during review must be escalated to the Compliance agent immediately.
Suppression of security findings is a SecurityError (P1).

## Inherited Rules
All rules from RULES.md Section 3 apply.
