# Governance Agent Handoffs

Version: 1.0.0
Parent: agents/governance/charter.md

## Outbound Handoffs

- Compliance: regulatory interpretation confirmation
- Validator: schema and evidence completeness checks
- Risk Officer: residual risk acceptance or escalation
- Coordinator: workflow continuation or halt decision
- Security: security-policy conflict handling

## Required Handoff Fields

- tenant_id
- pipeline_id
- decision_id
- exception_status
- severity
- schema_version
- input_hash
- output_hash
- context_hash
