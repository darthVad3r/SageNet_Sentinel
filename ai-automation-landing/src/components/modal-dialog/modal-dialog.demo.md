# Modal Dialog Demo

## Props

- open: boolean
- title: string (required)
- description: string
- closeOnBackdrop: boolean

## Events

- closed: emits 'close-button' | 'backdrop' | 'escape'

## Usage Examples

```html
<app-modal-dialog [open]="open" title="Dialog Title" (closed)="onClosed($event)">
  <p>Dialog content</p>
</app-modal-dialog>
```

## Accessibility Notes

- Uses role="dialog" and aria-modal="true".
- Connects title and optional description with labelledby/describedby.
- Traps Tab focus while open and supports Escape to close.
