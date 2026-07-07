/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas: '#0A0E17',
        surface: {
          DEFAULT: '#111827',
          raised: '#1A2332',
          overlay: '#232D3F',
        },
        border: {
          DEFAULT: '#2D3A4F',
          subtle: '#1E293B',
        },
        text: {
          primary: '#E8EDF5',
          secondary: '#9AA8BC',
          muted: '#6B7A90',
        },
        accent: {
          gold: '#C9A227',
          teal: '#2EC4B6',
        },
        positive: {
          DEFAULT: '#3DDC97',
          muted: '#1A3D2E',
        },
        negative: {
          DEFAULT: '#F07167',
          muted: '#3D1F1C',
        },
        neutral: {
          DEFAULT: '#8B9CB3',
          muted: '#1E2836',
        },
        chart: {
          1: '#2EC4B6',
          2: '#C9A227',
          3: '#6C8EBF',
          4: '#9B7EDE',
          5: '#E07A5F',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        'display-lg': ['2.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '600' }],
        'display': ['2rem', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '600' }],
        'heading': ['1.25rem', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '600' }],
        'body': ['0.9375rem', { lineHeight: '1.5', fontWeight: '400' }],
        'caption': ['0.8125rem', { lineHeight: '1.4', fontWeight: '400' }],
        'overline': ['0.6875rem', { lineHeight: '1.3', letterSpacing: '0.06em', fontWeight: '500' }],
      },
      spacing: {
        '4.5': '1.125rem',
        '13': '3.25rem',
        '15': '3.75rem',
        '18': '4.5rem',
      },
      borderRadius: {
        card: '0.625rem',
      },
      boxShadow: {
        card: '0 1px 0 0 rgba(255, 255, 255, 0.04) inset, 0 4px 24px -4px rgba(0, 0, 0, 0.4)',
        elevated: '0 1px 0 0 rgba(255, 255, 255, 0.06) inset, 0 8px 32px -8px rgba(0, 0, 0, 0.5)',
      },
    },
  },
  plugins: [],
}
