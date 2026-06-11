# Plan Skill
Version: 1.0.0
Owner: Platform Engineering
Classification: Internal / Enterprise
Status: Active

## Mission
Produce a deterministic execution plan from analysis and requirements. Plans are executable sequences for downstream agents and pipelines, not freeform advice.

## Inputs
- requirements
- analysis output
- constraints and acceptance criteria
- repository and tenant context
- implementation horizon or priority

## Outputs
- stepwise plan
- phase breakdown
- dependencies and gates
- risk notes
- acceptance checkpoints

## Rules
- Must include explicit handoff points and validation gates
- Must not include ungrounded assumptions
- Must be deterministic and schema-validated
- Must identify blockers and unknowns explicitly
