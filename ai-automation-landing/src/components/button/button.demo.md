# Button Demo

## Props

- variant: 'primary' | 'secondary' | 'danger' | 'text-only' | 'ghost' (deprecated, migration alias of text-only)
- size: 'sm' | 'md' | 'lg'
- type: 'button' | 'submit' | 'reset'
- disabled: boolean
- loading: boolean
- fullWidth: boolean
- iconLeft: string
- iconRight: string
- ariaLabel: string

## Events

- pressed: emits MouseEvent on activation

## Usage Examples

```html
<app-ui-button variant="primary" (pressed)="save()">Save</app-ui-button>
<app-ui-button variant="secondary" iconLeft="←">Back</app-ui-button>
<app-ui-button variant="text-only">Secondary action</app-ui-button>
<app-ui-button variant="ghost">Legacy ghost action (deprecated)</app-ui-button>
<app-ui-button variant="danger" [loading]="true">Delete</app-ui-button>
```

## Accessibility Notes

- Uses native button semantics for keyboard support.
- Includes visible focus styling, aria-busy during loading, and supports aria-label for icon-only actions.
