# Evidence Templates

Version: 1.0.0
Owner: Governance Engineering
Classification: Internal / Enterprise
Status: Active

## Purpose

Standard templates for audit evidence collection and packaging.

## Template A: Control Test Evidence

```yaml
control_id: AR-000
control_name: ""
source_docs:
  - ""
test_id: ""
test_run_id: ""
timestamp_utc: ""
tenant_id: ""
agent_id: ""
pipeline_id: ""
schema_version: ""
input_hash: ""
output_hash: ""
context_hash: ""
result: pass|partial|fail
evidence_artifacts:
  - type: log|trace|report|screenshot
    path: ""
    hash: ""
reviewer: ""
review_status: approved|rejected|needs_followup
notes: ""
```

## Template B: Incident Escalation Evidence

```yaml
incident_id: ""
severity: P1|P2|P3|P4
error_type: ValidationError|ComplianceError|ExecutionError|IntegrationError|SecurityError|DriftError
detected_at_utc: ""
acknowledged_at_utc: ""
contained_at_utc: ""
resolved_at_utc: ""
runbook: ""
required_pipeline: ""
required_agents:
  - ""
evidence:
  logs_path: ""
  traces_path: ""
  timeline_path: ""
  hashes:
    input_hash: ""
    output_hash: ""
    context_hash: ""
owner_signoff: ""
```

## Template C: Change Governance Evidence

```yaml
change_id: ""
change_type: policy|pipeline|agent|skill|integration
requested_by: ""
approved_by:
  governance_owner: ""
  security_owner: ""
assessment:
  risk_level: low|medium|high|critical
  compliance_impact: ""
  tenant_impact: ""
validation:
  schemas_validated: true|false
  tests_executed:
    - ""
artifacts:
  diff_reference: ""
  approval_record: ""
  rollback_plan: ""
status: approved|rejected|deferred
```

## Storage Rules

- Evidence files must be immutable after approval.
- All evidence files must include schema_version and hash values.
- Evidence retention follows governance/audit.md and SECURITY.md retention requirements.
