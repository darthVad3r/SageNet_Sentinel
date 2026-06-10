# Alerts

Version: 1.0.0
Owner: Governance Engineering
Classification: Internal / Enterprise
Status: Active

## 1. Purpose

This document defines the alerting standards for the JLA. Alerts notify operators when thresholds, incidents, or governance violations require attention.

## 2. Alert Principles

- Alerts must be actionable
- Alerts must map to a specific owner
- Alerts must include evidence links and escalation path
- Alerts must respect tenant boundaries
- Alerts must avoid duplicate noise where possible

## 3. Alert Sources

- SLO breaches
- Policy violations
- Security incidents
- Compliance failures
- Drift threshold breaches
- Hallucination threshold breaches
- Integration failures
- Missing telemetry or log ingestion failures

## 4. Severity Levels

- P1: Critical, immediate response required
- P2: Major, same-hour response required
- P3: Moderate, same-day response required
- P4: Minor, next-business-day review

## 5. Alert Payload

Every alert must include:

- alert_id
- timestamp
- tenant_id
- severity
- source_system
- source_event
- summary
- evidence_links
- recommended_action
- owner
- escalation_target
- schema_version

## 6. Routing Rules

- P1 alerts page Security owner and System owner immediately
- P2 alerts page the owning operational or governance team within 1 hour
- P3 alerts are routed to the relevant owner queue
- P4 alerts are logged and reviewed in the regular cadence

## 7. Deduplication and Suppression

- Deduplication is allowed only when the root cause is identical
- Suppression must never hide true incidents
- Suppressed alerts must still be logged
- Alert suppression policies require Governance approval

## 8. Retention

- Alert records: 1 year
- Incident alerts: 7 years
- Alert tuning changes: 7 years

## 9. Operational Use

Alerts are the trigger mechanism for incident response and operational awareness. Alerts must always point to the underlying logs, metrics, or traces used to generate them.
