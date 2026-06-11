# Release Pipeline

Version: 1.0.0
Owner: Platform Engineering
Classification: Internal / Enterprise
Status: Active

## 1. Purpose

The release pipeline controls governed promotion of validated changes into release-ready artifacts or deployment candidates. It ensures that only approved, tested, and compliant outputs can be released.

## 2. Entry Conditions

- Command type: produce_release or approved release event
- Validation and compliance reports must be present
- Change set must be frozen
- Rollback plan must be available

## 3. Required Agents

- Coordinator
- Reviewer
- Validator
- Compliance
- Risk Officer
- Executor

## 4. Required Skills

- validate
- compliance_check
- summarize
- export
- analysis
- risk_assess

## 5. Deterministic Flow

1. Coordinator checks release readiness
2. Reviewer confirms change set quality and completeness
3. Validator verifies all acceptance criteria and SLO constraints
4. Compliance validates regulatory and audit requirements
5. Risk Officer reviews residual release risks
6. Executor exports release artifacts or staged release packages
7. Coordinator records release status and returns outcome

## 6. Outputs

- Release candidate package
- Validation report
- Compliance report
- Risk sign-off summary
- Export manifest

## 7. Compliance Checkpoints

- No unresolved P1/P2 issues
- Audit evidence complete
- Versioning and schema compatibility verified
- Security review completed
- Rollback plan approved

## 8. Halt Conditions

- Any validation failure
- Compliance failure
- Unresolved critical risk
- Missing release manifest
- Unapproved artifact mutation

## 9. Observability

- Record approval chain and artifact hashes
- Log all release gates and final decision
- Retain release evidence per governance retention policy

## 10. Success Criteria

- Only approved artifacts are released
- All gates pass in sequence
- Release record is complete, deterministic, and auditable
