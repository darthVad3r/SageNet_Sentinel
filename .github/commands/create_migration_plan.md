# Command: create_migration_plan

Version: 1.0.0
Owner: Platform Engineering
Classification: Internal / Enterprise
Status: Active

## 1. Purpose

Create a governed migration plan for controlled transition between source and target system states.

## 2. Pipeline Binding

- Pipeline: [migration](../pipelines/migration/pipeline.md)
- Primary outputs: migration plan, compatibility matrix, risk register updates, validation report

## 3. Required Inputs

- tenant_id
- source state
- target state
- schema_version
- business constraints, timeline, and rollback requirements

## 4. Required Agents

- Coordinator
- Strategist
- Architect
- Researcher
- Risk Officer
- Validator
- Compliance
- Executor (for staged artifacts)

## 5. Execution Summary

1. Coordinator validates migration request
2. Researcher gathers source/target context
3. Strategist sequences phases and priorities
4. Architect checks technical compatibility
5. Risk Officer assesses migration risks
6. Validator verifies completeness and acceptance criteria
7. Compliance validates regulatory constraints
8. Executor produces staged migration artifacts if approved

## 6. Completion Criteria

- Phase plan is deterministic and auditable
- Rollback path exists for every phase
- Compatibility and compliance checks pass
- Evidence and hashes are present

## 7. Example

Input: "Migrate the monolith auth module to a service-based architecture over two quarters."
Output: phased migration plan with rollback and risk controls.
