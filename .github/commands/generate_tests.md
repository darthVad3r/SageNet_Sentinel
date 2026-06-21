# Command: generate_tests

Version: 1.0.0
Owner: Platform Engineering
Classification: Internal / Enterprise
Status: Active

## 1. Purpose

Generate tests under governed constraints for an approved scope. This command supports quality, regression, and validation coverage generation without bypassing review gates.

## 2. Pipeline Binding

- Pipeline: [refactor](../pipelines/refactor/pipeline.md) or [release](../pipelines/release/pipeline.md) depending on context
- Primary outputs: staged test files, coverage plan, validation report

## 3. Required Inputs

- tenant_id
- repository scope
- target files or behavior description
- schema_version
- optional coverage goals and test framework constraints

## 4. Required Agents

- Coordinator
- Researcher
- Architect
- Executor
- Reviewer
- Validator
- Compliance

## 5. Execution Summary

1. Coordinator validates request scope
2. Researcher gathers code and existing test context
3. Architect clarifies test strategy if needed
4. Executor generates test drafts
5. Reviewer checks quality and relevance
6. Validator validates test artifact completeness
7. Compliance verifies data handling and policy constraints

## 6. Completion Criteria

- Tests are scoped and reviewable
- No unapproved changes are introduced
- Validation and compliance gates pass
- Output includes hashes and provenance metadata

## 7. Example

Input: "Generate tests for the payment retry logic with coverage for transient failures and timeouts."
Output: staged test file set with coverage notes.
