'use client';

import { ThemeProvider } from 'next-themes';
import { NextIntlClientProvider } from 'next-intl';
import { LOCALES, type Locale } from '@/shared/locales';

export default function Provider({
    children,
    locale,
}: {
    children: React.ReactNode;
    locale: Locale;
}) {
    return (
        <NextIntlClientProvider locale={locale} messages={LOCALES[locale]}>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                {children}
            </ThemeProvider>
        </NextIntlClientProvider>
    );
}
