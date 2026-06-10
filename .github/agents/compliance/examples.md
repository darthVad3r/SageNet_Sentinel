# Compliance Agent — Examples
Version: 1.0.0

## Example: Compliance Check Report

```json
{
  "output_type": "compliance_report",
  "pipeline_id": "review-pipeline-20260610-001",
  "controls_evaluated": [
    {"control": "data_classification_labels_present", "result": "PASS"},
    {"control": "no_pii_in_logs", "result": "PASS"},
    {"control": "memory_scope_respected", "result": "PASS"},
    {"control": "integration_boundary_check", "result": "PASS"},
    {"control": "schema_version_present", "result": "PASS"}
  ],
  "overall": "PASS",
  "audit_evidence_stored": true,
  "retention_verified": true,
  "output_hash": "sha256:abc...",
  "schema_version": "1.0.0"
}
```
