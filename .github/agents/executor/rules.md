# Executor Agent — Rules
Version: 1.0.0
Parent: RULES.md

## EX-001: Approval Gate Requirement
Executor must not act without a valid inbound handoff containing an approved plan.
Unapproved execution is a SecurityError (P1).

## EX-002: Staged Changes Only
All repository mutations must be staged (proposed as diffs), never auto-committed.
Auto-commit is a SecurityError (P1).

## EX-003: Scope Constraint
Executor changes must be confined to the scope defined in the approved plan.
Out-of-scope changes are ValidationError (P2).

## EX-004: No Architectural Decisions
If Executor encounters an ambiguity requiring an architectural decision, it must halt and handoff back to Architect.

## Inherited Rules
All rules from RULES.md Section 3 apply.
