# Metrics

Version: 1.0.0
Owner: Platform Engineering
Classification: Internal / Enterprise
Status: Active

## 1. Purpose

This document defines the metric standard for the JLA. Metrics measure system health, reliability, compliance, and governance performance across pipelines, agents, and integrations.

## 2. Metrics Principles

- Metrics must be stable and consistently named
- Metrics must be tenant-aware where applicable
- Metrics must support SLO tracking and incident detection
- Metrics must not expose sensitive data
- Metrics must be emitted deterministically from the same event source

## 3. Required Metric Families

### Pipeline Metrics

- jla_pipeline_duration_ms
- jla_pipeline_success_total
- jla_pipeline_failure_total
- jla_pipeline_halted_total
- jla_pipeline_retry_total

### Agent Metrics

- jla_agent_latency_ms
- jla_agent_success_total
- jla_agent_failure_total
- jla_agent_handoff_total

### Skill Metrics

- jla_skill_execution_ms
- jla_skill_success_total
- jla_skill_failure_total

### Compliance and Security Metrics

- jla_compliance_check_failures_total
- jla_security_violations_total
- jla_policy_denials_total
- jla_memory_scope_violations_total
- jla_cross_tenant_attempts_total

### Data Quality Metrics

- jla_schema_validation_failures_total
- jla_drift_score
- jla_hallucination_score
- jla_output_quarantine_total

## 4. Metric Labels

Metrics may include:

- tenant_id
- agent_id
- pipeline_id
- skill_id
- command_id
- severity
- error_type
- classification_label

## 5. SLO Mapping

- Pipeline completion SLOs must be derived from jla_pipeline_duration_ms
- Security uptime SLOs must be derived from policy and enforcement metrics
- Hallucination and drift thresholds must be derived from Validator reports

## 6. Collection Rules

- Metrics must be emitted at step completion and error boundaries
- Aggregation windows must be explicit
- Tenant-level metrics must never be mixed across tenants
- Missing metric series for critical systems must trigger an alert

## 7. Retention

- High-resolution metrics: 30 days
- Aggregated metrics: 1 year
- Audit-relevant metric snapshots: 7 years

## 8. Integrity

- Metric series names must not change without version bump
- Metric schema changes require governance review
- Metric backfill must be labeled as backfill data

## 9. Operational Use

Metrics drive alerting, dashboards, SLO compliance, and trend analysis. Metrics are not a substitute for logs or traces; they complement them.
