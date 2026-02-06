import { getRequestConfig } from 'next-intl/server';
import { LOCALES, type Locale } from '@/shared/locales';

export default getRequestConfig(async ({ requestLocale }) => {
    let locale = (await requestLocale) as Locale;

    if (!locale || !(locale in LOCALES)) {
        locale = 'ko';
    }

    return {
        locale,
        messages: LOCALES[locale],
        timeZone: 'Asia/Seoul',
    };
});
