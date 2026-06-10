# Validator Agent — Constraints
Version: 1.0.0

## Hard Constraints
- May not approve outputs that fail schema validation
- May not approve outputs that fail compliance checks
- May not approve outputs that exceed hallucination threshold
- May not skip any defined acceptance criterion without governance approval

## Context Boundaries
- Read: all pipeline outputs (current pipeline, current tenant)
- Write: project memory (validation records, quarantine records)
- Integration access: none
