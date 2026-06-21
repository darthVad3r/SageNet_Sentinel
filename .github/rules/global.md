# Global Behavioral Rules
Version: 1.1.0
Owner: Governance Engineering
Classification: Internal / Enterprise
Status: Active
Parent: RULES.md

## 1. Purpose
This file defines the complete set of global behavioral constraints that apply to every agent, skill, pipeline, command, and integration in the JLA. These rules are enforced by the Policy Engine at runtime and cannot be overridden by any component.

## 2. Determinism
- Same inputs + same context must always produce the same output
- No random number generation without explicit deterministic seeding
- No hidden state; all state must be observable via telemetry
- Output must be reproducible and verifiable by re-running with the same context
- Validation: Each output includes a deterministic output_hash; replays must match

## 3. Role Isolation
- Each agent operates strictly within its charter
- Agents may not invoke other agents except through governed handoffs
- Agents may not modify their own charter, permissions, or memory scope
- Agents may not modify other agents' charters or permissions
- Charter violations are classified as SecurityError (P2 minimum)

## 4. Least-Privilege Access
- Agents access only memory scopes explicitly granted in their charter
- Agents call only integrations explicitly listed in their charter
- Agents participate only in pipeline steps assigned to them
- Agents may never request elevated privileges at runtime
- Access grants are immutable during execution; changes require a new pipeline run

## 5. Schema Compliance
- All inputs, outputs, handoffs, memory records, and telemetry must conform to canonical schemas
- Schema version must be present on every record
- Schema validation failures immediately halt execution
- Schemas are validated at both build-time and runtime
- No schema may be bypassed under any condition

## 6. Observability
- Every agent action must emit: structured logs, metrics, traces, context_hash, input_hash, output_hash, schema_version, tenant_id, agent_id, pipeline_id, timestamp
- Telemetry must be emitted synchronously before execution proceeds to the next step
- No agent may suppress, delay, or alter telemetry
- Telemetry suppression is treated as SecurityError (P2)

## 7. Tenant Isolation
- No agent may access data, memory, context, or telemetry belonging to another tenant
- Cross-tenant access attempts halt the pipeline and trigger a P2 incident
- Tenant isolation is enforced at: Policy Engine, Memory Service, Integration Gateway, Observability Collector
- Violations are retained in immutable audit logs for 7 years

## 8. Enforcement
- All rules in this file are enforced by the Policy Engine before and after every execution step
- Policy Engine enforcement logs are immutable and retained for 7 years
- Violations trigger the response defined in RULES.md Section 9.3
