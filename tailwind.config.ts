import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}', './lib/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: '#172B4D',
        accent: '#4779D1',
        surface: '#F7F8FA',
        card: '#FFFFFF',
        text: '#202938',
        secondary: '#64748B',
        border: '#E5E9F0',
        success: '#27845A',
      },
      boxShadow: {
        soft: '0 20px 45px -25px rgba(23, 43, 77, 0.25)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
