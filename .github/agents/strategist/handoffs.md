# Strategist Agent — Handoffs
Version: 1.0.0
Parent: agents/strategist/charter.md

## Outbound Handoffs
### ? Architect
- Trigger: Strategic plan requires technical execution design
- Payload: strategic_plan, priorities, constraints, context_hash

### ? Coordinator
- Trigger: Strategy requires multi-agent pipeline orchestration
- Payload: strategic_plan, required_pipelines, context_hash

### ? Researcher
- Trigger: Additional context required before strategy can be formed
- Payload: research_request, scope, context_hash

## Inbound Handoffs
### ? Coordinator — dispatches strategic planning task
### ? Architect — requests strategic alignment check
