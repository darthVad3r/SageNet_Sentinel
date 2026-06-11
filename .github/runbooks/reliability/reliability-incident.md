# Reliability Incident Runbook

Version: 1.0.0
Owner: Platform Engineering
Classification: Internal / Enterprise
Status: Active

## Detection Criteria

- P2 reliability incident
- SLO breach, reproducibility failure burst, integration failure burst

## Verification Steps

1. Confirm error taxonomy and severity mapping
2. Confirm reproducibility check results and impacted pipelines
3. Start evidence collection and timeline tracking

## Containment Steps

1. Freeze impacted pipeline segments
2. Route through reliability_incident pipeline
3. Apply temporary controls to reduce blast radius

## Eradication Steps

1. Remove unstable dependency/configuration
2. Fix deterministic or validation gap

## Recovery Steps

1. Re-run validation and determinism checks
2. Restore pipeline execution after governance sign-off

## Communication Checklist

- Notify Validator, Security, Governance, and Risk Officer
- Send status updates at SLA boundaries

## Evidence Checklist

- Validation reports
- Determinism comparison reports
- SLO breach metrics and timestamps
- input_hash, output_hash, context_hash, schema_version
