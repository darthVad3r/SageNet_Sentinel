# Input Field Demo

## Props

- id: string (required)
- label: string (required)
- value: string
- type: 'text' | 'email' | 'password' | 'search'
- placeholder: string
- hint: string
- error: string
- required: boolean
- disabled: boolean

## Events

- valueChange: emits current input value
- blurred: emits when field loses focus

## Usage Examples

```html
<app-input-field id="name" label="Full Name" [(value)]="name" />
<app-input-field id="email" label="Email" type="email" hint="We never share your email" />
```

## Accessibility Notes

- Connects label and control via for/id.
- Uses aria-describedby for hint and error text and aria-invalid for error states.
