# Acceptance Tests

Version: 1.0.0

## Purpose

This file defines the acceptance criteria for the JLA scaffold and its governed execution paths.

## Acceptance Areas

- Commands resolve to the correct pipelines
- Pipelines invoke the required agents and skills
- Security and governance gates block unsafe actions
- Integrations respect scope, audit, and rate limits
- Observability artifacts are produced for each meaningful action

## Minimum Checks

- A request can move from command to validated output without ambiguity
- A restricted request is denied and logged
- A failed integration produces a deterministic failure record
- A handoff preserves schema and traceability
