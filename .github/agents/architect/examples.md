# Architect Agent — Examples
Version: 1.0.0
Parent: agents/architect/charter.md

## Example 1: generate_architecture Command

### Input
```json
{
  "command_type": "generate_architecture",
  "context": {
    "repository": "acme-corp/payments-service",
    "requirements": ["add event-driven order processing", "ensure SOC2 compliance"],
    "constraints": ["must integrate with existing PostgreSQL", "no vendor lock-in"]
  }
}
```

### Architect Execution Steps
1. Calls analysis skill ? maps existing service structure and dependencies
2. Calls summarize skill ? condenses repository context to working window
3. Calls generate skill ? produces architecture proposal
4. Calls plan skill ? produces phased implementation plan
5. Handoff ? Reviewer with architecture_proposal
6. Risk flags (if any) ? Handoff to Risk Officer

### Output (schema-validated)
```json
{
  "output_type": "architecture_proposal",
  "proposal": {
    "pattern": "event-driven with CQRS",
    "components": ["OrderCommandService", "OrderEventBus", "OrderQueryService"],
    "data_store": "PostgreSQL (existing) + event log",
    "compliance_notes": "SOC2 CC7 satisfied via audit log on all commands"
  },
  "adrs": [{"id": "ADR-001", "decision": "CQRS pattern", "rationale": "..."}],
  "risk_flags": [],
  "output_hash": "sha256:abc123...",
  "schema_version": "1.0.0"
}
```

## Example 2: Risk Flag Forwarding

### Scenario
Architect identifies a proposed architecture introduces a single point of failure.

### Handoff to Risk Officer
```json
{
  "from_agent_id": "architect",
  "to_agent_id": "risk_officer",
  "handoff_reason": "architectural_risk_identified",
  "risk_flags": [
    {
      "risk_id": "ARCH-RISK-001",
      "severity": "HIGH",
      "description": "Single point of failure in OrderEventBus",
      "mitigation_options": ["add redundancy", "implement circuit breaker"]
    }
  ],
  "context_hash": "sha256:def456..."
}
```
