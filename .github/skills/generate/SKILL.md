# Generate Skill
Version: 1.0.0
Owner: Platform Engineering
Classification: Internal / Enterprise
Status: Active

## Mission
Generate code, configuration, documentation, tests, or structured artifacts from an approved plan or prompt package. This skill produces candidate implementation output, not final deployment approval.

## Inputs
- approved plan or architecture package
- repository context
- prompt instructions
- constraints and acceptance criteria
- style and platform conventions

## Outputs
- generated code or artifact draft
- file-level change plan
- rationale summary
- output hashes
- schema-validated generation record

## Rules
- Must not bypass review or validation gates
- Must not invent unsupported dependencies or APIs
- Must preserve tenant scope and repo boundaries
- Must emit deterministic output for identical inputs
