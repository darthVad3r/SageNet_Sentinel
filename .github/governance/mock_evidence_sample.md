# Mock Evidence Sample

Version: 1.0.0
Owner: Governance Engineering
Classification: Internal / Enterprise
Status: Active

## Purpose

Provide a concrete example of completed evidence records for dry-run audit reviews.

## Control Evidence Example

```yaml
control_id: AR-003
control_name: Escalation hierarchy and SLAs are consistent
source_docs:
  - rules/escalation.md
  - SECURITY.md
  - RULES.md
test_id: ESC-SLA-DRILL-001
test_run_id: DRYRUN-2026-06-10-01
timestamp_utc: 2026-06-10T16:30:00Z
tenant_id: tenant-demo
agent_id: validator
pipeline_id: reliability_incident
schema_version: 1.0.0
input_hash: sha256:demo_input_hash
output_hash: sha256:demo_output_hash
context_hash: sha256:demo_context_hash
result: pass
evidence_artifacts:
  - type: report
    path: governance/mock_audit_package.md
    hash: sha256:demo_report_hash
reviewer: governance_owner
review_status: approved
notes: Dry-run escalation timestamps matched SLA targets.
```

## Incident Evidence Example

```yaml
incident_id: INC-DRYRUN-0001
severity: P2
error_type: IntegrationError
detected_at_utc: 2026-06-10T15:45:00Z
acknowledged_at_utc: 2026-06-10T15:50:00Z
contained_at_utc: 2026-06-10T16:20:00Z
resolved_at_utc: 2026-06-10T17:10:00Z
runbook: runbooks/reliability/reliability-incident.md
required_pipeline: reliability_incident
required_agents:
  - security
  - governance
  - validator
evidence:
  logs_path: observability/logs.md
  traces_path: observability/traces.md
  timeline_path: governance/mock_audit_package.md
  hashes:
    input_hash: sha256:demo_incident_input
    output_hash: sha256:demo_incident_output
    context_hash: sha256:demo_incident_context
owner_signoff: security_owner
```
