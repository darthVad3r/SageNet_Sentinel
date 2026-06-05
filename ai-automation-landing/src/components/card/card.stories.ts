import type { Meta, StoryObj } from '@storybook/angular';

import { CardComponent } from './card.component';

interface CardStoryArgs {
  title: string;
  subtitle: string;
  surface: 'default' | 'muted';
  content: string;
}

const meta: Meta<CardStoryArgs> = {
  title: 'UI/Card',
  tags: ['autodocs'],
  component: CardComponent,
  render: (args) => ({
    props: args,
    template: `
      <div style="max-width:420px;">
        <app-card [title]="title" [subtitle]="subtitle" [surface]="surface">
          <p>{{ content }}</p>
        </app-card>
      </div>
    `,
  }),
  args: {
    title: 'Automation Summary',
    subtitle: 'Weekly snapshot',
    surface: 'default',
    content: 'Use cards to group related information with optional title and subtitle.',
  },
  argTypes: {
    surface: { control: 'inline-radio', options: ['default', 'muted'] },
  },
  parameters: {
    docs: {
      description: {
        component: 'Content container primitive with optional title/subtitle and surface variants.',
      },
      source: {
        code: `<app-card title="Title" subtitle="Subtitle" surface="default">...</app-card>`,
      },
    },
  },
};

export default meta;

type Story = StoryObj<CardStoryArgs>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => ({
    template: `
      <div style="display:grid;gap:var(--lab-space-4);max-width:420px;">
        <app-card title="Default" subtitle="Standard surface" surface="default">
          <p>Default surface card content.</p>
        </app-card>
        <app-card title="Muted" subtitle="Subtle surface" surface="muted">
          <p>Muted surface card content.</p>
        </app-card>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
  },
};
