---
name: angular-jla-skills
description: "Skills Manifest v1.0 (Hybrid Edition) for the Justice League of Angular (JLA). Use when: activating JLA agents, enforcing Angular architecture discipline, generating components/services/state/routes/tests, refactoring, migrating, or coordinating multi-agent Angular workflows. Defines global skills, shared skills, specialized per-agent skills, invocation rules, the protocol layer, the mission execution engine, the universal output contract, and the agent definition template."
argument-hint: "Optional: specify agent name (e.g., Architect, Component, Service, State, Routing, Testing, Migration, Integration, Coordinator)"
---

# Angular JLA — Skills Manifest v1.0 (Hybrid Edition)

A doctrine of discipline, clarity, and component-driven justice.

## When to Use

Invoke this skill whenever a JLA agent is active. The manifest governs **all** agents in the League and defines what skills are active, when they fire, and how conflicts are resolved.

Trigger scenarios:

- Generating or refactoring Angular code (any layer)
- Reviewing architecture, structure, or module boundaries
- Writing or debugging NgRx state slices
- Setting up or modifying routes and guards
- Writing tests (unit, integration)
- Migrating from legacy Angular patterns
- Coordinating work across multiple JLA agents

---

## Skill Invocation Rules

| Condition             | Skill to Activate               |
| --------------------- | ------------------------------- |
| Generating code       | Angular Style Guide Enforcement |
| Refactoring           | Behavior Preservation           |
| Requirement unclear   | Context Validation              |
| Optimizing            | Performance Awareness           |
| Architecture involved | Boundary Enforcement            |
| State (NgRx) involved | Reducer Purity                  |
| Routing involved      | Lazy Loading Enforcement        |
| Tests involved        | Deterministic Test Generation   |

---

## Skill Enforcement Layer

When a skill applies, the active agent **must**:

1. **State** which skill is currently active (e.g., `[Skill: Behavior Preservation]`)
2. **Follow** all rules defined for that skill without exception
3. **Avoid violating** any other active skill simultaneously
4. **Escalate** to the Coordinator if a conflict between two skills cannot be resolved

---

## Skill Tiers

The manifest is organized into eight governance sections. See the reference files for full rule definitions.

| Tier                           | Scope           | Reference                                                                             |
| ------------------------------ | --------------- | ------------------------------------------------------------------------------------- |
| I. Global Skills               | All agents      | [global-skills.md](./references/global-skills.md)                                     |
| II. Shared Skills              | Multiple agents | [global-skills.md](./references/global-skills.md)                                     |
| III. Specialized Skills        | Per-agent       | [specialized-skills.md](./references/specialized-skills.md)                           |
| IV–V. Invocation & Enforcement | Governance      | This file (above)                                                                     |
| VI–VIII. Agent Protocols       | Operations      | [agent-protocols.md](./references/agent-protocols.md)                                 |
| IX–XII. Mission Engine         | Runtime         | [mission-execution-engine.md](./references/mission-execution-engine.md)               |
| XIII. Output Contract          | Runtime I/O     | [universal-agent-output-contract.md](./references/universal-agent-output-contract.md) |
| XIV. Agent Template            | Authoring       | [agent-definition-template.md](./references/agent-definition-template.md)             |

---

## Chain of Command

When agents disagree or a conflict arises:

- **Structure disputes** → defer to the Architect Agent
- **Security disputes** → defer to the Security Specialist
- **Performance disputes** → defer to the Performance Specialist
- **All other conflicts** → escalate to the Coordinator Agent

The League functions because the League follows order.
