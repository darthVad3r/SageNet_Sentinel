# Design System Folder Structure

## Scope

This document defines the foundational folder structure for UI primitives and theme assets.

## Folder Purposes

- ai-automation-landing/src/components/ui: atom-level UI primitives and their barrels.
- ai-automation-landing/src/styles: global styling assets, SCSS tokens, and TypeScript token/theme placeholders.

## Rules for Adding New Components

- Add only atom-level primitives under src/components/ui.
- Create one folder per primitive using kebab-case.
- Include an index.ts barrel in each primitive folder.
- Re-export primitives through src/components/ui/index.ts.
- Keep primitives presentational and free of feature-level orchestration.

## Naming Conventions

- Primitive folder: kebab-case, for example select-dropdown.
- Primitive class: PascalCase with Component suffix.
- Primitive selector: app- prefix with kebab-case.
- Token keys: semantic camelCase in TypeScript placeholders.

## Import Paths and Barrel Usage

Preferred primitive imports:

```ts
import { ButtonComponent, CardComponent } from "components/ui";
```

Allowed single-primitive barrel import:

```ts
import { ModalDialogComponent } from "components/ui/modal-dialog";
```

Theme/token imports:

```ts
import { tokens } from "styles/tokens";
import { globalThemeConfig } from "styles/global";
```

Alias resolution note:

- Non-relative imports like "components/ui" and "styles/tokens" resolve from src because compilerOptions.baseUrl is set to "src" in ai-automation-landing/tsconfig.json.
- Additional explicit aliases (for example @app/_ and @shared/_) are defined in compilerOptions.paths in ai-automation-landing/tsconfig.json.
- Application and spec builds inherit this behavior through ai-automation-landing/tsconfig.app.json and ai-automation-landing/tsconfig.spec.json.

## Barrel File Policy

- src/components/ui/index.ts is the primary entry for primitives.
- src/components/ui/<primitive>/index.ts remains the per-primitive public entry.
- Avoid importing deep implementation files when a barrel export exists.
