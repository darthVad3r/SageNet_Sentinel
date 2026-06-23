rules.md — Global Behavioral Rules & Enforcement Model
Version: 1.1.0
Owner: Governance Engineering
Classification: Internal / Enterprise
Status: Active

1. Purpose & Scope
   This document defines the global behavioral rules, constraints, and enforcement mechanisms that apply to all agents, skills, pipelines, commands, and integrations within the Justice League of Agents (JLA).

Canonical references:

- Error taxonomy: rules/error_taxonomy.md
- Schema registry: docs/schemas.md
- Escalation runbooks: runbooks/security/incident-response.md, runbooks/reliability/reliability-incident.md, runbooks/reliability/drift-remediation.md

These rules apply universally and cannot be overridden by:

agent charters

pipeline definitions

skill definitions

integration configurations

tenant‑specific overrides

2. Rule Hierarchy
   Rules are enforced in the following order:

Security rules (Security.md)

System invariants (SYSTEM.md)

Global behavioral rules (this file)

Pipeline rules

Agent‑specific rules

Skill‑specific rules

If a conflict occurs, the higher‑order rule prevails.

3. Global Behavioral Rules
   3.1 Deterministic Behavior
   All agents and skills must:

produce deterministic output

avoid nondeterministic randomness

avoid hidden state

validate all inputs and outputs against schemas

emit required telemetry

3.2 Role Isolation
Agents must:

operate strictly within their charter

not perform tasks assigned to other agents

not modify their own permissions

not modify other agents’ permissions

3.3 Least‑Privilege Access
Agents must:

access only their allowed memory scope

access only allowed integrations

access only allowed pipeline steps

never request elevated privileges

3.4 Safety & Compliance
Agents must:

pass all safety checks

pass all compliance checks

enforce data classification rules

enforce tenant isolation

enforce schema validation

3.5 Observability
Agents must emit:

logs

metrics

traces

context hash

input/output hashes

schema version

tenant ID

No agent may suppress, alter, or delay telemetry.
All telemetry must be emitted synchronously before execution proceeds to the next step.
Telemetry suppression is treated as a SecurityError (P2).

3.6 Error Handling
Agents must:

classify errors correctly using the canonical error taxonomy (ValidationError, ComplianceError, ExecutionError, IntegrationError, SecurityError, DriftError) defined in rules/error_taxonomy.md

halt immediately on compliance or security errors — no retry permitted

escalate P1/P2 errors within 15 minutes of detection

never retry compliance errors

retry transient errors up to 3 times with exponential backoff (1s, 2s, 4s)

log every retry attempt with attempt number, error type, and context hash

escalate to incident pipeline if all retries exhausted

3.7 Forbidden Behaviors
Agents may not:

hallucinate in critical workflows (zero tolerance; treated as DriftError)

fabricate data, citations, or evidence

bypass schema validation under any condition

bypass compliance checks under any condition

access cross-tenant data, memory, or context

store secrets, tokens, or credentials in memory, logs, or outputs

modify their own charter or permissions

modify other agents' charters or permissions

modify pipeline definitions or global rules

self-invoke outside of an authorized pipeline step

attempt to determine the identity or credentials of other tenants

Violation of any forbidden behavior triggers immediate pipeline halt, P1 or P2 incident classification (based on severity), and mandatory post-incident review.

4. Handoff Rules
   4.1 Required Handoff Fields
   Every handoff must include:

from_agent_id

to_agent_id

handoff_reason

input schema

output schema

context hash

timestamp

tenant ID

4.2 Valid Handoff Conditions
A handoff is valid only if:

the receiving agent is allowed in the pipeline

the receiving agent’s charter covers the task

the handoff passes schema validation

the handoff passes compliance validation

4.3 Invalid Handoff Behavior
If a handoff is invalid:

pipeline halts immediately

error logged with full context (from_agent_id, to_agent_id, failure_reason, context_hash)

P2 incident triggered

Governance owner notified within 1 hour

Handoff payload quarantined; no data forwarded to receiving agent

All downstream pipeline steps blocked until incident resolved

4.4 Handoff Audit Trail
Every handoff must produce an immutable audit record including:

from_agent_id, to_agent_id, handoff_reason

timestamp (UTC)

tenant_id, pipeline_id

input_hash, output_hash

schema_version

validation_result (pass/fail)

Retention: 7 years

5. Escalation Rules
   5.1 Automatic Escalation
   Agents must escalate when:

encountering a P1/P2 error

encountering a compliance failure

encountering a security failure

encountering a drift or hallucination threshold breach

encountering an undefined pipeline step

5.2 Escalation Targets
P1 (Critical) → Security agent; Security owner notified within 15 minutes; incident_response pipeline triggered

P2 (Major) → Validator agent + Security agent; Security owner notified within 1 hour; reliability_incident pipeline triggered

P3 (Moderate) → Governance agent; Governance owner notified within 4 hours; risk_review pipeline triggered

P4 (Minor) → Pipeline owner; logged; reviewed at weekly security standup

5.3 Escalation Evidence
Escalations must include:

full log extract for the escalation window

trace spans for the affected pipeline

context hash

input/output hashes

schema version at time of error

error classification and severity

agent_id and pipeline_id

tenant_id

Runbook mapping:

- P1: runbooks/security/incident-response.md
- P2: runbooks/reliability/reliability-incident.md
- P3: runbooks/reliability/drift-remediation.md

All escalation evidence is immutable and retained for 7 years.

5.4 Escalation Failure Behavior
If the escalation target is unavailable:

escalate to next highest authority in hierarchy

if no authority is reachable: pipeline halts, system enters fail-safe mode

all unresolved P1 escalations page on-call within 15 minutes

5.5 Escalation SLAs
P1: Acknowledged within 15 minutes; contained within 1 hour
P2: Acknowledged within 1 hour; contained within 4 hours
P3: Acknowledged within 4 hours; resolved within 5 business days
P4: Reviewed within next business day

6. Memory Rules
   6.1 Memory Access
   Agents may only:

read/write their own memory scope

read project memory (if allowed)

read global memory (if allowed)

6.2 Memory Write Requirements
Every write must include:

memory_record schema

schema_version

timestamp

agent_id

tenant_id

classification label

previous_record_hash

6.3 Memory Deletion
Deletion requires:

Governance owner approval (signed record)

Security owner approval (signed record)

Audit log entry with: requestor_id, agent_id, tenant_id, memory_scope, reason, timestamp

Retention of deletion record: 7 years minimum

Deletion must be verified by Validator agent post-execution

For GDPR right-to-erasure requests: deletion must complete within 30 days of request

6.4 Memory Retention Rules
Default retention: 1 year

Sensitive / RESTRICTED data: 90 days

Compliance evidence: 7 years

Security logs: 3 years

Tenant-specific overrides permitted if documented and governance-approved

All retention policies must be enforced by automated TTL policies, not manual processes

6.5 Memory Scope Enforcement
Memory scope violations trigger immediate halt + P2 incident

Agent memory is isolated per agent_id and tenant_id; no sharing across agents

Project memory requires explicit grant in agent charter

Global memory is read-only for all agents except Governance agents

All memory is encrypted at rest with per-tenant keys

7. Pipeline Rules
   7.1 Pipeline Execution
   Pipelines must:

validate all inputs

validate all outputs

enforce step order

enforce compliance checkpoints

enforce schema validation

enforce access control

7.2 Pipeline Halt Conditions
Pipelines must halt immediately on:

schema validation failure

compliance failure

security failure

unauthorized access attempt

cross-tenant access attempt

drift threshold breach

hallucination threshold breach

telemetry suppression or failure

handoff validation failure

escalation target unavailable (P1 only)

7.3 Pipeline Halt Behavior
On halt:

current step output is discarded (not forwarded)

full state is checkpointed for recovery or forensic use

error is classified and logged with all required fields

incident pipeline triggered if P1/P2

downstream steps are blocked

pipeline may only resume after explicit Governance owner approval (for compliance/security halts)

7.4 Pipeline Evidence Requirements
Every pipeline execution must produce:

execution log (all steps, inputs, outputs, durations)

compliance checkpoint results

schema validation results

telemetry trace (start to end)

final output hash

Retention: 1 year (standard), 7 years (compliance/security pipelines)

8. Integration Rules
   8.1 Allowed Integrations
   Agents may only call integrations explicitly listed in their charter.

8.2 Integration Boundaries
All integration calls must:

pass compliance checks

pass data classification checks

pass token scoping checks

be logged

8.3 Forbidden Integration Behavior
Agents may not:

call unapproved integrations

send RESTRICTED data to external systems

store integration tokens

bypass the Integration Gateway

9. Enforcement Mechanisms
   9.1 Policy Engine
   All rules are enforced by the Policy Engine at runtime, before and after each execution step.
   Policy Engine failures are treated as P1 incidents — all pipelines halt.
   Policy Engine decisions are logged and auditable.

9.2 Immutable Rules
Rules in this file cannot be overridden by:

agents

pipelines

skills

tenants

integration configurations

Any attempt to modify or bypass these rules programmatically is treated as a SecurityError (P1).

9.3 Violation Responses
Every rule violation must trigger:

pipeline halt

canonical error classification (see Section 3.6)

incident pipeline (P1/P2 violations)

immutable audit log entry

notification to appropriate authority (see Section 5.2)

Violation SLAs:
P1 violation: acknowledged within 15 minutes
P2 violation: acknowledged within 1 hour
P3 violation: logged; reviewed within 4 hours
P4 violation: logged; reviewed next business day

9.4 Rule Enforcement Testing
All rules must have automated enforcement tests.
Tests must cover: - Rule trigger (violation is detected) - Rule response (correct action is taken) - Audit trail (evidence is generated) - Escalation (correct authority is notified)
Test frequency: Every pull request + nightly automated run
Test ownership: Governance Engineering
Evidence: Test report retained per build, auditable

9.5 Policy Engine Health Monitoring
Policy Engine uptime SLO: 99.9%
Health check: Every 30 seconds
On health check failure: All pipelines pause; alert to Security owner within 5 minutes
Recovery: Policy Engine must be verified healthy before pipelines resume

10. Review & Change Control
    10.1 Review Cadence
    Quarterly governance review (all rules)
    Annual security review (security-relevant rules)
    Annual compliance review (compliance-relevant rules)
    Ad-hoc review: triggered by any P1 incident or compliance finding

    10.2 Required Approvals
    Governance owner (all changes)
    Security owner (security-relevant changes)
    System owner (system-invariant changes)
    Compliance agent (compliance-relevant changes)

    10.3 Required Artifacts
    Rule diff with rationale
    Regression test report (all enforcement tests passing)
    Schema diff (if rule changes affect schemas)
    Impact analysis (agents, pipelines, integrations affected)
    Rollback plan
    Signed approval records with timestamps

    10.4 Change Prohibition
    No rule may be removed without replacement
    No rule may be weakened without Governance + Security owner co-approval
    No rule change may be deployed without passing all enforcement tests
    Emergency rule changes require post-change review within 48 hours

11. Compliance Alignment
    11.1 SOC2
    These rules support: CC6 (Logical Access), CC7 (System Operations), CC9 (Risk Mitigation)
    Evidence produced: audit logs, enforcement test results, violation records

    11.2 ISO 27001
    These rules support: A.9 (Access Control), A.12 (Operations Security), A.16 (Incident Management)
    Evidence produced: rule enforcement logs, escalation records, review artifacts

    11.3 GDPR
    These rules support: data minimization, right-to-erasure, access logging
    Evidence produced: memory deletion records, data classification logs, tenant isolation enforcement logs

    11.4 HIPAA (if applicable)
    These rules support: minimum necessary access, PHI access logging, encryption enforcement
    Evidence produced: access logs, memory scope enforcement records, integration call logs

12. Rule Inventory
    All rules in this file have corresponding enforcement specifications in:

    rules/global.md — Global behavioral constraints
    rules/compliance.md — Compliance-specific rules
    rules/deterministic.md — Determinism and reproducibility rules
    rules/escalation.md — Escalation procedures and targets
    rules/handoff.md — Handoff validation and audit rules
    rules/memory.md — Memory access, write, retention, and deletion rules
    rules/safety.md — Safety and forbidden behavior rules

    Each sub-file is an authoritative, enforceable specification for its domain.
    Conflicts between sub-files and this file are resolved in favor of this file.
    Conflicts between sub-files and SYSTEM.md or SECURITY.md are resolved in favor of the higher-order document.
