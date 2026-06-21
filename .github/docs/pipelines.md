# Pipelines

Version: 1.0.0

## Purpose

This document summarizes the pipeline model used by the JLA. Pipelines sequence work across agents and skills with checkpoints, policy gates, and explicit halt conditions.

## Pipeline Properties

- Deterministic ordering
- Explicit inputs and outputs
- Required validation and compliance gates
- Clear ownership for each stage
- Observable checkpoints and rollback points

## Operating Rules

- Use the smallest pipeline that satisfies the request
- Separate analysis, generation, validation, and review
- Halt on missing context, policy conflicts, or failed validation
- Preserve evidence for each checkpoint

## References

- [SYSTEM.md](../SYSTEM.md)
- [docs/skills.md](skills.md)
- [pipelines/](../pipelines)
