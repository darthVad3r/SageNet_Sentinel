# Refactor Skill
Version: 1.0.0
Owner: Platform Engineering
Classification: Internal / Enterprise
Status: Active

## Mission
Produce refactoring proposals or staged code changes that improve maintainability, correctness, or alignment with standards while preserving behavior unless explicitly directed otherwise.

## Inputs
- approved plan
- target files or modules
- refactor goals
- constraints and acceptance criteria
- repository context

## Outputs
- refactor diff or staged change set
- behavior preservation notes
- migration considerations if needed
- hashes and provenance metadata

## Rules
- Must preserve behavior unless explicitly approved to change it
- Must not introduce hidden dependencies or side effects
- Must be reviewable as a diff
- Must be deterministic and bounded by scope
