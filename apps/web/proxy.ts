import createMiddleware from 'next-intl/middleware';
import { LOCALES } from '@/shared/locales';

export default createMiddleware({
    locales: Object.keys(LOCALES),
    defaultLocale: 'ko',
    localePrefix: 'as-needed',
});

export const config = {
    matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
