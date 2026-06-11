# Security Incident Runbook

Version: 1.0.0
Owner: Security Engineering
Classification: Internal / Enterprise
Status: Active

## Detection Criteria

- P1 security incident or cross-tenant access attempt
- Unauthorized access pattern, key compromise signal, or policy bypass

## Verification Steps

1. Confirm alert source and severity classification
2. Validate tenant scope and impacted assets
3. Confirm incident record creation and evidence capture start

## Containment Steps

1. Freeze affected pipelines
2. Revoke or rotate affected credentials/tokens
3. Block risky integrations and isolate impacted tenant scope

## Eradication Steps

1. Remove identified root cause path
2. Patch control gap and validate enforcement

## Recovery Steps

1. Re-enable controlled workflows in phases
2. Confirm post-recovery validation and compliance checks

## Communication Checklist

- Notify Security owner and Governance owner
- Notify System owner for P1 events
- Trigger regulatory communication workflow where required

## Evidence Checklist

- incident_id, schema_version, error_type, severity
- input_hash, output_hash, context_hash
- access logs, trace spans, containment timeline
- remediation actions and approvals
