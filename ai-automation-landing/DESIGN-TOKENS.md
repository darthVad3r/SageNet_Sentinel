# Design Tokens

## Token Philosophy

The design token layer is the single source of truth for foundational visual decisions in the AI Automation Design System. Tokens are defined as SCSS variables and represent stable design intent that can be reused across Angular features.

## Token Categories

The token system is organized into these files:

- src/styles/design-system/\_tokens.colors.scss
- src/styles/design-system/\_tokens.spacing.scss
- src/styles/design-system/\_tokens.typography.scss
- src/styles/design-system/\_tokens.radius.scss
- src/styles/design-system/\_tokens.shadows.scss
- src/styles/design-system/\_tokens.breakpoints.scss
- src/styles/design-system/\_tokens.zindex.scss
- src/styles/design-system/\_index.scss

## Naming Conventions

All tokens follow strict category-prefixed naming:

- $color-\*
- $space-\*
- $font-\*
- $radius-\*
- $shadow-\*
- $breakpoint-\*
- $zindex-\*

Examples:

- $color-primary-500
- $space-md
- $font-size-lg
- $radius-md
- $shadow-sm
- $breakpoint-lg
- $zindex-modal

## How To Consume Tokens In Angular

The global stylesheet imports the token index once:

@use './styles/design-system/index' as \*;

Global styles can then reference SCSS token variables directly.

Component SCSS does not inherit @use declarations from styles.scss. Components should consume the global CSS custom properties exposed from src/styles.scss when import-free usage is required.

The following token groups are exported as CSS variables with the --ds- prefix:

- Color tokens
- Spacing tokens
- Typography tokens
- Radius tokens
- Shadow tokens
- Z-index tokens

Breakpoint tokens are also exported as CSS variables for runtime reads, but CSS variables cannot be used directly in @media conditions. Use the breakpoint scale values directly in media queries or consume them through shared Sass mixins.

Examples:

- --ds-color-primary-500
- --ds-space-md
- --ds-font-size-lg
- --ds-radius-md
- --ds-shadow-sm
- --ds-breakpoint-lg
- --ds-zindex-modal

## Usage Examples

```scss
.page-shell {
  background: var(--ds-color-background-default);
  color: var(--ds-color-neutral-900);
  padding: var(--ds-space-lg);
  border: 1px solid var(--ds-color-border-default);
  border-radius: var(--ds-radius-md);
  box-shadow: var(--ds-shadow-sm);
  z-index: var(--ds-zindex-base);
}

h1 {
  font-family: var(--ds-font-family-sans);
  font-size: var(--ds-font-size-h1);
  line-height: var(--ds-line-height-tight);
  font-weight: var(--ds-font-weight-bold);
}

@media (min-width: 1024px) {
  .page-shell {
    padding: var(--ds-space-xl);
  }
}
```
