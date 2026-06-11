# Compliance Rules
Version: 1.1.0
Owner: Governance Engineering
Classification: Internal / Enterprise
Status: Active
Parent: RULES.md

## 1. Purpose
This file defines compliance-specific rules that all agents, skills, pipelines, and integrations must satisfy. These rules enforce regulatory and enterprise policy requirements.

## 2. Compliance Checkpoint Requirements
Every pipeline must include the following compliance checkpoints before producing output:
- Data handling check: verify data classification labels are present and respected
- Safety check: verify output does not contain forbidden content
- Memory governance check: verify memory access is within scope
- Integration boundary check: verify outbound data does not violate classification rules
- Schema validation: verify all records conform to canonical schemas

All checkpoint results are logged and included in the pipeline execution audit record.

## 3. Data Handling Rules
- All data must be labeled with a classification level (RESTRICTED, CONFIDENTIAL, INTERNAL, PUBLIC) at write time
- RESTRICTED and CONFIDENTIAL data may not be sent to external systems unless explicitly approved in agent charter
- PII must not appear in logs, traces, or telemetry in plaintext; must be redacted or tokenized
- All data handling must comply with applicable regulations (GDPR, HIPAA, SOC2, ISO 27001)
- Data classification is enforced at: memory writes, integration calls, telemetry emission, output generation

## 4. Audit Trail Requirements
Every agent action must produce an immutable audit record containing:
- agent_id, pipeline_id, skill_id, tenant_id
- timestamp (UTC)
- action type
- input_hash, output_hash, schema_version
- compliance check results (pass/fail per check)
- data classification labels present

Retention: 7 years for compliance-related records.

## 5. Right-to-Erasure Support (GDPR)
- Memory redaction pipeline must complete within 30 days of a verified erasure request
- Deletion must be verified by the Validator agent post-execution
- Deletion records must be retained for 7 years (the record of deletion, not the data)
- Redaction must apply to: agent memory, project memory, telemetry exports, integration caches
- Completion confirmation must be sent to requestor

## 6. Compliance Failure Behavior
On compliance failure:
1. Pipeline halts immediately
2. Failure logged with all required audit fields
3. compliance_review pipeline triggered
4. Governance owner notified within 1 hour
5. No output returned to caller until failure is resolved
6. Compliance failure records retained as audit evidence for 7 years

## 7. Regulatory Alignment
### SOC2 Type II
- Audit log completeness verified quarterly
- Access control logs reviewed quarterly
- Incident response records reviewed annually
- Control testing results documented per SECURITY.md cadence

### ISO 27001
- Risk register reviewed quarterly
- Control testing results documented per SECURITY.md
- Non-conformities remediated within 60 days

### GDPR
- Data processing inventory maintained and updated quarterly
- DPA agreements in place for all integrations handling personal data
- Breach notification: regulatory authority within 72 hours of confirmed P1 incident
- Data subject requests handled within 30 days

### HIPAA (if applicable)
- PHI access logged per access event
- Minimum necessary access enforced at all times
- BAA agreements in place for all applicable integrations
- PHI breach notification: HHS and affected individuals within 60 days

## 8. Enforcement
- Compliance rules are enforced by the Policy Engine and Compliance agent at runtime
- Compliance agent may halt any pipeline if a compliance violation is detected
- Enforcement logs are immutable and retained for 7 years
- Compliance rule changes require Governance owner approval
