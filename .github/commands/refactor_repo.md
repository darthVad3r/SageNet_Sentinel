# Command: refactor_repo

Version: 1.0.0
Owner: Platform Engineering
Classification: Internal / Enterprise
Status: Active

## 1. Purpose

Refactor repository code under a governed workflow. This command is the prompt-to-code entry point for staged code changes, but it must pass through the refactor pipeline and its review/validation gates.

## 2. Pipeline Binding

- Pipeline: [refactor](../pipelines/refactor/pipeline.md)
- Primary outputs: staged diff, file-level change summary, validation report, compliance report

## 3. Required Inputs

- tenant_id
- repository scope
- user prompt or approved plan
- schema_version
- optional target files, refactor goals, and constraints

## 4. Required Agents

- Coordinator
- Researcher
- Architect
- Executor
- Reviewer
- Validator
- Compliance
- Risk Officer (if risks identified)

## 5. Execution Summary

1. Coordinator checks approved-plan requirements
2. Researcher gathers repository context
3. Architect confirms design constraints if needed
4. Executor produces staged diff
5. Reviewer reviews proposed changes
6. Validator checks acceptance criteria and determinism
7. Compliance validates policy and data handling constraints
8. Risk Officer reviews residual risks if present

## 6. Completion Criteria

- Diff is reviewable and scoped
- No unapproved mutation occurs
- Validation and compliance gates pass
- Output contains hashes and provenance metadata

## 7. Example

Input: "Extract retry logic into a dedicated PaymentRetryService and add tests."
Output: staged diff with review summary and validation evidence.
