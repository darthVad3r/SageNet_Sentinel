import { tokens, type DesignTokens } from './tokens';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface GlobalThemeConfig {
  attributeName: string;
  defaultMode: ThemeMode;
  tokens: DesignTokens;
}

export const globalThemeConfig: GlobalThemeConfig = {
  attributeName: 'data-theme',
  defaultMode: 'system',
  tokens,
};
