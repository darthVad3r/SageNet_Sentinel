# Determinism Rules
Version: 1.1.0
Owner: Governance Engineering
Classification: Internal / Enterprise
Status: Active
Parent: RULES.md

## 1. Purpose
This file defines the determinism and reproducibility requirements for all agents, skills, and pipelines in the JLA. Determinism is a core system invariant and cannot be relaxed.

## 2. Determinism Requirements
- Same inputs + same context must always produce the same output_hash
- No random number generation without deterministic seeding (seed must be logged)
- No time-dependent logic that affects output content (timestamps are metadata only)
- No hidden state; all state transitions must be observable and logged
- No nondeterministic external calls without output validation and logging

## 3. Output Hash Requirements
Every agent action must produce:
- output_hash: SHA-256 of the canonical output record
- input_hash: SHA-256 of the canonical input record
- context_hash: SHA-256 of the context object at execution time

All hashes are included in telemetry and audit records. Hash algorithm must be documented in schema_version.

## 4. Reproducibility Verification
- Any output must be reproducible by re-executing with the same input_hash and context_hash
- Reproducibility verified by automated tests on a 10% random sample of production executions (monthly)
- Reproducibility failures are classified as DriftError (P3)
- Three or more reproducibility failures in 30 days: escalate to P2; rollback trigger

## 5. Determinism Testing
- All skills must have determinism tests: run with identical inputs twice and verify identical output_hash
- Tests run on every pull request and nightly automated run
- Test ownership: Platform Engineering
- Evidence: Test report per run, retained in audit logs
- Any determinism test failure blocks deployment

## 6. Allowed Exceptions
The following non-deterministic elements are permitted but must never affect output content:
- Timestamps in metadata fields
- Trace and span IDs (random, but metadata only)
- Log sequence numbers

Any exception must be documented in the agent or skill charter and reviewed annually.

## 7. Drift Detection
- Weekly drift evaluation compares SLI baselines against 30-day historical average
- Monthly drift scoring: re-score outputs against reference prompt/context pairs
- Drift threshold: no more than 5% deviation in evaluation scores over 30 days
- Drift threshold breach triggers risk_review pipeline
- Three consecutive drift threshold breaches trigger P2 escalation and rollback evaluation

## 8. Enforcement
- Determinism violations are classified as DriftError
- Violations trigger the risk_review pipeline
- All determinism test failures block deployment
- Enforcement logs are immutable and retained for 1 year
