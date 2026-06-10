# JLA Operational Guide: How-To Workflows

**Version:** 1.0.0 | **Owner:** Governance Engineering | **Status:** Active

## Purpose

This guide provides step-by-step procedures for common JLA operational tasks: invoking agents, running pipelines, validating determinism, handling incidents, and preparing for audit.

## Table of Contents

1. [Architecture & Design Workflows](#architecture--design-workflows)
2. [Incident Response Workflows](#incident-response-workflows)
3. [Reliability & Operations](#reliability--operations)
4. [Validation & Testing](#validation--testing)
5. [Compliance & Audit Prep](#compliance--audit-prep)
6. [Common Tasks & Recipes](#common-tasks--recipes)

---

## Architecture & Design Workflows

### How to Generate an Architecture Proposal

**When to use:** You need a new system architecture, technical decision record (ADR), or architecture evaluation.

**Step 1: Review Requirements**

- Gather high-level requirements (scope, stakeholders, constraints)
- Check [agents/architect/charter.md](../agents/architect/charter.md) for what Architect can do
- Review [pipelines/architecture/pipeline.md](../pipelines/architecture/pipeline.md) for the pipeline requirements

**Step 2: Prepare Context**

```yaml
command: generate_architecture
tenant_id: your-tenant-id
scope: "System design for [project name]"
constraints:
  - "Must support 1M requests/day"
  - "Multi-region deployment"
  - "Cost limit: $X/month"
required_agents:
  - Architect
  - Researcher (for context)
  - Validator (for approval)
```

**Step 3: Invoke the Pipeline**

- Trigger [pipelines/architecture/pipeline.md](../pipelines/architecture/pipeline.md)
- Architect agent processes requirements and generates proposal
- Proposal is schema-validated before handoff

**Step 4: Review Output**

- Output includes: architecture proposal, ADRs, risk flags, evidence hashes
- Validator agent confirms determinism and compliance
- Reviewer agent may provide feedback

**Step 5: Escalate or Approve**

- If approved: Architecture record is stored in project memory
- If gaps: Escalate to Strategist or Risk Officer
- All decisions are auditably logged with hashes

**Evidence Collected:**

- Architecture proposal document (with schema_version, output_hash)
- Input context hash, decision timestamps
- Validation and compliance check results
- Approver sign-offs

---

## Incident Response Workflows

### How to Handle a P1 Security Incident

**When to use:** Cross-tenant access attempt, key compromise, data leakage, or active security breach.

**Step 1: Detect and Classify**

- Alert monitoring detects potential P1 event
- Classify severity as P1 (Critical) using [rules/error_taxonomy.md](../rules/error_taxonomy.md)
- If confirmed P1: immediately trigger incident_response pipeline

**Step 2: Invoke Incident Response Pipeline**

```yaml
incident_id: INC-YYYYMMDD-001
severity: P1
error_type: SecurityError
detected_at_utc: 2026-06-10T15:45:00Z
tenant_id: affected-tenant-id
affected_pipeline: [pipeline-name]
runbook: /runbooks/security/incident-response.md
```

**Step 3: Follow Runbook**

- Open [runbooks/security/incident-response.md](../runbooks/security/incident-response.md)
- Execute detection verification steps
- Containment steps: freeze affected pipelines, revoke credentials, block integrations
- Escalate to Security owner within 15 minutes per SLA (see [rules/escalation.md](../rules/escalation.md))

**Step 4: Coordinate Response**

- Security agent verifies control integrity and tenant scope
- Governance agent confirms policy implications
- Compliance agent handles regulatory notification (if GDPR/HIPAA apply)
- Validator agent confirms evidence completeness

**Step 5: Eradication & Recovery**

- Patch identified control gap
- Rotate affected credentials/keys per [SECURITY.md](../SECURITY.md#83-rotation-policy)
- Re-enable controlled workflows in phases
- Validator re-validates post-recovery state

**Step 6: Document and Close**

- Root cause analysis within 5 business days
- Remediation plan with owners and due dates
- Update risk register ([governance/risk_register.md](../governance/risk_register.md))
- Governance owner sign-off on closure
- All evidence retained for 7 years

**Evidence Collection:**

- Incident record with incident_id, severity, error_type
- Full log extract (time-bounded to incident window)
- Trace spans for affected pipelines
- Context hash, input/output hashes, schema_version
- Escalation timestamps and notifications
- Runbook completion checklist

---

### How to Handle a P2 Reliability Incident

**When to use:** Reproducibility failure, SLO breach, authentication failure burst, or schema subversion.

**Step 1: Detect Issue**

- Monitoring detects SLO breach, reproducibility failure, or integration error burst
- Classify severity as P2 (Major) per [rules/error_taxonomy.md](../rules/error_taxonomy.md)
- Populate incident template:

```yaml
incident_id: INC-RELIABILITY-001
severity: P2
error_type: ValidationError | IntegrationError | DriftError
detected_at_utc: 2026-06-10T14:30:00Z
tenant_id: affected-tenant
runbook: /runbooks/reliability/reliability-incident.md
```

**Step 2: Trigger Reliability Incident Pipeline**

- Invoke [pipelines/reliability_incident/pipeline.md](../pipelines/reliability_incident/pipeline.md)
- Pipeline freezes affected segments and routes through required agents

**Step 3: Execute Runbook**

- Open [runbooks/reliability/reliability-incident.md](../runbooks/reliability/reliability-incident.md)
- Validator verifies reproducibility check results and schema conformance
- Security verifies control integrity and tenant impact
- Containment: apply temporary controls, freeze pipeline segments

**Step 4: Remediate**

- Root cause: prompt drift, schema drift, or integration behavior change
- Apply fix and re-run determinism + drift tests
- Governance reviews and approves remediation plan

**Step 5: Recover**

- Re-validate after fix using [tests/determinism.md](../tests/determinism.md)
- Restore pipeline execution after governance sign-off
- Monitor for 72 hours post-recovery

**Step 6: Close**

- Update risk register with remediation outcome
- Close incident when residual risk is accepted

**Evidence Collection:**

- Incident record with P2 classification
- Validation reports (reproducibility, schema, SLO)
- Determinism test run results
- Drift comparison reports
- Remediation plan and approvals

---

## Reliability & Operations

### How to Run a Determinism Test

**When to use:** Validate that same input + same context produces same output_hash (required by [rules/deterministic.md](../rules/deterministic.md)).

**Step 1: Prepare Test Input**

- Select a representative prompt/context pair
- Record input_hash, context_hash, and timestamp
- Document expected output_hash (or baseline from previous run)

**Step 2: Execute Test 1**

```bash
pipeline_id: determinism-test-1
input_hash: sha256:abc123...
context_hash: sha256:def456...
timestamp_utc: 2026-06-10T10:00:00Z
run_id: DRYRUN-2026-06-10-TEST1
```

- Execute pipeline with test input
- Capture output_hash, logs, and traces

**Step 3: Execute Test 2**

- Repeat Step 2 with identical input and context
- Capture output_hash, logs, and traces

**Step 4: Compare Results**

- Compare output_hash from Test 1 and Test 2
- Compare schema_version values
- Compare all required telemetry fields

**Step 5: Record Evidence**

```yaml
test_id: DETER-2026-06-10-001
test_run_1:
  run_id: DRYRUN-2026-06-10-TEST1
  output_hash: sha256:xyz789...
  schema_version: 1.0.0
  timestamp: 2026-06-10T10:00:00Z
test_run_2:
  run_id: DRYRUN-2026-06-10-TEST2
  output_hash: sha256:xyz789...
  schema_version: 1.0.0
  timestamp: 2026-06-10T10:05:00Z
result: PASS (hashes match)
reviewer: platform_engineer
approval: approved
```

**Step 6: Log Evidence**

- Store evidence in audit logs per [governance/audit.md](../governance/audit.md)
- Link to [tests/determinism.md](../tests/determinism.md) procedure
- If FAIL: trigger risk_review pipeline or incident_response depending on severity

---

### How to Run a Drift Test

**When to use:** Validate quality/behavior stability against 30-day baseline (required by [rules/deterministic.md](../rules/deterministic.md#7-drift-detection)).

**Step 1: Establish or Retrieve Baseline**

- Week 1: Run reference sample set and record scores
- Weeks 2-4: Accumulate weekly evaluation scores
- Calculate 30-day average and standard deviation

**Step 2: Execute Current Week Evaluation**

```yaml
test_id: DRIFT-2026-06-10-WEEK5
baseline_window: 2026-05-13 to 2026-06-09
baseline_avg: 0.92
baseline_std_dev: 0.03
current_evaluation_date: 2026-06-10
sample_size: 100
```

- Run reference sample set with current system
- Record evaluation scores

**Step 3: Calculate Drift**

- Calculate current week average: e.g., 0.88
- Drift = (baseline_avg - current_avg) / baseline_avg = (0.92 - 0.88) / 0.92 = 4.3%
- Threshold per [rules/deterministic.md](../rules/deterministic.md): 5% max deviation

**Step 4: Assess Result**

- Drift within threshold (< 5%): PASS, continue monitoring
- Drift exceeds threshold (>= 5%): BREACH, escalate to risk_review pipeline
- Three consecutive breaches: escalate to P2 and trigger rollback evaluation

**Step 5: Record Evidence**

```yaml
test_id: DRIFT-2026-06-10-WEEK5
baseline_avg: 0.92
current_avg: 0.88
drift_percent: 4.3
threshold: 5.0
result: PASS
evidence_artifacts:
  - baseline_report.pdf
  - current_evaluation_report.pdf
  - drift_calculation.csv
reviewer: validator_agent
approval: approved
```

---

### How to Run a Hallucination Test

**When to use:** Validate output accuracy against threshold of <= 0.5% unsupported claims (required by [SECURITY.md](../SECURITY.md#423-hallucination-detection)).

**Step 1: Select Sample**

- Random sample of 100-200 recent production outputs
- Stratify by agent, pipeline, and tenant if possible
- Record sample_id, output_id, timestamp

**Step 2: Manual Review**
For each output:

- Read the response carefully
- Identify any claims that lack supporting evidence or are contradicted by source material
- Mark claim as "supported", "unsupported", or "hallucinated"
- Document justification

**Step 3: Calculate Rate**

```yaml
sample_size: 150
hallucinations_found: 0
unsupported_claims: 1
supported_claims: 149
hallucination_rate: (0 + 1) / 150 = 0.67%
threshold: 0.5%
result: BREACH
```

**Step 4: Assess Result**

- Hallucination_rate <= 0.5%: PASS
- Hallucination_rate > 0.5%: escalate to Validator and trigger risk_review pipeline

**Step 5: Record Evidence**

```yaml
test_id: HALLUCIN-2026-06-10-001
sample_size: 150
hallucination_rate: 0.67%
threshold: 0.5%
result: BREACH
escalation_status: ROUTED_TO_RISK_REVIEW
evidence_artifacts:
  - sample_review_sheet.xlsx
  - unsupported_claim_examples.md
reviewer: validator_agent
escalation_date: 2026-06-10T11:00:00Z
```

---

## Validation & Testing

### How to Run the Full Test Suite

**When to use:** Pre-release validation or nightly automated run.

**Step 1: Trigger Test Batch**

```yaml
batch_id: TESTS-2026-06-10-NIGHTLY
triggered_by: automated_scheduler
test_suite:
  - determinism (tests/determinism.md)
  - drift (tests/drift.md)
  - hallucination (tests/hallucination.md)
  - acceptance (tests/acceptance.md)
  - regression (tests/regression.md)
schema_version: 1.0.0
```

**Step 2: Execute in Parallel**

- Determinism: 10–15 min
- Drift: 20–30 min (includes baseline comparison)
- Hallucination: 30–45 min (manual review component)
- Acceptance: 15–20 min
- Regression: 20–25 min

**Step 3: Aggregate Results**

```yaml
batch_id: TESTS-2026-06-10-NIGHTLY
determinism: PASS
drift: PASS
hallucination: PASS
acceptance: PASS
regression: PASS
overall_result: PASS
duration_minutes: 120
completed_at_utc: 2026-06-10T23:59:59Z
```

**Step 4: Report**

- Store batch report in audit logs
- If any FAIL: escalate to responsible agent (Validator, Researcher, etc.)
- If all PASS: mark for release approval

---

## Compliance & Audit Prep

### How to Populate the Audit Readiness Checklist

**When to use:** Preparing for external audit or compliance review.

**Step 1: Open Checklist**

- Open [governance/audit_readiness_checklist.md](../governance/audit_readiness_checklist.md)
- Review all 10 controls (AR-001 through AR-010)

**Step 2: For Each Control:**

**AR-001: Canonical schema registry exists and is referenced**

- Review [docs/schemas.md](../docs/schemas.md) exists ✓
- Confirm SYSTEM.md references it ✓
- Confirm RULES.md references it ✓
- Run schema validation check and capture output
- Status: **PASS** | Evidence Link: `governance/mock_evidence_sample.md`

**AR-002: Canonical error taxonomy enforced**

- Review [rules/error_taxonomy.md](../rules/error_taxonomy.md) exists ✓
- Confirm error_type mapping is complete
- Run sample incident and verify error_type is populated
- Status: **PASS** | Evidence Link: `runbooks/security/incident-response.md`

(Continue for AR-003 through AR-010...)

**Step 3: Document Gaps**

- Any control marked **PARTIAL** or **FAIL** gets a risk entry:
  ```yaml
  risk_id: RISK-AUDIT-001
  control: AR-006 (Security and Governance agents)
  status: PARTIAL
  gap: "Security agent exists but not yet tested in P1 drill"
  remediation_plan: "Execute P1 incident tabletop by 2026-06-30"
  owner: security_owner
  due_date: 2026-06-30
  ```

**Step 4: Get Sign-offs**

- Governance owner reviews and approves checklist
- Security owner reviews and approves security controls
- System owner acknowledges overall readiness

**Step 5: Link to Traceability Matrix**

- Cross-check each control against [governance/traceability_matrix.md](../governance/traceability_matrix.md)
- Confirm policy → implementation → test → evidence chain is complete
- Any broken link = audit gap

---

### How to Prepare an Audit Package

**When to use:** External audit or compliance review requested.

**Step 1: Follow Package Structure**

- Reference [governance/mock_audit_package.md](../governance/mock_audit_package.md)
- Section 1: Policy overview ([JLA.md](../JLA.md), [SYSTEM.md](../SYSTEM.md), [SECURITY.md](../SECURITY.md), [RULES.md](../RULES.md))
- Section 2: Control catalog ([governance/compliance_matrix.md](../governance/compliance_matrix.md), [governance/audit_readiness_checklist.md](../governance/audit_readiness_checklist.md))
- Section 3: Operational controls (rules/, docs/schemas.md, observability/slos.md)
- Section 4: Agent controls (agents/security/_, agents/governance/_, pipelines/reliability_incident/)
- Section 5: Runbooks (runbooks/security/, runbooks/reliability/)
- Section 6: Test evidence (tests/ + latest run reports)
- Section 7: Incident samples (at least one per severity P1–P4)
- Section 8: Approvals and sign-offs

**Step 2: Populate Evidence**

- Use [governance/evidence_templates.md](../governance/evidence_templates.md) to format control evidence
- Use [governance/mock_evidence_sample.md](../governance/mock_evidence_sample.md) as reference
- Include hash values and schema_version for every artifact

**Step 3: Build Artifact Index**

```yaml
audit_package_id: AUDIT-2026-Q2-001
prepared_date: 2026-06-10T17:00:00Z
control_count: 10
evidence_artifacts:
  - AR-001: governance/mock_evidence_sample.md (hash: sha256:...)
  - AR-002: runbooks/security/incident-response.md (hash: sha256:...)
  ...
retention_policy: 7 years minimum
integrity_verification: all hashes verified before package seal
```

**Step 4: Sign and Seal Package**

- Governance owner signature + timestamp
- Security owner signature + timestamp
- System owner acknowledgement + timestamp
- Final package hash
- Package stored immutably

---

## Common Tasks & Recipes

### Recipe 1: Daily Audit Log Review

**Frequency:** Daily | **Owner:** Governance team | **Duration:** 30 min

```bash
# Each morning:
1. Check governance/audit.md for any audit failures
2. Review observability/alerts.md for SLA breaches
3. Check observability/logs.md for any SecurityError or ComplianceError entries
4. If any P1/P2: review rules/escalation.md and confirm timeline
5. Record status in daily standup
```

### Recipe 2: Weekly Test Suite Run

**Frequency:** Weekly (e.g., Monday 00:00 UTC) | **Owner:** Platform Engineering | **Duration:** 2 hours

```bash
# Weekly (every Monday):
1. Trigger full test batch: determinism + drift + hallucination + acceptance + regression
2. Wait for batch completion
3. Review aggregate results
4. If any FAIL: create incident and escalate
5. If all PASS: archive batch report and mark week as compliant
```

### Recipe 3: Monthly Drift Evaluation

**Frequency:** Monthly (e.g., first business day) | **Owner:** Validator Agent + Platform Engineering | **Duration:** 1.5 hours

```bash
# First business day of month:
1. Run reference sample set against current system
2. Compare scores to 30-day baseline
3. Calculate drift percentage
4. If drift < 5%: PASS, update baseline for next month
5. If drift >= 5%: BREACH, trigger risk_review pipeline
6. Document findings in observability/metrics.md
```

### Recipe 4: Quarterly Audit Readiness Review

**Frequency:** Quarterly | **Owner:** Governance + Security + System Owner | **Duration:** 4 hours

```bash
# Quarterly review:
1. Open governance/audit_readiness_checklist.md
2. For each control: verify evidence is current and complete
3. Run compliance_matrix.md cross-check
4. Review risk_register.md for any open compliance findings
5. Schedule remediation for any gaps
6. Get sign-offs from all owners
7. Archive reviewed checklist with attestation
```

### Recipe 5: Incident Post-Mortem

**Frequency:** After every P1/P2 incident | **Owner:** Governance + incident owner | **Duration:** 1 hour

```bash
# Within 5 business days of incident closure:
1. Gather incident record and all evidence (logs, traces, hashes)
2. Conduct root cause analysis
3. Document remediation plan with owners and due dates
4. Identify any control gaps and add to risk_register.md
5. Update runbook if procedure gaps found
6. Get Governance owner sign-off
7. Retain evidence package for 7 years
```

---

## Troubleshooting

### "Determinism test FAILED: output_hash mismatch"

**Issue:** Same input produced different output_hash on two runs.

**Diagnosis:**

1. Check [rules/deterministic.md](../rules/deterministic.md) for allowed exceptions
2. Verify input_hash and context_hash are identical on both runs
3. Check schema_version is same on both runs
4. Review test logs for any timestamp- or trace-ID-only differences (acceptable)

**Fix:**

- If input/context/schema all identical but output differs: **BLOCKER**, escalate to Validator as DriftError (P3)
- If only metadata differs (timestamps, trace IDs): **PASS**, no action needed

---

### "Incident escalation SLA breach: P1 not acknowledged within 15 minutes"

**Issue:** P1 incident was detected but not acknowledged within SLA.

**Diagnosis:**

1. Review [rules/escalation.md](../rules/escalation.md) SLA requirements
2. Check timestamp of incident detection vs. first escalation acknowledgement
3. Confirm Security owner was notified

**Fix:**

1. Immediate: Manually page on-call Security owner
2. Root cause: Why was escalation not triggered? Check pipeline logs
3. Update monitoring/alerting to catch this case earlier
4. Document finding in post-incident review and risk_register.md

---

### "Audit evidence is missing: No trace spans for incident window"

**Issue:** Incident escalation evidence is incomplete.

**Diagnosis:**

1. Review [governance/audit.md](../governance/audit.md) audit record requirements
2. Verify trace spans were collected during incident window
3. Check observability/traces.md for incident_id reference

**Fix:**

1. If traces exist but not linked: Add reference link to evidence record
2. If traces missing: File gap in risk_register.md and add to post-incident remediation
3. Update logging/tracing to ensure incident_id is always captured

---

### "Control test marked PARTIAL: What now?"

**Issue:** Audit checklist shows AR-XXX as PARTIAL.

**Diagnosis:**

1. Open [governance/audit_readiness_checklist.md](../governance/audit_readiness_checklist.md) and find the control
2. Read the "Notes" field for details
3. Review the evidence link to understand gap

**Fix:**

1. Create risk entry in [governance/risk_register.md](../governance/risk_register.md) with:
   - gap description
   - remediation plan
   - owner assignment
   - due date
2. Escalate to appropriate owner (Security, Governance, or Platform Engineering)
3. Re-evaluate on next audit cycle

---

## Additional Resources

- **System Overview:** [JLA.md](../JLA.md)
- **Execution Model:** [SYSTEM.md](../SYSTEM.md)
- **Security Architecture:** [SECURITY.md](../SECURITY.md)
- **Rules & Policies:** [RULES.md](../RULES.md)
- **Escalation Procedures:** [rules/escalation.md](../rules/escalation.md)
- **Incident Runbooks:** [runbooks/security/](../runbooks/security/), [runbooks/reliability/](../runbooks/reliability/)
- **Audit & Compliance:** [governance/](../governance/)
- **Test Procedures:** [tests/](../tests/)
- **Agent Definitions:** [agents/](../agents/)

---

**Questions or issues?** Refer to [docs/troubleshooting.md](troubleshooting.md) or escalate via [rules/escalation.md](../rules/escalation.md).
