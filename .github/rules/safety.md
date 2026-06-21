# Safety Rules
Version: 1.1.0
Owner: Governance Engineering
Classification: Internal / Enterprise
Status: Active
Parent: RULES.md

## 1. Purpose
This file defines the safety rules and forbidden behavior constraints that apply to all agents, skills, and pipelines in the JLA. Safety rules protect against harmful, incorrect, or policy-violating outputs.

## 2. Forbidden Output Categories
Agents must never produce output that:
- Contains hallucinated data, fabricated citations, or invented facts
- Contains PII, PHI, or credentials in plaintext in logs or telemetry
- Violates data classification rules (e.g., RESTRICTED data in unauthorized outputs)
- Bypasses or circumvents compliance, security, or governance checks
- Contains content that violates enterprise content policies
- Is designed to deceive, mislead, or manipulate users or other agents
- Modifies agent charters, pipeline definitions, global rules, or permission grants

Violations trigger: immediate output quarantine, pipeline halt, and P2 incident minimum.

## 3. Hallucination Rules
- Agents must not produce non-factual, fabricated, or unverifiable output in critical workflows
- Critical workflows: any pipeline with compliance, security, financial, or legal implications
- Hallucination detection: Validator agent reviews 10% random sample of production outputs
- Hallucination threshold: <= 0.5% rate in audited workflows
- Threshold breach: triggers reliability_incident pipeline (P3)
- Three consecutive threshold breaches: escalate to P2; rollback trigger
- Zero-tolerance contexts: outputs used as evidence in compliance or security records

## 4. Safety Checks
Every pipeline must execute the following safety checks before producing output:
- Output schema validation (no malformed records)
- Data classification check (no unauthorized data in output)
- PII/PHI redaction check (no plaintext sensitive data in logs or telemetry)
- Content policy check (no policy-violating output content)
- Hallucination risk classification (flag high-risk outputs for Validator review)

All safety check results are logged and included in the pipeline execution audit record.

## 5. Output Quarantine
Any output that fails a safety check must be:
1. Quarantined immediately (not returned to caller)
2. Logged with: output_hash, failure_reason, agent_id, pipeline_id, tenant_id, timestamp
3. Reviewed by the Validator agent before any release decision
4. Released only with explicit Governance owner approval

Quarantine records retained for 7 years.

## 6. Fail-Safe Behavior
If safety systems (Policy Engine, Validator agent, Compliance agent) become unavailable:
1. All pipelines halt immediately
2. Only Governance agents remain active
3. incident_response pipeline is triggered
4. System owner notified within 15 minutes
5. No pipeline may resume until safety systems are verified healthy

## 7. Safety Testing
- All agents and skills must have safety tests covering: forbidden output detection, hallucination guard, PII redaction
- Safety tests run on every pull request and nightly automated run
- Test ownership: Governance Engineering
- Evidence: Safety test report per run, retained in audit logs
- Any safety test failure blocks deployment

## 8. Enforcement
- Safety rules are enforced by the Policy Engine and Validator agent at runtime
- Safety violations trigger pipeline halt and the violation response defined in RULES.md Section 9.3
- Safety enforcement logs are immutable and retained for 7 years
- Safety rule changes require Governance owner + Security owner co-approval
