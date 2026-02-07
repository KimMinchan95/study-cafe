import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/shared/lib/i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        optimizePackageImports: ['lucide-react'],
    },
};

export default withNextIntl(nextConfig);
