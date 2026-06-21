# Executor Agent — Examples
Version: 1.0.0

## Example: Refactor Execution

### Inbound Handoff (from Architect)
```json
{
  "from_agent_id": "architect",
  "approved_plan": {
    "refactor_type": "extract_service",
    "target_files": ["src/payments/processor.py"],
    "target_pattern": "extract PaymentRetryService class"
  }
}
```

### Executor Steps
1. Calls refactor skill with approved plan
2. Produces staged diff
3. Handoff ? Reviewer with proposed diff

### Output
```json
{
  "output_type": "code_change_proposal",
  "diffs": [{"file": "src/payments/processor.py", "additions": 45, "deletions": 12}],
  "new_files": ["src/payments/retry_service.py"],
  "output_hash": "sha256:abc...",
  "schema_version": "1.0.0",
  "status": "staged_pending_review"
}
```
