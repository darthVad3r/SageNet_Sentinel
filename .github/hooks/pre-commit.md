# Pre-Commit Hook

Version: 1.0.0

## Purpose

This hook defines the checks that should run before a commit is accepted in a governed JLA repository.

## Checks

- Validate changed markdown or config files for structural errors
- Confirm no secrets or credentials are staged
- Ensure referenced docs and specs still exist
- Block commits that bypass required evidence or review

## Failure Behavior

- Fail fast on policy violations
- Surface a concise reason for the rejection
- Preserve local changes so the author can correct them
