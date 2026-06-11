# Canonical Schemas

Version: 1.0.0
Owner: Platform Engineering
Classification: Internal / Enterprise
Status: Active

## Purpose

Define canonical schema contracts used by JLA components and governance checks.

## Required Schema Set

- handoff_record_v1
- context_object_v1
- telemetry_event_v1
- agent_output_v1
- compliance_evidence_v1
- memory_record_v1
- incident_record_v1

## Common Required Fields

All schemas must include:

- schema_version
- tenant_id
- agent_id
- pipeline_id
- timestamp_utc
- input_hash
- output_hash
- context_hash

## Validation Rules

- Producers must emit schema_version and pass schema validation before handoff
- Consumers must reject payloads with missing required fields
- Backward compatibility requires additive changes or explicit version bump
- Breaking changes require governance approval and migration note

## Versioning

- Version format: major.minor.patch
- Major: breaking changes
- Minor: backward-compatible field additions
- Patch: clarifications and metadata-only updates

## Compatibility Matrix

| Producer Schema | Consumer Minimum | Compatible |
| --------------- | ---------------- | ---------- |
| v1.x.x          | v1.0.0           | Yes        |
| v2.x.x          | v1.x.x           | No         |

## Evidence Requirement

Schema validation results must be logged and retained with audit evidence.
