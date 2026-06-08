# Select Dropdown Demo

## Props

- id: string (required)
- label: string (required)
- value: string
- options: readonly SelectOption[]
- placeholder: string
- hint: string
- error: string
- required: boolean
- disabled: boolean

## Events

- valueChange: emits selected value string

## Usage Examples

```html
<app-select-dropdown id="role" label="Role" [options]="roles" [(value)]="role" />
```

## Accessibility Notes

- Built on native select for expected keyboard navigation.
- Supports aria-describedby and aria-invalid for assistive technologies.
