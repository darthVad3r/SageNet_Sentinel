# Risk Register

Version: 1.0.0
Owner: Governance Engineering
Classification: Internal / Enterprise
Status: Active

## 1. Purpose

This document defines the authoritative risk register for the JLA. It tracks active risks, owners, mitigation plans, residual exposure, and closure status.

## 2. Risk Model

Risks are scored using:

- Likelihood: 1 (low) to 5 (high)
- Impact: 1 (low) to 5 (high)
- Composite score: likelihood × impact

## 3. Risk Categories

- Security
- Compliance
- Data handling
- Architecture
- Operational reliability
- Integration
- Determinism / hallucination
- Tenant isolation

## 4. Register Fields

Each risk entry must include:

- risk_id
- title
- category
- description
- source
- likelihood
- impact
- composite_score
- severity
- owner
- mitigation_plan
- due_date
- status
- residual_risk
- evidence_links
- last_reviewed

## 5. Severity Bands

- Low: 1–4
- Medium: 5–9
- High: 10–15
- Critical: 16–25

Critical risks require immediate escalation to Security or Governance owners.

## 6. Review Cadence

- Weekly: review open High/Critical risks
- Monthly: review all open risks
- Quarterly: refresh scoring and mitigation plans
- Annual: archive closed risks review

## 7. Closure Criteria

A risk may be closed only if:

- mitigation is implemented and verified, or
- risk is formally accepted by the appropriate authority, and
- residual risk is documented

## 8. Escalation

- Critical risks trigger escalation immediately
- High risks must be assigned a mitigation owner within 24 hours
- Systemic risks must be added to the relevant pipeline or governance review agenda

## 9. Audit Trail

Every change to a risk entry must be logged with:

- change timestamp
- editor identity
- before/after values
- reason for change
- related incident or control reference
