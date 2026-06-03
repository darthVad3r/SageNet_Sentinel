import type { StorybookConfig } from '@storybook/angular';

const config: StorybookConfig = {
  stories: ['../src/components/**/*.stories.@(ts|mdx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/angular',
    options: {},
  },
  webpackFinal: async (config) => {
    config.performance = {
      hints: false,
    };

    config.ignoreWarnings = [
      ...(config.ignoreWarnings ?? []),
      {
        message: /Conflicting values for 'process\.env\.NODE_ENV'/,
      },
    ];

    return config;
  },
};

export default config;
