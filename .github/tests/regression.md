# Regression Tests

Version: 1.0.0

## Purpose

This file defines regression coverage for the JLA. Regression tests preserve expected behavior across spec, workflow, and integration changes.

## Regression Themes

- Deterministic command routing
- Stable agent handoffs
- Schema compatibility for outputs and memory
- Policy enforcement and access control
- Audit logging continuity

## Regression Rules

- Test the narrowest impacted surface first
- Treat any schema drift as a breaking change unless explicitly versioned
- Preserve known-good examples as fixtures for later comparison
