# Reviewer Agent — Examples
Version: 1.0.0

## Example: PR Review Output

### Output (schema-validated)
```json
{
  "output_type": "review_report",
  "decision": "changes_requested",
  "findings": [
    {
      "severity": "HIGH",
      "dimension": "security",
      "file": "src/payments/processor.py",
      "line": 87,
      "finding": "SQL query uses string interpolation; SQL injection risk",
      "recommendation": "Use parameterized queries"
    },
    {
      "severity": "MEDIUM",
      "dimension": "test_coverage",
      "finding": "PaymentRetryService has 0% test coverage",
      "recommendation": "Add unit tests covering retry logic"
    }
  ],
  "approved": false,
  "output_hash": "sha256:abc...",
  "schema_version": "1.0.0"
}
```
