# Import Skill — Inputs
Version: 1.0.0

## Required
- tenant_id
- project or repository scope
- task prompt or execution brief
- schema_version
- context bundle or source artifact set

## Optional
- prior analysis output
- approved plan or architecture package
- diff or patch set
- acceptance criteria
- destination/export format

## Validation
- Inputs must be schema-valid
- Inputs must be scoped to a single tenant
- Inputs must include provenance for imported or referenced materials
- Missing required fields halt execution
