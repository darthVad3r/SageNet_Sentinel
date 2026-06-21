# Handoff Rules
Version: 1.1.0
Owner: Governance Engineering
Classification: Internal / Enterprise
Status: Active
Parent: RULES.md

## 1. Purpose
This file defines the rules governing agent-to-agent handoffs within the JLA. Handoffs are the only mechanism by which control passes between agents.

## 2. Required Handoff Fields
Every handoff must include the following fields (validated against the canonical Handoff Schema):
- from_agent_id
- to_agent_id
- handoff_reason
- input schema reference + input_hash
- output schema reference + output_hash
- context_hash
- timestamp (UTC)
- tenant_id
- pipeline_id
- schema_version

Any handoff missing required fields is rejected immediately.

## 3. Valid Handoff Conditions
A handoff is valid only if ALL of the following are true:
- The receiving agent is explicitly listed in the pipeline definition for this step
- The receiving agent's charter covers the task being handed off
- The handoff record passes schema validation
- The handoff passes compliance validation
- The context_hash matches the pipeline's active context
- The tenant_id is consistent with the pipeline's tenant scope

## 4. Invalid Handoff Behavior
On invalid handoff:
1. Pipeline halts immediately
2. Handoff payload quarantined; no data forwarded to receiving agent
3. Error logged with: from_agent_id, to_agent_id, failure_reason, context_hash, tenant_id
4. P2 incident triggered
5. Governance owner notified within 1 hour
6. All downstream pipeline steps blocked until incident resolved
7. Handoff may only be retried with explicit Governance owner approval

## 5. Handoff Audit Trail
Every handoff (valid or invalid) must produce an immutable audit record:
- from_agent_id, to_agent_id, handoff_reason
- timestamp (UTC), tenant_id, pipeline_id
- input_hash, output_hash, context_hash
- schema_version
- validation_result (pass/fail + reason)

Retained for 7 years.

## 6. Handoff Chain Integrity
- Handoffs must be traceable end-to-end through a pipeline execution trace
- No gaps in the handoff chain are permitted
- Any gap triggers a P2 incident
- Trace spans must link all handoffs within a pipeline execution

## 7. Forbidden Handoff Behaviors
- Agents may not initiate handoffs outside of authorized pipeline steps
- Agents may not handoff to agents not listed in the pipeline
- Agents may not pass secrets, tokens, or credentials in handoff payloads
- Agents may not modify handoff payloads after signing (output_hash is immutable)
- Self-handoff (from_agent_id == to_agent_id) is forbidden

## 8. Enforcement
- Handoff validation is performed by the Policy Engine before the receiving agent executes
- Handoff audit records are immutable and retained for 7 years
- Violations are classified per RULES.md Section 9.3
