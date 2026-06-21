# Architecture Pipeline

Version: 1.0.0
Owner: Platform Engineering
Classification: Internal / Enterprise
Status: Active

## 1. Purpose

The architecture pipeline turns a governed request into a validated architecture proposal, acceptance criteria, and a downstream execution plan. It is the entry point for prompt-to-architecture and prompt-to-code planning flows.

## 2. Entry Conditions

- Command type: generate_architecture
- Request must include tenant_id, project scope, and schema_version
- Security and System invariants must be active
- Required context must be available or retrievable through Researcher

## 3. Required Agents

- Coordinator
- Researcher
- Architect
- Risk Officer
- Validator
- Compliance
- Reviewer

## 4. Required Skills

- analysis
- summarize
- plan
- generate
- risk_assess
- validate
- compliance_check

## 5. Deterministic Flow

1. Coordinator receives command and validates pipeline eligibility
2. Researcher gathers repository and context data
3. Architect analyzes context and generates architecture proposal
4. Risk Officer scores architectural risks
5. Validator checks schema, acceptance criteria, determinism, and output completeness
6. Compliance performs compliance checkpoint validation
7. Reviewer produces approval or change request
8. Coordinator returns structured result or escalates on failure

## 6. Outputs

- Architecture proposal
- ADR set
- Risk report
- Validation report
- Compliance report
- Execution-ready plan or revision request

## 7. Compliance Checkpoints

- Schema validation
- Tenant isolation check
- Data classification check
- Observability field check
- Handoff chain integrity check

## 8. Halt Conditions

- Schema validation failure
- Compliance failure
- Security violation
- Missing required agent output
- Drift or hallucination threshold breach

## 9. Observability

- Emit logs, metrics, traces, context_hash, input_hash, output_hash, schema_version, tenant_id, agent_id, pipeline_id at every step
- All step transitions must be recorded

## 10. Success Criteria

- All required agents complete their steps
- Outputs pass validation and compliance gates
- Deterministic output hashes are produced
- Result is returned in structured schema
