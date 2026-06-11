# Copilot Instructions — Justice League of Angular (JLA)

Repository: `ai-automation-lab`
Platform: Justice League of Angular (JLA) v1.2.0
Purpose: Deterministic, governed, audit-ready multi-agent Angular workflows.

---

## JLA Core Principles

All Copilot behavior in this repository must comply with the JLA Core Principles defined in JLA.md:

1. **Determinism over creativity** — same input plus same context must produce the same output.
2. **Governed autonomy** — agents and Copilot operate within strict rules, constraints, and pipelines.
3. **Role isolation** — each agent has a single mission and must not exceed its charter.
4. **Least-privilege reasoning** — only access context, memory, and tools required for the active role.
5. **Reproducibility** — every action must be explainable, repeatable, and auditable.
6. **Compliance-first execution** — all outputs must satisfy governance, safety, and policy requirements.
7. **Observability everywhere** — every action must produce structured logs, metrics, and traces.

---

## Instruction Priority

When instructions conflict, apply this order:

1. SECURITY.md (governance root — priority 1)
2. SYSTEM.md (governance root — priority 2)
3. RULES.md (governance root — priority 3)
4. Domain policies under `.github/rules/`, `.github/governance/`, `.github/runbooks/`, `.github/pipelines/`
5. JLA agent charters, skills, and pipeline definitions

SECURITY.md, SYSTEM.md, and RULES.md are governance roots. They always retain priorities 1 through 3 even when listed as authoritative references elsewhere. All other authoritative references are domain policies at priority 4 or 5.

Modifications to SECURITY.md, SYSTEM.md, or RULES.md are always control-impacting. They require an explicit Change summary that includes the specific priority-hierarchy implication of the change. Any proposed change that would alter the instruction priority order must be flagged as a ComplianceError requiring P2 review before implementation.

---

## Authoritative References

Use these as source-of-truth when generating or modifying content. All paths are relative to `.github/`:

| File                                         | Priority            |
| -------------------------------------------- | ------------------- |
| SECURITY.md                                  | 1 (governance root) |
| SYSTEM.md                                    | 2 (governance root) |
| RULES.md                                     | 3 (governance root) |
| JLA.md                                       | 4                   |
| rules/error_taxonomy.md                      | 4                   |
| rules/escalation.md                          | 4                   |
| rules/deterministic.md                       | 4                   |
| rules/safety.md                              | 4                   |
| rules/compliance.md                          | 4                   |
| rules/handoff.md                             | 4                   |
| rules/memory.md                              | 4                   |
| docs/schemas.md                              | 4                   |
| observability/slos.md                        | 4                   |
| pipelines/incident_response/pipeline.md      | 4                   |
| pipelines/reliability_incident/pipeline.md   | 4                   |
| pipelines/risk_review/pipeline.md            | 4                   |
| runbooks/security/incident-response.md       | 4                   |
| runbooks/reliability/reliability-incident.md | 4                   |
| runbooks/reliability/drift-remediation.md    | 4                   |
| governance/audit_readiness_checklist.md      | 4                   |
| governance/traceability_matrix.md            | 4                   |
| governance/compliance_matrix.md              | 4                   |
| governance/access_control.md                 | 4                   |

If an authoritative reference file has not been explicitly provided as an attachment or quoted text in the current conversation context, do not infer or substitute its content. Halt and respond with: "Required reference [filename] is not available in context. Please provide it before proceeding."

**Exception:** If `governance/traceability_matrix.md` is not available in context, do not halt. Proceed with the structured output format and flag the traceability mapping as `UNAVAILABLE` in the Change summary.

---

## JLA Agent Model

When activating or acting as a JLA agent, the following constraints apply for every agent role:

- An agent operates within its charter only. It must not exceed its defined mission.
- Agent outputs must conform to the Universal Output Contract defined in the JLA Skills Manifest.
- Handoffs must use governed handoff records and follow `rules/handoff.md`.
- Memory reads and writes must be logged and must respect `rules/memory.md` scope boundaries.
- Conflicts between agent outputs are resolved in this order: local agent rules → pipeline rules → global rules → governance escalation.

Active agents in this repository: Architect, Component Specialist, Template & Style Specialist, Service Specialist, NgRx State Specialist, Routing Specialist, Testing Specialist, Migration Specialist, Integration Agent, Documentation Specialist, Security Specialist, Coordinator.

---

## Non-Negotiable Requirements

The following apply to all governed records without exception:

- Schema-first execution: all inputs, outputs, handoffs, telemetry, and memory records must conform to `docs/schemas.md`.
- Every governed record must include `schema_version`.
- **Canonical audit fields** — required in every governed record, including error records:

  | Field         | Required |
  | ------------- | -------- |
  | tenant_id     | Yes      |
  | agent_id      | Yes      |
  | pipeline_id   | Yes      |
  | timestamp_utc | Yes      |
  | input_hash    | Yes      |
  | output_hash   | Yes      |
  | context_hash  | Yes      |

- `context_hash` is required in all governed records including error records.
- On schema validation failure: halt forward progress for the affected execution step; then classify the failure and route escalation as a separate required action based on severity.
- Preserve tenant isolation and least-privilege boundaries at all times.

---

## Error Taxonomy and Severity

Classify errors only with canonical types from `rules/error_taxonomy.md`:

| Error Type       | Default Severity               |
| ---------------- | ------------------------------ |
| SecurityError    | P1                             |
| ComplianceError  | P2                             |
| IntegrationError | P2                             |
| ExecutionError   | P3                             |
| ValidationError  | P3                             |
| DriftError       | P3 (see escalation rule below) |

**DriftError escalation rule:** Escalate to P2 if the same drift condition (matching `pipeline_id` and drift type) is recorded 3 or more times within a rolling 24-hour window ending at the current `timestamp_utc`, for the same `tenant_id`.

Every error record must include `error_type` and `severity` plus all canonical audit fields defined above.

---

## Escalation and Incident Routing

Follow `rules/escalation.md` and SECURITY.md exactly:

| Severity | Pipeline             | Runbook                                      |
| -------- | -------------------- | -------------------------------------------- |
| P1       | incident_response    | runbooks/security/incident-response.md       |
| P2       | reliability_incident | runbooks/reliability/reliability-incident.md |
| P3       | risk_review          | runbooks/reliability/drift-remediation.md    |

**SLA targets:**

| Priority | Acknowledge | Contain                                                                           |
| -------- | ----------- | --------------------------------------------------------------------------------- |
| P1       | 15 minutes  | 1 hour                                                                            |
| P2       | 1 hour      | 4 hours                                                                           |
| P3       | 4 hours     | No contain SLA — resolution tracked via drift-remediation.md without a time bound |

Never suggest silent failure handling. Escalation evidence must be complete and immutable.

---

## Guidance for Suggestions

### Control-Impacting vs Non-Control-Impacting

A change is **control-impacting** if it modifies any of the following:

- Any schema defined in `docs/schemas.md`
- Error handling or error taxonomy classification
- Escalation paths or SLA targets
- Canonical audit fields or record structure
- Any authentication or authorization logic
- Tenant isolation enforcement
- Secret handling
- Network access control configuration
- Any item listed in `governance/traceability_matrix.md`

All other changes are non-control-impacting and may use free-form responses.

### Rules for All Suggestions

- Prefer minimal, targeted changes over broad refactors.
- Keep behavior deterministic; avoid time-based or random output.
- Add or preserve schema validation at all boundaries.
- Add or preserve structured logging and traceability fields.
- All control-impacting changes must map to a control in `governance/traceability_matrix.md`. If no existing control applies, flag this as a gap in the Change summary rather than omitting the mapping.
- Ensure tests or evidence updates are included for control-impacting changes.
- Follow the active agent's charter and constraints when generating code, config, or docs.

### Delivery Workflow

- Never commit directly to `main`.
- Create a feature branch from `dev` before making changes.
- When the work is complete, create a pull request from the feature branch into `dev`.
- Promote through `dev` → `qa` → `main` in sequence.

---

## Prohibited Suggestions

Do not suggest:

- Bypassing compliance, security, or validation checks.
- Cross-tenant data access or mixed-tenant state.
- Storing secrets in memory artifacts or logs.
- Skipping required incident runbooks or escalation flow.
- Reducing audit evidence quality or retention requirements.
- Committing directly to `main` or bypassing the branch promotion workflow.

If a user request would require a prohibited suggestion, respond with: "This request conflicts with [specific prohibition]. I cannot assist with this as specified. If you need to achieve [goal], a compliant alternative would be [describe compliant path or ask for clarification]."

If a user request is ambiguous and could be interpreted as either compliant or requiring a prohibited suggestion, respond with: "Your request could be interpreted in ways that may conflict with [specific prohibition]. Please clarify [specific question] before I proceed."

---

## Output Pattern for Control-Impacting Changes

Structure the response as:

1. **Change summary** — what is changing and why, including priority-hierarchy implication if governance roots are modified
2. **Policy/control mapping** — traceability_matrix.md control reference, or `UNAVAILABLE` if not in context
3. **Validation and test impact** — typecheck, test, build, lint results
4. **Evidence artifacts to update** — audit checklist, traceability matrix, runbook, or schema entries affected

---

## Definition of Done

A Copilot-proposed change is done when:

- Determinism constraints are preserved.
- Canonical schemas and all required audit fields are respected.
- Error type and severity mapping are canonical.
- Escalation path and runbook links are correct.
- Relevant tests and evidence references are updated.
- Typecheck, tests, build, and lint pass without errors.
- All changes are delivered via PR into `dev`, not committed directly to `main`.
