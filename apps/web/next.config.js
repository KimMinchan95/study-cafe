import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/shared/lib/i18n.ts');

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const apiOrigin = new URL(apiUrl);

/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        optimizePackageImports: ['lucide-react'],
    },
    images: {
        remotePatterns: [
            {
                protocol: apiOrigin.protocol.replace(':', ''),
                hostname: apiOrigin.hostname,
                port: apiOrigin.port || '',
                pathname: '/**',
            },
        ],
        // localhost(127.0.0.1) 이미지 허용 (개발 환경에서만)
        dangerouslyAllowLocalIP: process.env.NODE_ENV === 'development',
    },
};

export default withNextIntl(nextConfig);
