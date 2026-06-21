# Determinism Test Procedure

Version: 1.0.0
Owner: Platform Engineering
Classification: Internal / Enterprise
Status: Active

## Purpose

Verify same input plus same context produces the same canonical output_hash.

## Procedure

1. Select governed sample set of prompts/contexts
2. Execute each sample twice with identical inputs and context
3. Compare output_hash and required schema fields
4. Record mismatches with error_type=DriftError

## Pass Criteria

- 100% hash match for test sample
- No schema validation failures

## Evidence

- test_run_id
- sample_ids
- input_hash/output_hash pairs
- schema_version
- timestamp_utc
