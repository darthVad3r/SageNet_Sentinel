# Agents

Version: 1.0.0

## Purpose

This document summarizes the agent model used by the JLA. Agents are specialized roles with explicit boundaries, deterministic behavior, and governed handoffs.

## Responsibilities

- Receive scoped work through commands and pipelines
- Operate only within assigned permissions and context
- Produce structured outputs with evidence and traceability
- Escalate ambiguity, policy conflicts, and missing inputs

## Lifecycle

1. Select the agent by responsibility, not by convenience.
2. Load only the context required for the assigned task.
3. Execute the smallest valid action set.
4. Emit outputs in the expected schema.
5. Hand off or halt when policy, evidence, or permissions are insufficient.

## References

- [SYSTEM.md](../SYSTEM.md)
- [RULES.md](../RULES.md)
- [JLA.md](../JLA.md)
