# Card Demo

## Props

- title: string
- subtitle: string
- surface: 'default' | 'muted'

## Events

- None

## Usage Examples

```html
<app-card title="Title" subtitle="Subtitle">Card content</app-card>
<app-card surface="muted">Muted card content</app-card>
```

## Accessibility Notes

- Renders as a semantic article.
- Applies optional aria-label derived from title.
