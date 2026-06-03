import type { Meta, StoryObj } from '@storybook/angular';

import { TypographySystemComponent, type TypographyVariant } from './typography-system.component';

interface TypographyStoryArgs {
  text: string;
  variant: TypographyVariant;
}

const meta: Meta<TypographyStoryArgs> = {
  title: 'Components/Typography System',
  tags: ['autodocs'],
  component: TypographySystemComponent,
  render: (args) => ({
    props: args,
    template: `<app-typography-system [text]="text" [variant]="variant"></app-typography-system>`,
  }),
  args: {
    text: 'Automation heading',
    variant: 'body',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['display', 'h1', 'h2', 'h3', 'body', 'body-sm', 'label', 'caption'],
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Global text primitive that maps semantic variants to design-system typography styles.',
      },
      source: {
        code: `<app-typography-system variant="h2" text="Section title"></app-typography-system>`,
      },
    },
  },
};

export default meta;

type Story = StoryObj<TypographyStoryArgs>;

export const Default: Story = {};

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display:grid;gap:var(--lab-space-2);">
        <app-typography-system variant="display" text="Display"></app-typography-system>
        <app-typography-system variant="h1" text="Heading 1"></app-typography-system>
        <app-typography-system variant="h2" text="Heading 2"></app-typography-system>
        <app-typography-system variant="h3" text="Heading 3"></app-typography-system>
        <app-typography-system variant="body" text="Body text"></app-typography-system>
        <app-typography-system variant="body-sm" text="Body small"></app-typography-system>
        <app-typography-system variant="label" text="Label"></app-typography-system>
        <app-typography-system variant="caption" text="Caption"></app-typography-system>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
  },
};
