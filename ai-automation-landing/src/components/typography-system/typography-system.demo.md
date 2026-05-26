# Typography System Demo

## Props

- text: string (required)
- variant: 'display' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'body-sm' | 'label' | 'caption' | 'overline'

## Events

- None

## Usage Examples

```html
<app-typography-system variant="h1" text="Dashboard" />
<app-typography-system variant="body" text="Body copy goes here." />
<app-typography-system variant="overline" text="System status" />
```

## Accessibility Notes

- Heading variants render semantic heading tags.
- Variants map directly to design tokens for consistent readable typography.
