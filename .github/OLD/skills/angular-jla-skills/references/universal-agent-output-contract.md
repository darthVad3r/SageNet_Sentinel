# Universal Agent Output Contract (AOC) v1.0

A unified, deterministic communication standard for all JLA agents.

---

## I. Purpose

The Universal Agent Output Contract ensures that every agent in the Justice League of Angular:

- communicates in a predictable structure
- declares intent and skill activation
- performs deterministic handoffs
- aligns with the Mission Execution Engine
- produces machine-readable, coordinator-friendly output

This contract is mandatory for all agents.

---

## II. Required Output Sections

Every agent output must include the following sections in this exact order:

### 1. Stage

The current Mission Execution Engine stage the agent is operating in.

Examples:

- Stage 4: Assignment
- Stage 5: Execution
- Stage 6: Integration

### 2. Intent

A concise statement of what the agent is doing.

Examples:

- Generate Angular component shell.
- Validate NgRx reducer purity.
- Optimize template bindings.

### 3. Active Skills

A list of skills the agent is invoking for this task.

Examples:

- Skill: Idiomatic Component Generation
- Skill: Reducer Purity
- Skill: RxJS Efficiency

### 4. Reasoning

A brief explanation of why the agent is taking this approach.

This must be:

- explicit
- structured
- free of speculation

### 5. Deliverable

The actual output of the task.

Examples:

- code
- analysis
- architectural notes
- validation results

### 6. Next Steps / Handoff

A clear, explicit handoff to the next agent.

It must include:

- next agent name
- context being passed
- required follow-up

Example:

Handoff to Service Agent with DTO contract and required transformations.

### 7. Completion Status

A final statement indicating whether the task is complete.

Allowed examples:

- Completion Status: complete
- Completion Status: blocked
- Completion Status: needs revision
- Completion Status: awaiting validation

---

## III. Required Formatting Rules

All agents must follow these formatting rules:

### 1. No freeform paragraphs

All content must be structured into the required sections.

### 2. No missing sections

Every output must include all seven sections, even if a section is temporarily empty.

### 3. No ambiguous handoffs

Handoffs must name the next agent explicitly.

### 4. No implicit assumptions

If context is missing, the agent must request clarification.

### 5. No deviation from order

Sections must appear in the exact order defined in this contract.

---

## IV. Required Behavioral Rules

### 1. Declare skills before using them

Agents must not apply a skill silently.

### 2. Declare stage transitions

If an agent moves to a new stage, it must state the transition.

### 3. Declare handoffs explicitly

No implicit or assumed handoffs.

### 4. Declare completion explicitly

The Coordinator cannot infer completion.

### 5. Follow the Mission Execution Engine

Agents must operate only within the stages assigned to them.

---

## V. Required Error Handling

If an agent encounters a problem, it must:

### 1. Declare the issue

Examples:

- missing context
- unclear requirements
- conflicting instructions
- invalid input

### 2. Declare the blocking condition

Example:

Cannot proceed without API response type.

### 3. Declare escalation target

Examples:

- Architect
- Security Specialist
- Performance Specialist
- Coordinator

### 4. Halt execution until resolved

Agents must not guess or improvise.

---

## VI. Required Handoff Format

Every handoff must follow this exact structure:

```text
Handoff:
  To: <Agent Name>
  Context Provided:
    - <Key detail 1>
    - <Key detail 2>
    - <Key detail 3>
  Required Action:
    - <What the next agent must do>
```

This ensures deterministic, machine-readable transitions.

---

## VII. Required Completion Format

Every agent must end with:

```text
Completion Status: <complete | blocked | needs revision | awaiting validation>
```

No other phrasing is permitted.

---

## VIII. Contract Guarantees

By following this contract, the JLA guarantees:

- consistent communication
- predictable handoffs
- zero ambiguity
- zero silent failures
- full alignment with the Mission Execution Engine
- seamless multi-agent orchestration

This contract is binding for all agents.
