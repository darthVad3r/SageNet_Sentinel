# Pre-Push Hook

Version: 1.0.0

## Purpose

This hook defines the checks that should run before changes leave the local workspace.

## Checks

- Run the relevant validation or test subset
- Confirm no unresolved governance or security violations remain
- Verify that changed specs still align with the current architecture
- Reject pushes with missing audit evidence for governed changes

## Failure Behavior

- Block the push when any mandatory check fails
- Record the reason in a durable local log or output channel
