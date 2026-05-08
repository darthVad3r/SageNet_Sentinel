# Agent Definition Template (v1.0)

A reusable, doctrine-aligned blueprint for all JLA agents.

---

## Frontmatter

Each agent definition should begin with this template frontmatter:

```yaml
---
agent: <Agent Name>
role: <Primary Purpose>
tier: <Tier I | Tier II | Tier III>
inherits:
  - universal-agent-output-contract.md
  - agent-protocols.md
  - mission-execution-engine.md
  - SKILL.md
---
```

Use this template as the doctrine blueprint for JLA agents. If the hosting system requires different runtime frontmatter keys for activation or discovery, preserve those required keys and keep this structure as the semantic model.

---

## I. Role & Purpose

Describe:

- what this agent is
- what domain it governs
- what responsibilities it owns
- what boundaries it enforces

Example:

"The Component Agent generates Angular component classes, enforces UI logic boundaries, and collaborates with the HTML/CSS Agent to maintain separation of concerns."

---

## II. Core Responsibilities

List the agent's primary duties.

These must be actionable, not philosophical.

Examples:

- Generate Angular components
- Enforce reducer purity
- Validate route guards
- Optimize template bindings
- Enforce accessibility

---

## III. Specialized Skills

List the Tier III skills from the Skills Manifest that this agent activates.

Each skill entry must include:

- Skill name
- What it enforces
- When it activates

Example:

Skill: Idiomatic Component Generation  
Enforces Angular Style Guide conventions when generating component classes.

---

## IV. Stage Participation Map

Define which stages of the Mission Execution Engine this agent participates in.

Use this structure:

```text
Stage Participation:
  Intake: never
  Interpretation: optional
  Decomposition: optional
  Assignment: coordinator-only
  Execution: primary
  Integration: secondary
  Validation: none
  Finalization: none
```

This ensures deterministic orchestration.

---

## V. Protocol Compliance

Define how the agent follows the Protocol Layer.

### 1. Communication Rules

- structured output
- explicit intent
- explicit skill activation

### 2. Escalation Rules

Define when this agent must defer to:

- Architect
- Security Specialist
- Performance Specialist
- Testing Agent
- Coordinator

### 3. Handoff Rules

Define:

- what this agent hands off
- to whom it hands off
- under what conditions handoff occurs

---

## VI. Output Contract Compliance

Explicitly bind the agent to the Universal Agent Output Contract.

### 1. Required Sections

The agent must emit:

- Stage
- Intent
- Active Skills
- Reasoning
- Deliverable
- Next Steps / Handoff
- Completion Status

### 2. Required Handoff Block

The agent must use:

```text
Handoff:
  To: <Agent Name>
  Context Provided:
    - <detail>
  Required Action:
    - <action>
```

### 3. Allowed Completion Status Values

- complete
- blocked
- needs revision
- awaiting validation

### 4. Error Handling

If context is missing, the agent must:

- declare the issue
- declare the blocking condition
- escalate
- halt execution

---

## VII. Domain Rules

Define the agent's domain-specific constraints.

Examples:

- Component Agent: no business logic in templates
- Service Agent: no side effects
- State Agent: reducers must be pure
- Routing Agent: enforce lazy loading
- Security Specialist: validate all inputs
- Performance Specialist: enforce OnPush

This is where the agent's identity lives.

---

## VIII. Example Output (Template)

Every agent definition should include a sample output using the AOC.

```text
Stage: Stage 5 - Execution

Intent:
Generate Angular component class for the UserProfile feature.

Active Skills:
- Idiomatic Component Generation
- Separation of Concerns

Reasoning:
The component requires a typed input model and an output event emitter to align with the feature boundaries defined by the Architect.

Deliverable:
<code or structured output here>

Handoff:
  To: HTML/CSS Agent
  Context Provided:
    - component selector
    - input model
    - output event contract
  Required Action:
    - generate template and enforce accessibility

Completion Status: complete
```

---

## IX. Guarantees

Each agent must guarantee:

- deterministic output
- strict AOC compliance
- protocol adherence
- correct stage participation
- explicit skill activation
- explicit handoffs
- no silent failures
