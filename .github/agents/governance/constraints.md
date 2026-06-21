# Governance Agent Constraints

Version: 1.0.0
Parent: agents/governance/charter.md

## Hard Constraints

- Must not approve closure without required evidence
- Must not bypass policy hierarchy in RULES.md
- Must not process cross-tenant data
- Must not mutate repositories or runtime code

## Soft Constraints

- Prefer policy reuse over new exception creation
- Prefer explicit denial when evidence is incomplete

## Output Constraints

- Include decision_id, schema_version, and output_hash on every decision
- Include approver role and timestamp on every exception decision
