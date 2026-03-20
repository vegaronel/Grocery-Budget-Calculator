export const theme = {
  colors: {
    primary: '#0D9488',     // Teal
    primaryLight: '#CCFBF1',
    background: '#F8FAFC',
    card: '#FFFFFF',
    text: '#0F172A',
    textSecondary: '#64748B',
    danger: '#EF4444',      // Red for exceeded
    dangerLight: '#FEE2E2',
    success: '#10B981',     // Green for safe
    border: '#E2E8F0',
    white: '#FFFFFF',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  typography: {
    sizes: {
      small: 12,
      body: 16,
      h3: 20,
      h2: 24,
      h1: 32,
      giant: 48,
    },
    weights: {
      regular: '400' as const,
      medium: '500' as const,
      semibold: '600' as const,
      bold: '700' as const,
    }
  }
};
