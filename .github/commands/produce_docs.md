# Command: produce_docs

Version: 1.0.0
Owner: Platform Engineering
Classification: Internal / Enterprise
Status: Active

## 1. Purpose

Produce governed documentation artifacts from approved content, analyses, or implementation outputs.

## 2. Pipeline Binding

- Pipeline: [release](../pipelines/release/pipeline.md) or [architecture](../pipelines/architecture/pipeline.md) depending on target
- Primary outputs: docs bundle, export manifest, validation report

## 3. Required Inputs

- tenant_id
- source artifacts or prompt brief
- schema_version
- target documentation type and audience

## 4. Required Agents

- Coordinator
- Researcher
- Strategist or Architect as needed
- Validator
- Compliance
- Executor

## 5. Execution Summary

1. Coordinator validates documentation request
2. Researcher gathers source material
3. Strategist or Architect structures the content if needed
4. Executor generates the document draft
5. Validator checks completeness and structure
6. Compliance validates policy and data handling constraints
7. Coordinator returns exported documentation package

## 6. Completion Criteria

- Documentation is accurate and source-grounded
- Required telemetry and hashes are present
- Compliance checks pass
- Output is exportable and auditable

## 7. Example

Input: "Produce onboarding docs for the new architecture workflow."
Output: documentation package with audit metadata and export manifest.
