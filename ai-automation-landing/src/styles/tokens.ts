export const colorTokens = {
  brandPrimary: 'PLACEHOLDER_COLOR_BRAND_PRIMARY',
  surface: 'PLACEHOLDER_COLOR_SURFACE',
  textPrimary: 'PLACEHOLDER_COLOR_TEXT_PRIMARY',
} as const;

export const spacingTokens = {
  xs: 'PLACEHOLDER_SPACE_XS',
  sm: 'PLACEHOLDER_SPACE_SM',
  md: 'PLACEHOLDER_SPACE_MD',
} as const;

export const typographyTokens = {
  bodyFontFamily: 'PLACEHOLDER_FONT_BODY_FAMILY',
  headingFontFamily: 'PLACEHOLDER_FONT_HEADING_FAMILY',
  bodyFontSize: 'PLACEHOLDER_FONT_BODY_SIZE',
} as const;

export type ColorTokenName = keyof typeof colorTokens;
export type SpacingTokenName = keyof typeof spacingTokens;
export type TypographyTokenName = keyof typeof typographyTokens;

export interface DesignTokens {
  colors: typeof colorTokens;
  spacing: typeof spacingTokens;
  typography: typeof typographyTokens;
}

export const tokens: DesignTokens = {
  colors: colorTokens,
  spacing: spacingTokens,
  typography: typographyTokens,
};
