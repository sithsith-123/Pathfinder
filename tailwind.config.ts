import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}', './lib/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1a1a2e',
        'primary-hover': '#12122a',
        accent: '#c0622f',
        'accent-hover': '#a8521f',
        'accent-tint': 'rgba(192, 98, 47, 0.1)',
        surface: '#faf9f7',
        card: '#ffffff',
        text: '#1a1a2e',
        secondary: '#6b6b80',
        border: '#e2ddd8',
        success: '#2d6a4f',
        'success-tint': 'rgba(45, 106, 79, 0.1)',
        'progress-track': '#e2ddd8',
        'focus-ring': '#f4c59e',
      },
      boxShadow: {
        soft: '0 4px 24px rgba(26, 26, 46, 0.08)',
        card: '0 1px 4px rgba(26, 26, 46, 0.06)',
      },
      fontFamily: {
        sans: ['"MiSans Khmer"', '"Noto Sans Khmer"', '"Khmer OS System"', '"Khmer Sangam MN"', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
        btn: '8px',
      },
    },
  },
  plugins: [],
};

export default config;
