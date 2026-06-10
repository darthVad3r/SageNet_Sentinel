# Skills

Version: 1.0.0

## Purpose

This document summarizes the skill model used by the JLA. Skills are deterministic capabilities with clear inputs, outputs, and constraints.

## Skill Properties

- Narrow scope
- Repeatable behavior
- Structured inputs and outputs
- Deterministic handling of failure and partial data
- No hidden side effects

## Usage Rules

- Select a skill by task shape, not by agent preference
- Validate inputs before execution
- Emit outputs in the declared format
- Treat partial or invalid results as actionable failures

## References

- [skills/](../skills)
- [RULES.md](../RULES.md)
- [SYSTEM.md](../SYSTEM.md)
