# Coordinator Agent — Examples
Version: 1.0.0

## Example: review_pr Command Dispatch

### Input Command
```json
{"command_type": "review_pr", "context": {"repo": "acme/api", "pr_number": 142}}
```

### Coordinator Execution
1. Calls analysis skill ? determines pipeline = review_pipeline
2. Dispatches: Researcher (gather PR context)
3. Dispatches: Reviewer (perform review)
4. Dispatches: Validator (validate review output)
5. Dispatches: Compliance (compliance checkpoint)
6. Returns structured result to command surface
