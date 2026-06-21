# Refactor Pipeline

Version: 1.0.0
Owner: Platform Engineering
Classification: Internal / Enterprise
Status: Active

## 1. Purpose

The refactor pipeline transforms an approved change request into a reviewable staged code change set. It is the primary governed path for prompt-to-code generation that modifies existing code while preserving behavior unless explicitly approved otherwise.

## 2. Entry Conditions

- Command type: refactor_repo
- Must have an approved plan from Architect or Reviewer
- Repository scope must be explicitly identified
- Acceptance criteria must be present
- Tenant and classification context must be supplied

## 3. Required Agents

- Coordinator
- Researcher
- Architect
- Executor
- Reviewer
- Validator
- Compliance
- Risk Officer (if risks are present)

## 4. Required Skills

- analysis
- summarize
- plan
- refactor
- validate
- compliance_check
- risk_assess

## 5. Deterministic Flow

1. Coordinator confirms approved input and dispatches the pipeline
2. Researcher gathers codebase and change context
3. Architect confirms design constraints if needed
4. Executor produces staged diff or generated change set
5. Reviewer evaluates the proposed change set
6. Validator checks schema, acceptance criteria, and determinism
7. Compliance validates regulatory and data handling constraints
8. Risk Officer reviews any identified residual risks
9. Coordinator returns approved diff or revision request

## 6. Outputs

- Staged diff
- File-level change summary
- Validation report
- Compliance report
- Risk report if applicable

## 7. Compliance Checkpoints

- No unauthorized file scope changes
- No secrets introduced
- No cross-tenant writes
- No schema violations
- Telemetry completeness

## 8. Halt Conditions

- Missing approved plan
- Validator failure
- Compliance failure
- Security violation
- Out-of-scope code changes

## 9. Observability

- Record all step transitions and hashes
- Persist full diff metadata and review decisions
- Keep immutable audit trail for all proposed mutations

## 10. Success Criteria

- Diff is reviewable and deterministic
- All gates pass
- No unapproved repository mutation occurs
