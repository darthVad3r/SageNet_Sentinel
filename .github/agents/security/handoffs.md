# Security Agent Handoffs

Version: 1.0.0
Parent: agents/security/charter.md

## Outbound Handoffs

- Governance: policy exception decisions and closure approval
- Compliance: regulatory impact validation
- Validator: evidence completeness and schema validation
- Risk Officer: risk register updates
- Coordinator: incident timeline and action routing

## Required Handoff Fields

- tenant_id
- pipeline_id
- incident_id
- severity
- error_type
- schema_version
- input_hash
- output_hash
- context_hash
