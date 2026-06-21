# Error Taxonomy

Version: 1.0.0
Owner: Governance Engineering
Classification: Internal / Enterprise
Status: Active
Parent: RULES.md

## Purpose

Define canonical error classes and required handling behaviors for all agents, skills, and pipelines.

## Canonical Error Types

- ValidationError: Schema mismatch, missing required fields, invalid structure
- ComplianceError: Policy violation, control failure, evidence gap, unauthorized exception
- ExecutionError: Workflow step failure, invalid sequencing, processing failure
- IntegrationError: External API failure, auth failure, timeout, rate-limit breach
- SecurityError: Unauthorized access, cross-tenant attempt, secret exposure, control bypass
- DriftError: Determinism or quality drift beyond accepted thresholds

## Required Metadata

Every error record must include:

- error_type
- severity (P1-P4)
- agent_id
- pipeline_id
- tenant_id
- schema_version
- input_hash
- output_hash
- context_hash
- timestamp_utc

## Severity Mapping Defaults

- SecurityError -> P1 unless explicitly downgraded with rationale
- ComplianceError -> P2 by default
- IntegrationError -> P2 by default
- ValidationError -> P3 by default
- ExecutionError -> P2 or P3 based on blast radius
- DriftError -> P3 by default; escalates to P2 on repeated breach

## Handling Rules

- P1/P2 must follow rules/escalation.md SLAs
- No error may be silently dropped
- Retry behavior must be bounded and logged
- Escalation artifacts must be retained for policy retention window
