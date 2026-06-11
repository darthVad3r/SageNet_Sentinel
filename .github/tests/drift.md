# Drift Test Procedure

Version: 1.0.0
Owner: Platform Engineering
Classification: Internal / Enterprise
Status: Active

## Purpose

Detect quality or behavior drift against 30-day baselines.

## Procedure

1. Evaluate reference sample set weekly
2. Compare current scores to 30-day historical baseline
3. Flag any metric beyond allowed drift threshold
4. Trigger risk_review escalation when threshold breached

## Pass Criteria

- Drift remains within configured threshold window
- No unresolved consecutive breach series

## Evidence

- baseline window
- current score set
- delta values
- escalation linkage (if applicable)
