# Dashboards

Version: 1.0.0
Owner: Platform Engineering
Classification: Internal / Enterprise
Status: Active

## 1. Purpose

This document defines the dashboard standards for the JLA. Dashboards provide real-time visibility into system health, compliance posture, and execution flow.

## 2. Dashboard Principles

- Dashboards must be role-appropriate
- Dashboards must preserve tenant isolation
- Dashboards must prioritize actionable signals over vanity metrics
- Dashboards must link to evidence and raw telemetry
- Dashboard definitions must be version-controlled

## 3. Required Dashboards

### System Overview

- Uptime
- Pipeline completion rates
- Error rates
- Queue depth
- Current incidents

### Agent Performance

- Per-agent latency
- Success/failure counts
- Handoff volume
- Drift indicators

### Pipeline Execution

- Active pipelines
- Step state distribution
- Halted pipelines
- Validation outcomes

### Compliance Posture

- Compliance checkpoint pass rates
- Audit evidence completeness
- Retention status
- Right-to-erasure queue

### Security Posture

- Access denials
- Policy violations
- Key rotation status
- Cross-tenant attempts blocked

### Observability Health

- Log ingestion status
- Metric freshness
- Trace sampling coverage
- Alert delivery status

## 4. Access Control

- Dashboards must be scoped by tenant and role
- Governance and Security dashboards may be broader, but still tenant-aware
- Public dashboards are forbidden for operational data

## 5. Refresh Requirements

- Critical dashboards: near real-time
- Operational dashboards: every 1–5 minutes
- Compliance dashboards: every 15 minutes or on event

## 6. Alert Links

Every dashboard panel that reflects a threshold or SLO must link to the relevant alert rule and evidence source.

## 7. Retention

- Dashboard configuration: version-controlled indefinitely
- Rendered snapshot exports: 1 year
- Audit dashboard snapshots: 7 years

## 8. Operational Use

Dashboards are for monitoring and decision support only; logs and traces remain the source of truth.
