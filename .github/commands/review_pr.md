# Command: review_pr

Version: 1.0.0
Owner: Platform Engineering
Classification: Internal / Enterprise
Status: Active

## 1. Purpose

Review a pull request or change set using governed review, validation, and compliance gates. This command is the intake point for code review workflows.

## 2. Pipeline Binding

- Pipeline: [refactor](../pipelines/refactor/pipeline.md) or [release](../pipelines/release/pipeline.md) depending on context
- Primary outputs: review report, approval decision, change requests, compliance findings

## 3. Required Inputs

- tenant_id
- repository scope
- PR identifier or diff bundle
- schema_version
- optional review focus or constraints

## 4. Required Agents

- Coordinator
- Researcher
- Reviewer
- Validator
- Compliance
- Risk Officer (if risks are found)
- Executor (only if changes are requested and staged)

## 5. Execution Summary

1. Coordinator dispatches review workflow
2. Researcher gathers PR context and related evidence
3. Reviewer performs structured review
4. Validator checks output completeness and determinism
5. Compliance validates regulatory and policy constraints
6. Risk Officer reviews residual risk if present
7. Coordinator returns decision or change request

## 6. Completion Criteria

- Review dimensions are fully covered
- Findings are actionable and auditable
- Compliance gate passes or is escalated
- Output contains hashes and provenance metadata

## 7. Example

Input: "Review PR #142 for security, test coverage, and maintainability."
Output: structured review report with approval or requested changes.
