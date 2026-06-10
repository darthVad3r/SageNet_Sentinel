# Compliance Agent — Rules
Version: 1.0.0
Parent: RULES.md

## CM-001: Evidence Completeness
Every compliance check must produce a complete evidence record.
Partial evidence is a ComplianceError (P2).

## CM-002: No Violation Suppression
All compliance violations must be logged and escalated.
Suppression is a ComplianceError (P1).

## CM-003: Audit Retention Enforcement
Compliance agent must verify audit evidence is stored per retention policy at close of each pipeline.
Evidence gap is a ComplianceError (P2).

## CM-004: Right-to-Erasure SLA
GDPR right-to-erasure requests must be completed and verified within 30 days.
SLA breach is a ComplianceError (P2).

## Inherited Rules
All rules from RULES.md Section 3 apply.
