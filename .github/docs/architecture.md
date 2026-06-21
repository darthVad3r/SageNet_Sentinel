# Architecture

Version: 1.0.0

## Purpose

This document describes the logical architecture of the JLA: spec layer, agents, skills, commands, pipelines, governance, observability, integrations, context, and memory.

## Layer Model

- Spec layer: JLA.md, SYSTEM.md, SECURITY.md, RULES.md
- Execution layer: agents, skills, commands, pipelines
- Control layer: governance, observability, hooks, tests
- Integration layer: external systems and scoped APIs
- Context layer: runtime prompts, templates, and handoff state

## Design Rules

- Keep orchestration deterministic and auditable
- Separate policy from execution
- Make failure modes explicit and recoverable
- Prefer narrow, composable modules over broad coupled flows

## References

- [JLA.md](../JLA.md)
- [SYSTEM.md](../SYSTEM.md)
- [SECURITY.md](../SECURITY.md)
