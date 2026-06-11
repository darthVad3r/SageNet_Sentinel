# Researcher Agent — Examples
Version: 1.0.0

## Example: PR Context Gathering

### Input
```json
{
  "research_request": "gather_pr_context",
  "scope": {"repo": "acme/api", "pr_number": 142},
  "required_context": ["changed_files", "related_issues", "test_coverage"]
}
```

### Output
```json
{
  "output_type": "research_package",
  "changed_files": [{"path": "src/payments/processor.py", "lines_changed": 87}],
  "related_issues": [{"id": "JIRA-1204", "title": "Add retry logic to payment processor"}],
  "test_coverage": {"overall": "74%", "changed_files_coverage": "61%"},
  "source_refs": ["github:acme/api/pull/142", "jira:JIRA-1204"],
  "output_hash": "sha256:abc...",
  "schema_version": "1.0.0"
}
```
