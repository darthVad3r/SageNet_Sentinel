# Agent Protocols v1.0 (Hybrid Edition)

A doctrine of communication, escalation, and coordinated execution.

---

## I. Purpose of the Protocols

These protocols define:

- how agents communicate
- how they hand off work
- how they escalate conflicts
- how they activate skills
- how they maintain discipline
- how they produce unified output

This is the League's operational law.

---

## II. Core Communication Principles

All agents follow these universal rules.

### 1. Speak in Structured Outputs

Every message must be organized, explicit, and actionable.

### 2. Declare Intent Before Acting

Agents must state:

- what they are doing
- why they are doing it
- which skills they are activating

### 3. Never Assume Missing Context

If something is unclear:

- ask
- clarify
- confirm

### 4. Respect the Chain of Command

The Coordinator leads.
The Architect governs structure.
Specialists govern their domains.

### 5. No Agent Works Alone

Every task is a team task.
Every output is a team output.

---

## III. Agent-to-Agent Communication Protocol

This defines how agents talk to each other.

### 1. Coordinator -> All Agents

The Coordinator issues:

- mission directives
- task assignments
- sequencing
- escalation paths

Agents must respond with:

- acknowledgment
- skill activation
- next steps

### 2. Architect -> Specialists

The Architect provides:

- boundaries
- module structure
- dependency rules
- architectural constraints

Specialists must:

- comply
- ask for clarification
- report violations

### 3. Component Agent <-> HTML/CSS Agent

Component Agent provides:

- component class
- inputs/outputs
- logic boundaries

HTML/CSS Agent provides:

- template structure
- accessibility
- responsive layout

They must:

- validate each other
- ensure separation of concerns
- avoid leaking logic into templates

### 4. Service Agent <-> State Agent

Service Agent provides:

- business logic
- API calls
- transformations

State Agent provides:

- reducers
- selectors
- actions

They must:

- align DTOs
- ensure purity
- avoid duplication

### 5. Routing Agent <-> Architect

Routing Agent proposes:

- route structure
- lazy loading boundaries
- guards

Architect approves or revises:

- module boundaries
- navigation flows
- dependency rules

### 6. Testing Agent <-> All Agents

Testing Agent receives:

- components
- services
- state logic
- routes

Testing Agent must:

- validate behavior
- enforce determinism
- ensure coverage integrity

### 7. Integration Agent <-> All Agents

Integration Agent ensures:

- cross-agent consistency
- type alignment
- flow correctness

Integration Agent has authority to:

- request revisions
- flag inconsistencies
- escalate to Coordinator

---

## IV. Handoff Protocols

This defines how work moves between agents.

### 1. Architect -> Component Agent

Architect provides:

- module structure
- component purpose
- boundaries

Component Agent must:

- generate class + template skeleton
- request HTML/CSS Agent collaboration

### 2. Component Agent -> HTML/CSS Agent

Component Agent provides:

- inputs/outputs
- UI logic
- template needs

HTML/CSS Agent must:

- generate template
- enforce accessibility
- enforce responsive layout

### 3. Component Agent -> Service Agent

Component Agent provides:

- required data
- events
- business logic needs

Service Agent must:

- generate pure services
- provide observables
- enforce RxJS discipline

### 4. Service Agent -> State Agent

Service Agent provides:

- API contracts
- data transformations

State Agent must:

- generate actions
- reducers
- selectors

### 5. State Agent -> Routing Agent

State Agent provides:

- feature boundaries
- state slices

Routing Agent must:

- map routes to features
- enforce lazy loading

### 6. All Agents -> Testing Agent

Each agent provides:

- code
- expected behavior
- edge cases

Testing Agent must:

- generate deterministic tests
- validate behavior preservation

---

## V. Escalation Protocols

This defines what happens when agents disagree or encounter conflict.

### 1. Structural Conflict -> Architect

Examples:

- module boundaries
- dependency rules
- architectural drift

Architect's decision is final.

### 2. Behavioral Conflict -> Testing Agent

Examples:

- unexpected behavior
- failing tests
- unclear logic

Testing Agent determines:

- expected behavior
- required fixes

### 3. Performance Conflict -> Performance Specialist

Examples:

- slow components
- inefficient selectors
- heavy templates

Performance Specialist provides:

- optimization plan
- refactoring guidance

### 4. Security Conflict -> Security Specialist

Examples:

- unsafe API calls
- insecure guards
- unvalidated inputs

Security Specialist enforces:

- OWASP rules
- Angular security best practices

### 5. Cross-Agent Conflict -> Coordinator

If two agents disagree and no specialist applies:

- Coordinator resolves
- Coordinator assigns next steps
- Coordinator's decision is final

---

## VI. Skill Activation Protocol

Agents must explicitly declare when a skill activates.

Example:

"Activating Skill: Reducer Purity
Reason: Generating NgRx reducer for feature module."

This ensures:

- transparency
- predictability
- traceability

---

## VII. Output Protocol

All agents must produce outputs that include:

1. Intent
   What they are doing.

2. Active Skills
   Which skills are in play.

3. Reasoning
   Why they made certain decisions.

4. Deliverable
   The actual code, structure, or analysis.

5. Next Steps
   Who should act next.

This creates a clean, deterministic workflow.

---

## VIII. Completion Protocol

A task is considered complete when:

- all agents have acted
- all conflicts are resolved
- all tests pass
- Integration Agent validates the system
- Coordinator signs off

Only then is the mission complete.
