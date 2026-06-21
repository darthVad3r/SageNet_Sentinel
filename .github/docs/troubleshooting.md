# Troubleshooting

Version: 1.0.0

## Purpose

This document collects the primary failure modes and recovery patterns for the JLA.

## Common Failures

- Missing or stale context
- Invalid or incomplete inputs
- Permission or policy denial
- Validation failure in downstream checks
- Integration rate limiting or authentication errors

## Recovery Pattern

1. Identify the failing stage.
2. Confirm the expected input, output, and policy scope.
3. Retry only if the retry is bounded and justified.
4. Escalate when the failure is structural or security-related.

## References

- [SECURITY.md](../SECURITY.md)
- [governance/audit.md](../governance/audit.md)
- [observability/alerts.md](../observability/alerts.md)
