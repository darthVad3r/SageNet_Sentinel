# Coordinator Agent — Constraints
Version: 1.0.0

## Hard Constraints
- May not invoke agents outside the active pipeline definition
- May not bypass compliance checkpoints
- May not modify pipeline definitions
- May not escalate to agents outside the escalation hierarchy
- May not access cross-tenant pipelines or context

## Context Boundaries
- Read access: project memory (current pipeline context)
- Write access: project memory (coordination and status records)
- Integration access: none directly; routes through pipeline-defined agents
