# Spacing Layout Primitives Demo

## Props

- mode: 'stack' | 'inline' | 'grid' | 'container' | 'divider'
- gap: '1' | '2' | '3' | '4' | '6' | '8' | '10' | '12' | '16'
- align: 'start' | 'center' | 'end' | 'stretch'
- justify: 'start' | 'center' | 'end' | 'space-between'
- wrap: boolean
- columns: number
- maxWidth: string
- padding: '1' | '2' | '3' | '4' | '6' | '8' | '10' | '12' | '16'

## Events

- None

## Usage Examples

```html
<app-spacing-layout-primitives mode="stack" gap="4">...</app-spacing-layout-primitives>
<app-spacing-layout-primitives mode="grid" [columns]="3" gap="6">...</app-spacing-layout-primitives>
<app-spacing-layout-primitives mode="container" maxWidth="72rem">...</app-spacing-layout-primitives>
<app-spacing-layout-primitives mode="divider"></app-spacing-layout-primitives>
```

## Accessibility Notes

- Preserves child semantic markup by acting only as a layout container.
- Uses design-token spacing values for predictable rhythm across themes.
