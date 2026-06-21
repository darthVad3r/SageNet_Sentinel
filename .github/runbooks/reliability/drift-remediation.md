# Drift Remediation Runbook

Version: 1.0.0
Owner: Platform Engineering
Classification: Internal / Enterprise
Status: Active

## Detection Criteria

- Drift threshold breach from deterministic or quality evaluation
- Three consecutive drift breaches within policy window

## Verification Steps

1. Confirm baseline and current measurement windows
2. Validate sample integrity and schema consistency
3. Classify severity and open risk_review record

## Containment Steps

1. Freeze impacted release path if drift affects safety or compliance
2. Route through risk_review or reliability_incident as required

## Remediation Steps

1. Identify root cause (prompt drift, schema drift, integration behavior drift)
2. Apply controlled fix and rerun determinism and drift tests
3. Document corrective actions and owners

## Closure Criteria

- Drift returns within threshold
- Validation and compliance checks pass
- Governance sign-off recorded
