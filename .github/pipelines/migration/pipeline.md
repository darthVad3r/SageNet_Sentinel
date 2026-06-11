# Migration Pipeline

Version: 1.0.0
Owner: Platform Engineering
Classification: Internal / Enterprise
Status: Active

## 1. Purpose

The migration pipeline converts an approved future state into a governed migration plan and staged implementation path. It is used for platform shifts, dependency upgrades, and controlled transition work.

## 2. Entry Conditions

- Command type: create_migration_plan
- Source and target states must be defined
- Risk and compliance context must be available
- Approval prerequisites must be satisfied

## 3. Required Agents

- Coordinator
- Strategist
- Architect
- Researcher
- Risk Officer
- Validator
- Compliance
- Executor (for staged migration artifacts)

## 4. Required Skills

- analysis
- summarize
- plan
- risk_assess
- validate
- compliance_check
- generate

## 5. Deterministic Flow

1. Coordinator validates migration request and dispatches pipeline
2. Researcher gathers source and target system context
3. Strategist defines migration sequencing and priorities
4. Architect validates technical constraints and compatibility
5. Risk Officer assesses migration risks and mitigations
6. Validator checks plan completeness and acceptance criteria
7. Compliance validates regulatory constraints and evidence requirements
8. Executor produces staged migration artifacts if approved
9. Coordinator returns migration plan or revision request

## 6. Outputs

- Migration plan
- Phase-by-phase execution schedule
- Compatibility matrix
- Risk register updates
- Validation and compliance reports

## 7. Compliance Checkpoints

- Data residency compatibility
- Tenant isolation preservation
- Rollback plan included
- Audit evidence requirements defined
- Schema compatibility verified

## 8. Halt Conditions

- Missing target state definition
- Compliance failure
- Risk threshold exceeded without mitigation
- Schema incompatibility
- Validation failure

## 9. Observability

- Log every migration phase transition
- Emit hashes for all plan artifacts
- Record rollback criteria and evidence package references

## 10. Success Criteria

- Migration plan is deterministic and auditable
- Rollback path exists for every phase
- Compliance and validation gates pass
