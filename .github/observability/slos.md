# SLO Baselines

Version: 1.0.0
Owner: Observability Engineering
Classification: Internal / Enterprise
Status: Active

## Purpose

Define measurable SLO thresholds and alert gates for JLA operations.

## SLO Targets

- Pipeline success rate: >= 99.5% per 30-day window
- P1 response SLA adherence: 100%
- P2 response SLA adherence: >= 99%
- Deterministic replay pass rate: >= 99%
- Schema validation pass rate: >= 99.9%
- Cross-tenant policy violations: 0 allowed

## Alert Thresholds

- Warning: metric degrades 2% below target
- Major: metric degrades 5% below target
- Critical: metric degrades 10% below target or any cross-tenant violation

## Evidence Requirements

All SLO evaluations must include:

- measurement window
- metric source
- threshold comparison
- incident linkage if breached
