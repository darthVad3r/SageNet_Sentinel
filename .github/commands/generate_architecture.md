# Command: generate_architecture

Version: 1.0.0
Owner: Platform Engineering
Classification: Internal / Enterprise
Status: Active

## 1. Purpose

Generate a governed architecture proposal from a user prompt or system request. This command is the intake point for architecture analysis, architecture synthesis, and downstream planning.

## 2. Pipeline Binding

- Pipeline: [architecture](../pipelines/architecture/pipeline.md)
- Primary outputs: architecture proposal, ADR set, risk report, validation report

## 3. Required Inputs

- tenant_id
- project or repository scope
- task prompt or requirements brief
- schema_version
- optional constraints, references, and target horizon

## 4. Required Agents

- Coordinator
- Researcher
- Architect
- Risk Officer
- Validator
- Compliance
- Reviewer

## 5. Execution Summary

1. Coordinator validates command eligibility
2. Researcher gathers context
3. Architect produces the architecture proposal
4. Risk Officer scores risks
5. Validator validates completeness and determinism
6. Compliance executes compliance checkpoint
7. Reviewer approves or requests changes

## 6. Completion Criteria

- Proposal is schema-valid and deterministic
- Required telemetry emitted
- Compliance checkpoint passes
- Result includes output_hash and provenance metadata

## 7. Example

Input: "Design a multi-tenant event-driven payments service that meets SOC2 requirements."
Output: architecture proposal with ADRs, risks, and a staged plan.
