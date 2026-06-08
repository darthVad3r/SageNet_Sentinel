import type { Preview } from '@storybook/angular';

const preview: Preview = {
  tags: ['autodocs'],
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*|.*(pressed|closed|blurred)$' },
    controls: {
      expanded: true,
      sort: 'requiredFirst',
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      controls: {
        sort: 'requiredFirst',
      },
    },
    a11y: {
      test: 'todo',
    },
    layout: 'centered',
    options: {
      storySort: {
        order: ['UI', 'Components'],
      },
    },
  },
};

export default preview;
