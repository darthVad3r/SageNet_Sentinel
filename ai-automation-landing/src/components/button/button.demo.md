# Button Demo

## Props

- variant: 'primary' | 'secondary' | 'ghost'
- size: 'sm' | 'md' | 'lg'
- type: 'button' | 'submit' | 'reset'
- disabled: boolean
- ariaLabel: string

## Events

- pressed: emits MouseEvent on activation

## Usage Examples

```html
<app-ui-button variant="primary" (pressed)="save()">Save</app-ui-button>
<app-ui-button variant="secondary">Cancel</app-ui-button>
```

## Accessibility Notes

- Uses native button semantics for keyboard support.
- Includes visible focus styling and supports aria-label for icon-only actions.
