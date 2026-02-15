import type { Config } from 'tailwindcss';

const config: Config = {
    darkMode: 'class',
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './src/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                foreground: 'hsl(var(--foreground))',
                muted: {
                    foreground: 'hsl(var(--muted-foreground))',
                },
            },
        },
    },
    plugins: [],
};

export default config;
