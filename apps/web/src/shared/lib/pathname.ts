import { LOCALES } from '@/shared/locales';

export function removeLocalePrefix(pathname: string): string {
    const locales = Object.keys(LOCALES);
    let pathnameWithoutLocale = pathname;

    for (const locale of locales) {
        if (pathname.startsWith(`/${locale}/`)) {
            pathnameWithoutLocale = pathname.replace(`/${locale}`, '');
            break;
        }
    }

    if (!pathnameWithoutLocale || pathnameWithoutLocale === '') {
        pathnameWithoutLocale = '/';
    }

    return pathnameWithoutLocale;
}
