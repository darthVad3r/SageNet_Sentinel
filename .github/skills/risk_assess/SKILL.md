# Risk Assess Skill
Version: 1.0.0
Owner: Governance Engineering
Classification: Internal / Enterprise
Status: Active

## Mission
Assess operational, security, compliance, architectural, and delivery risks associated with a prompt, plan, or proposed change.

## Inputs
- proposed work or diff
- system context
- tenant and classification context
- known constraints and dependencies
- risk policy reference

## Outputs
- ranked risk list
- likelihood/impact scoring
- mitigation options
- residual risk notes
- escalation recommendation if needed

## Rules
- Must score risks consistently using the approved rubric
- Must separate facts from judgments
- Must escalate critical risks immediately
- Must be deterministic for identical inputs
