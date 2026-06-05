# Component Documentation Guide

## Run Documentation

From `ai-automation-landing/`:

```bash
npm run docs:dev
```

Build static docs:

```bash
npm run docs:build
```

## Add New Stories

1. Create a `*.stories.ts` file in the same folder as the component.
2. Export a default Storybook `Meta` block with `title`, `component`, and `tags: ['autodocs']`.
3. Add at least:

- a `Default` story
- a story covering variants
- a story covering major states

4. Include `argTypes` for interactive controls and output actions.
5. Include a usage snippet in `parameters.docs.source.code`.

## Naming Conventions

- Story file: `component-name.stories.ts`
- Story title: `UI/Component Name`
- Primary story name: `Default`
- Variant/state collections: `Variants`, `States`, or feature-specific names

## Component Documentation Guidelines

- Keep stories focused on public inputs/outputs only.
- Do not encode feature-specific behavior in component stories.
- Prefer realistic default args that mirror production usage.
- Include accessibility-oriented examples (labels, disabled/error states, keyboard-relevant interactions).
- Keep stories aligned with existing design tokens and global theme styles.
