import type { Meta, StoryObj } from '@storybook/angular';

import {
  SpacingLayoutPrimitivesComponent,
  type GapToken,
  type LayoutMode,
} from './spacing-layout-primitives.component';

interface LayoutStoryArgs {
  mode: LayoutMode;
  gap: GapToken;
  align: 'start' | 'center' | 'end' | 'stretch';
  justify: 'start' | 'center' | 'end' | 'space-between';
  wrap: boolean;
  columns: number;
}

const box = `
  <div style="padding:var(--lab-space-3);border:1px solid var(--lab-line);background:var(--lab-surface-muted);border-radius:var(--lab-radius-sm);">Item A</div>
  <div style="padding:var(--lab-space-3);border:1px solid var(--lab-line);background:var(--lab-surface-muted);border-radius:var(--lab-radius-sm);">Item B</div>
  <div style="padding:var(--lab-space-3);border:1px solid var(--lab-line);background:var(--lab-surface-muted);border-radius:var(--lab-radius-sm);">Item C</div>
`;

const meta: Meta<LayoutStoryArgs> = {
  title: 'UI/Spacing Layout Primitives',
  tags: ['autodocs'],
  component: SpacingLayoutPrimitivesComponent,
  render: (args) => ({
    props: args,
    template: `
      <div style="width:560px;max-width:100%;">
        <app-spacing-layout-primitives
          [mode]="mode"
          [gap]="gap"
          [align]="align"
          [justify]="justify"
          [wrap]="wrap"
          [columns]="columns"
        >
          ${box}
        </app-spacing-layout-primitives>
      </div>
    `,
  }),
  args: {
    mode: 'stack',
    gap: '4',
    align: 'start',
    justify: 'start',
    wrap: false,
    columns: 3,
  },
  argTypes: {
    mode: { control: 'inline-radio', options: ['stack', 'inline', 'grid'] },
    gap: { control: 'select', options: ['1', '2', '3', '4', '6', '8', '10', '12', '16'] },
    align: { control: 'select', options: ['start', 'center', 'end', 'stretch'] },
    justify: { control: 'select', options: ['start', 'center', 'end', 'space-between'] },
    wrap: { control: 'boolean' },
    columns: { control: { type: 'number', min: 1, max: 6, step: 1 } },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Layout primitive for stack/inline/grid spacing and alignment using shared gap tokens.',
      },
      source: {
        code: `<app-spacing-layout-primitives mode="stack" gap="4">...</app-spacing-layout-primitives>`,
      },
    },
  },
};

export default meta;

type Story = StoryObj<LayoutStoryArgs>;

export const Default: Story = {};

export const Modes: Story = {
  render: () => ({
    template: `
      <div style="display:grid;gap:var(--lab-space-6);width:560px;max-width:100%;">
        <app-spacing-layout-primitives mode="stack" gap="3">${box}</app-spacing-layout-primitives>
        <app-spacing-layout-primitives mode="inline" gap="3" align="center">${box}</app-spacing-layout-primitives>
        <app-spacing-layout-primitives mode="grid" gap="3" [columns]="3">${box}</app-spacing-layout-primitives>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
  },
};
