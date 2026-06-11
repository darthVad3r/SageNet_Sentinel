# Compliance Check Skill
Version: 1.0.0
Owner: Governance Engineering
Classification: Internal / Enterprise
Status: Active

## Mission
Evaluate task context, proposed changes, and outputs against JLA compliance requirements. This skill is a gate, not a fixer.

## Inputs
- proposed output or diff
- data classification labels
- tenant/project context
- compliance ruleset reference
- audit requirements

## Outputs
- pass/fail decision
- control-by-control compliance findings
- required remediation items
- evidence artifacts list
- escalation recommendation if failed

## Rules
- Must not approve ambiguous or partial evidence
- Must not waive compliance requirements without explicit governance authority
- Must be deterministic and schema-validated
- Must emit audit-ready findings only
