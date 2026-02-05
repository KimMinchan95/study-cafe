'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { NextIntlClientProvider } from 'next-intl';
import { LOCALES, type Locale } from '@/shared/locales';
import { queryClient } from '@/shared/lib/query-client';

export default function Provider({
    children,
    locale,
}: {
    children: React.ReactNode;
    locale: Locale;
}) {
    return (
        <QueryClientProvider client={queryClient}>
            <NextIntlClientProvider locale={locale} messages={LOCALES[locale]}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                >
                    {children}
                </ThemeProvider>
            </NextIntlClientProvider>
        </QueryClientProvider>
    );
}
