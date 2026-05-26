# Card Demo

## Props

- title: string
- subtitle: string
- variant: 'elevated' | 'flat' | 'outlined'

## Content Slots

- [card-header]: Optional projected header region rendered before generated title/subtitle.
- default content: Main body content rendered inside .ui-card\_\_content.
- [card-footer]: Optional projected footer region rendered after the body content.
- Slot attributes are plain HTML attributes (for example, <div card-header>...</div>).

## Events

- None

## Usage Examples

```html
<app-card title="Title" subtitle="Subtitle" variant="elevated">Card content</app-card>
<app-card variant="outlined">
  <div card-header>Header content</div>
  Card content
  <div card-footer>Footer content</div>
</app-card>
```

## Accessibility Notes

- Renders as a semantic article.
- Applies optional aria-label derived from title.
