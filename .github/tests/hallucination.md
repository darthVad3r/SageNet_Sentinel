# Hallucination Test Procedure

Version: 1.0.0
Owner: Platform Engineering
Classification: Internal / Enterprise
Status: Active

## Purpose

Measure unsupported claims or fabricated references in governed outputs.

## Procedure

1. Select representative sample outputs
2. Verify claims against source references and provenance metadata
3. Mark unsupported claim rate
4. Escalate if rate exceeds policy threshold

## Pass Criteria

- Unsupported claim rate <= configured threshold
- All flagged findings are logged and routed

## Evidence

- sampled output ids
- unsupported claim findings
- calculated rate
- severity and escalation status
