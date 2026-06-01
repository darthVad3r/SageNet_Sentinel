# UI Primitives

## Purpose

The ui directory contains atom-level, reusable presentation primitives.

These components should be framework-safe and import-safe across features.

## What Belongs Here

- Button-like controls
- Input and select controls
- Surface primitives like cards and dialogs
- Typography and spacing primitives

## Rules

- Keep primitives focused on one concern.
- Prefer presentational inputs and outputs over feature logic.
- Do not place page-level orchestration or API calls here.
- Add an index.ts in each primitive folder.
- Re-export every primitive through src/components/ui/index.ts.

## Naming Conventions

- Folder names use kebab-case: button, select-dropdown.
- Component classes use PascalCase with Component suffix.
- Selectors use app- prefix and kebab-case.

## Import Usage

Use the ui barrel when importing primitives:

```ts
import { ButtonComponent, CardComponent } from 'components/ui';
```

You can also import a single primitive barrel directly:

```ts
import { InputFieldComponent } from 'components/ui/input-field';
```
