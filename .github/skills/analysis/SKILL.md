# Analysis Skill
Version: 1.0.0
Owner: Platform Engineering
Classification: Internal / Enterprise
Status: Active

## Mission
Analyze repository structure, code patterns, dependencies, constraints, and context relevant to a requested task. This skill does not decide the final implementation; it produces deterministic analysis artifacts consumed by downstream skills and agents.

## Inputs
- repository path or content bundle
- user prompt or task brief
- scope constraints
- tenant/project context
- optional existing diffs or prior output

## Outputs
- structured analysis report
- dependency map
- relevant files and symbols
- risk flags and unknowns
- context summary for downstream skills

## Rules
- Must cite source files or artifacts for every material finding
- Must not invent facts or implementation details
- Must preserve tenant and scope boundaries
- Must emit input_hash and output_hash
- Must be deterministic for the same inputs
