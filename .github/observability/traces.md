# Traces

Version: 1.0.0
Owner: Platform Engineering
Classification: Internal / Enterprise
Status: Active

## 1. Purpose

This document defines the trace standard for the JLA. Traces provide end-to-end visibility into command execution, pipeline flow, agent handoffs, and failure points.

## 2. Tracing Principles

- Every command execution must have a root trace
- Every pipeline step must create a span
- Every handoff must create a child span
- Every integration call must be traced
- Every validation and compliance checkpoint must be traceable

## 3. Required Trace Fields

Each trace or span must include:

- trace_id
- span_id
- parent_span_id
- tenant_id
- agent_id
- skill_id
- pipeline_id
- command_id
- event_type
- timestamp
- duration_ms
- status
- context_hash
- input_hash
- output_hash
- schema_version

## 4. Trace Topology

- Command invocation starts the root span
- Coordinator owns orchestration spans
- Agent execution spans are nested under the owning pipeline step
- Validation and compliance spans must be linked to the step they validate
- Incident response traces must preserve the original trace lineage

## 5. Sampling

- Default sampling: 10%
- Critical incidents: 100%
- Compliance and security incidents: 100%
- Sampling rate changes require governance approval

## 6. Retention

- Standard traces: 30 days
- Incident traces: 1 year
- Audit-relevant traces: 7 years

## 7. Trace Integrity

- Trace context must not be broken across handoffs
- Cross-tenant trace propagation is forbidden
- Missing parent-child relationships must be logged as an integrity issue

## 8. Operational Use

Traces are used for debugging, root cause analysis, handoff verification, and proving step ordering during audits.
