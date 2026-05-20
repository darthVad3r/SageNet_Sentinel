# Copilot Instructions

## Project Guidelines
- Prefer Angular component-based architecture.
- Create reusable UI components.
- Keep SCSS styling minimal.
- For accessibility and valid semantics, associate labels with form controls (using for+id or wrapping). Otherwise, use non-label text elements like span or p.
- For feature/page standalone Angular components, set `changeDetection: ChangeDetectionStrategy.OnPush` for consistency and performance.