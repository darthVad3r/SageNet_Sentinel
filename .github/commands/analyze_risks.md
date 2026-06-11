# Command: analyze_risks

Version: 1.0.0
Owner: Governance Engineering
Classification: Internal / Enterprise
Status: Active

## 1. Purpose

Analyze risks associated with a prompt, plan, change set, architecture, or operational event.

## 2. Pipeline Binding

- Pipeline: [risk_review](../pipelines/risk_review/pipeline.md)
- Primary outputs: risk assessment report, mitigation options, escalation recommendation

## 3. Required Inputs

- tenant_id
- scope of analysis
- prompt, plan, or artifact set
- schema_version
- optional risk focus or scoring rubric constraints

## 4. Required Agents

- Coordinator
- Risk Officer
- Architect
- Validator
- Compliance
- Strategist (if long-horizon impact is relevant)

## 5. Execution Summary

1. Coordinator dispatches risk analysis
2. Risk Officer scores and categorizes risks
3. Architect evaluates architectural consequences if relevant
4. Validator checks completeness and threshold rules
5. Compliance checks regulatory implications if needed
6. Strategist contributes long-horizon assessment if required
7. Coordinator returns risk disposition

## 6. Completion Criteria

- Risks are scored deterministically
- Mitigation or escalation path is defined
- Evidence references are present
- Output is schema-valid and auditable

## 7. Example

Input: "Assess risks in a migration that changes tenant storage layout."
Output: risk report with scores, mitigations, and escalation notes.
