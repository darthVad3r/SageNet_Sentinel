# Validate Skill
Version: 1.0.0
Owner: Platform Engineering
Classification: Internal / Enterprise
Status: Active

## Mission
Validate outputs, plans, diffs, and artifacts against schemas, acceptance criteria, and quality gates.

## Inputs
- output or diff to validate
- schema references
- acceptance criteria
- SLO or policy constraints
- validation scope

## Outputs
- pass/fail result
- criterion-by-criterion validation report
- required fixes or quarantine recommendation
- evidence records

## Rules
- Must validate every required criterion explicitly
- Must quarantine invalid or partial outputs
- Must be deterministic and repeatable
- Must not silently downgrade findings
