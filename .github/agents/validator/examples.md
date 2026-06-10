# Validator Agent — Examples
Version: 1.0.0

## Example: Validation Report

```json
{
  "output_type": "validation_report",
  "pipeline_id": "arch-pipeline-20260610-001",
  "criteria_results": [
    {"criterion": "schema_valid", "result": "PASS"},
    {"criterion": "output_hash_deterministic", "result": "PASS"},
    {"criterion": "compliance_checkpoint", "result": "PASS"},
    {"criterion": "hallucination_check", "result": "PASS", "score": 0.0},
    {"criterion": "slo_conformance", "result": "PASS", "latency_ms": 1240}
  ],
  "overall": "PASS",
  "output_hash": "sha256:abc...",
  "schema_version": "1.0.0"
}
```
