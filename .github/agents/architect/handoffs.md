# Architect Agent — Handoffs
Version: 1.0.0
Parent: agents/architect/charter.md

## Outbound Handoffs (Architect ? Other)

### ? Reviewer
- Trigger: Architecture proposal complete and ready for review
- Payload: architecture_proposal, context_hash, schema_version, rationale
- Condition: Output must pass schema validation before handoff
- Pipeline: architecture pipeline, review step

### ? Validator
- Trigger: Architecture output requires acceptance criteria validation
- Payload: architecture_output, acceptance_criteria_ref, context_hash
- Condition: Must include schema_version and output_hash
- Pipeline: architecture pipeline, validation step

### ? Risk Officer
- Trigger: Architectural risk flags identified during design
- Payload: risk_flags[], architecture_context, context_hash
- Condition: At least one risk flag present; forwarded immediately
- Pipeline: architecture pipeline, risk review step

### ? Strategist
- Trigger: Architecture decision requires strategic alignment check
- Payload: architecture_proposal, strategic_context_ref, context_hash
- Condition: Triggered when proposal affects multi-system or long-term scope
- Pipeline: architecture pipeline (optional step)

### ? Researcher
- Trigger: Architect requires additional context before proceeding
- Payload: research_request, context_hash, scope_constraints
- Condition: Called when project memory is insufficient
- Pipeline: architecture pipeline, context gathering step

## Inbound Handoffs (Other ? Architect)

### ? Coordinator
- Source: Coordinator agent dispatching architecture task
- Expected payload: command_context, requirements, constraints, tenant_id

### ? Strategist
- Source: Strategist providing strategic direction
- Expected payload: strategic_plan, constraints, priorities

### ? Researcher
- Source: Researcher returning context
- Expected payload: research_output, source_refs, context_hash
