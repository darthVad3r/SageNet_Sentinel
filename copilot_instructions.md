# GitHub Copilot instructions for this repository

Purpose
- Tell GitHub Copilot where project agents live and how to prioritize them when assisting.

Agents location
- .github/agents

Structure
- Each agent lives in a subfolder: .github/agents/<agent-name>/
- Agent folders typically include charters (.md), configs, and any automation scripts.

Guidance for Copilot
- When working on agent orchestration, sequencing, or handoffs, prioritize files under `.github/agents`.
- Read agent charters (.md) first to understand mission, scope, and constraints before proposing changes.
- Do not modify agent charters or production automation files without explicit instruction from a human reviewer.

Usage examples
- "Assemble context for coordinator" -> inspect `.github/agents/coordinator/charter.md` and related files.
- "Add a new agent" -> create `.github/agents/<agent-name>/` with a charter and follow existing conventions.

End of instructions.