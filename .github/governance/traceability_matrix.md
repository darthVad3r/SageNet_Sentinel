# Control Traceability Matrix

Version: 1.0.0
Owner: Governance Engineering
Classification: Internal / Enterprise
Status: Active

## Purpose

Map policy controls to enforcing artifacts, validation procedures, and evidence outputs.

| Control ID                                   | Policy Source                                    | Enforcing Artifact                                                                  | Validation/Test                                                                      | Evidence Output                            |
| -------------------------------------------- | ------------------------------------------------ | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------ |
| CTL-001 Schema-first execution               | SYSTEM.md, RULES.md                              | docs/schemas.md                                                                     | tests/acceptance.md                                                                  | Schema validation logs, handoff records    |
| CTL-002 Error classification                 | RULES.md                                         | rules/error_taxonomy.md                                                             | tests/regression.md                                                                  | Error records with error_type and severity |
| CTL-003 Escalation SLAs                      | rules/escalation.md, SECURITY.md                 | pipelines/incident_response/pipeline.md, pipelines/reliability_incident/pipeline.md | runbooks/security/incident-response.md, runbooks/reliability/reliability-incident.md | Incident timeline, escalation timestamps   |
| CTL-004 Determinism                          | rules/deterministic.md                           | tests/determinism.md                                                                | tests/determinism.md                                                                 | Determinism reports, hash comparisons      |
| CTL-005 Drift management                     | rules/deterministic.md, SECURITY.md              | pipelines/risk_review/pipeline.md                                                   | tests/drift.md                                                                       | Drift evaluation reports                   |
| CTL-006 Hallucination limits                 | rules/safety.md, SECURITY.md                     | pipelines/risk_review/pipeline.md                                                   | tests/hallucination.md                                                               | Hallucination scoring reports              |
| CTL-007 Tenant isolation                     | SYSTEM.md, SECURITY.md                           | rules/memory.md, integrations/\*.md                                                 | tests/regression.md                                                                  | Access denials, memory/integration logs    |
| CTL-008 Security incident response           | SECURITY.md, rules/escalation.md                 | pipelines/incident_response/pipeline.md                                             | runbooks/security/incident-response.md                                               | Incident evidence package                  |
| CTL-009 Reliability incident handling        | SECURITY.md, rules/escalation.md                 | pipelines/reliability_incident/pipeline.md                                          | runbooks/reliability/reliability-incident.md                                         | Reliability evidence package               |
| CTL-010 Governance closure and risk tracking | governance/audit.md, governance/risk_register.md | agents/governance/\*                                                                | tests/acceptance.md                                                                  | Closure sign-off, risk updates             |

## Notes

- Any control without both validation and evidence is audit-incomplete.
- Matrix updates are required whenever policy or pipeline behavior changes.
