# Compliance Matrix

Version: 1.0.0
Owner: Governance Engineering
Classification: Internal / Enterprise
Status: Active

## 1. Purpose

This matrix maps JLA policy domains and operating controls to compliance expectations. It acts as the primary cross-reference between the JLA specification, enforcement rules, and external audit requirements.

## 2. Matrix

| Domain            | Control Area                                | Primary Source                                                                                                                                   | Evidence                                |
| ----------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------- |
| Access control    | RBAC/ABAC, deny-by-default                  | [SECURITY.md](../SECURITY.md), [rules/global.md](../rules/global.md)                                                                             | Access logs, recertification reports    |
| Determinism       | Output hashing, reproducibility             | [RULES.md](../RULES.md), [rules/deterministic.md](../rules/deterministic.md)                                                                     | Determinism tests, replay results       |
| Handoffs          | Schema-validated transfer of control        | [rules/handoff.md](../rules/handoff.md)                                                                                                          | Handoff audit records                   |
| Memory governance | Scoped, encrypted memory                    | [rules/memory.md](../rules/memory.md)                                                                                                            | Memory access logs, deletion records    |
| Safety            | Output quarantine, hallucination thresholds | [rules/safety.md](../rules/safety.md)                                                                                                            | Safety test reports, quarantine records |
| Compliance        | Checkpoints and right-to-erasure            | [rules/compliance.md](../rules/compliance.md)                                                                                                    | Compliance reports, erasure records     |
| Incident response | Severity-based escalation                   | [rules/escalation.md](../rules/escalation.md)                                                                                                    | Incident timelines, escalation evidence |
| Architecture      | Governed design and review                  | [JLA.md](../JLA.md), [SYSTEM.md](../SYSTEM.md)                                                                                                   | ADRs, architecture proposals            |
| Refactoring       | Approved staged mutation                    | [commands/refactor_repo.md](../commands/refactor_repo.md), [pipelines/refactor/pipeline.md](../pipelines/refactor/pipeline.md)                   | Diffs, review reports                   |
| Migration         | Controlled transition planning              | [commands/create_migration_plan.md](../commands/create_migration_plan.md), [pipelines/migration/pipeline.md](../pipelines/migration/pipeline.md) | Migration plans, rollback docs          |

## 3. Compliance Coverage Rules

- Every control must map to an owner
- Every control must have a test procedure
- Every control must have evidence retention defined
- Any gap in coverage must be added to the risk register

## 4. External Frameworks

- SOC2: access control, logging, incident response, change management
- ISO 27001: access control, operations security, incident management, risk assessment
- GDPR: data minimization, residency, erasure, breach notification
- HIPAA (if applicable): PHI access, encryption, minimum necessary, BAAs

## 5. Review Cadence

- Monthly: compliance matrix verification
- Quarterly: mapping validation against current JLA docs
- Annual: external audit preparation refresh
