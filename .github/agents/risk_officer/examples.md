# Risk Officer Agent — Examples
Version: 1.0.0

## Example: Risk Assessment Record

```json
{
  "output_type": "risk_assessment",
  "risks": [
    {
      "risk_id": "RISK-2026-001",
      "source": "architect_handoff",
      "category": "architectural",
      "description": "Single point of failure in event bus",
      "likelihood": 3,
      "impact": 4,
      "composite_score": 12,
      "severity": "HIGH",
      "mitigation_options": ["add redundancy", "implement circuit breaker"],
      "status": "open"
    }
  ],
  "risk_register_updated": true,
  "output_hash": "sha256:abc...",
  "schema_version": "1.0.0"
}
```
