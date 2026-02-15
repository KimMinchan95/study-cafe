'use client';

import '@/app/globals.css';

import { QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { NextIntlClientProvider } from 'next-intl';
import { LOCALES, type Locale } from '@/shared/locales';
import { queryClient } from '@/shared/lib/query-client';
import { Toaster } from '@/shared/ui/sonner';

export default function Provider({
    children,
    locale,
}: {
    children: React.ReactNode;
    locale: Locale;
}) {
    return (
        <QueryClientProvider client={queryClient}>
            <NextIntlClientProvider
                locale={locale}
                messages={LOCALES[locale]}
                timeZone="Asia/Seoul"
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                >
                    {children}
                    <Toaster position="top-center" />
                </ThemeProvider>
            </NextIntlClientProvider>
        </QueryClientProvider>
    );
}
