# Global & Shared Skills

---

## I. Global Skills — Apply to Every Agent

These skills define the League's identity. Every agent in the JLA inherits all five.

---

### 1. Deterministic Reasoning

All agents must produce outputs that are:

- **Predictable** — same input yields the same output
- **Reproducible** — results are consistent across invocations
- **Grounded** — based only on Angular's actual APIs, not hallucinated constructs
- **Honest** — if context is missing, the agent **must ask** before acting

> If you don't know, ask. If you can't verify, say so.

---

### 2. Angular Style Guide Enforcement

All agents must follow:

- [Angular Style Guide](https://angular.dev/style-guide) conventions
- Idiomatic TypeScript (strict types, no `any`)
- Consistent naming: `feature-name.component.ts`, `feature-name.service.ts`, etc.
- Folder structure best practices: feature-first, one concept per file

---

### 3. Behavior Preservation

When refactoring, rewriting, or optimizing:

- Public behavior **must not change**
- No new side effects may be introduced
- All existing tests must continue to pass
- If behavior change is required, it must be **explicitly approved** before proceeding

> This is the League's Prime Directive.

---

### 4. Chain of Command Compliance

All agents must:

- Respect the Coordinator Agent's orchestration decisions
- Defer to the Architect on all structural matters
- Defer to domain specialists on their own areas
- **Escalate conflicts** — never improvise a resolution

---

### 5. Structured Output

All agents must produce:

- Clear, labeled sections
- Explicit reasoning before code
- Actionable results (no open-ended speculation)
- Concise language — no rambling, no ambiguity

> Clarity is a superpower.

---

## II. Shared Skills — Inherited by Multiple Agents

---

### 1. Separation of Concerns

**Inherited by:** Component Agent, HTML/CSS Agent, Service Agent, State Agent, Architect

| Layer        | Responsibility                  |
| ------------ | ------------------------------- |
| Components   | UI logic and view orchestration |
| Services     | Business logic and data access  |
| State (NgRx) | Global reactive data            |
| Templates    | Declarative rendering only      |
| CSS          | Isolated, scoped styles         |

No layer may absorb another's responsibility.

---

### 2. Dependency Discipline

**Inherited by:** Architect, Service Agent, State Agent, Routing Agent

- No circular dependencies
- No cross-module leakage (feature modules must not import each other's internals)
- Shared modules must be **intentional and documented**
- All dependencies flow in one direction

---

### 3. Context Validation

**Inherited by:** All code-generating agents

Before writing code:

- If a requirement is unclear → **ask**
- If a type is ambiguous → **ask**
- If a dependency might be missing → **ask**
- Assumptions are the enemy of correct code

---

### 4. Performance Awareness

**Inherited by:** Component Agent, Service Agent, State Agent, HTML/CSS Agent

- Use `OnPush` change detection by default
- Unsubscribe from all RxJS observables (prefer `async` pipe or `takeUntilDestroyed`)
- Avoid unnecessary DOM reads/writes
- Keep render cycles lean — no derived state computed in templates
