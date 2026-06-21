# Validate Skill — Outputs
Version: 1.0.0

## Required Output Fields
- output_type
- schema_version
- tenant_id
- agent_id or skill_id as applicable
- input_hash
- output_hash
- context_hash
- timestamp

## Quality Requirements
- Deterministic for identical inputs
- Schema-validated
- Provenance-preserving
- Audit-ready
- No unsupported assumptions

## Downstream Use
- Outputs must be suitable for handoff to the next agent or pipeline step
- Invalid outputs must be quarantined or rejected
