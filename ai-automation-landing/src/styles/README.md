# Styles and Theme Foundation

## Purpose

The styles directory holds global style assets and design token foundations.

This folder is the source of shared visual decisions used by primitives and features.

## Structure

- \_tokens.scss: existing CSS custom-property token surface.
- global.scss: existing global reset and base styles.
- tokens.ts: typed placeholder token object for TypeScript consumers.
- global.ts: typed global theme configuration placeholder.

## Token Philosophy

- Keep token names semantic and reusable.
- Define primitives once and consume everywhere.
- Avoid hard-coded values in feature components when a token exists.

## Extension Rules

- Add new tokens in category-specific groups.
- Prefer additive token changes over renaming existing keys.
- Document breaking token changes in pull requests.
- Keep SCSS tokens and TypeScript token placeholders conceptually aligned.

## Import Usage

Import shared token placeholders from the styles directory:

```ts
import { tokens } from 'styles/tokens';
import { globalThemeConfig } from 'styles/global';
```
