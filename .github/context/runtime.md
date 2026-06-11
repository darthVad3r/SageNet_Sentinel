# Runtime Context

Version: 1.0.0

## Purpose

This file defines the minimum runtime context shape used when the JLA receives a request.

## Required Context

- Request intent
- Tenant or workspace scope
- Applicable policies and approvals
- Input artifacts and dependencies
- Expected output schema

## Runtime Rules

- Load only what the current step needs
- Normalize prompts before execution
- Preserve source context for auditing and handoff
- Stop when context is insufficient or contradictory
