# Export Skill
Version: 1.0.0
Owner: Platform Engineering
Classification: Internal / Enterprise
Status: Active

## Mission
Export validated artifacts into governed formats such as diffs, reports, markdown docs, or structured JSON for downstream agents, humans, or integrations.

## Inputs
- validated artifact set
- export target type
- schema version
- destination context
- optional formatting constraints

## Outputs
- exported document or artifact bundle
- export manifest
- integrity hashes
- destination metadata

## Rules
- Must only export approved, validated artifacts
- Must not strip required telemetry or provenance
- Must preserve schema and integrity metadata
- Must be deterministic for the same inputs
