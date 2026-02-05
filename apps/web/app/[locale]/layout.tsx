import { getLocale } from 'next-intl/server';
import Provider from '../provider';
import type { Locale } from '@/shared/locales';

import { Header } from '@/widgets/header';

export default async function LocaleLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const locale = (await getLocale()) as Locale;

    return (
        <Provider locale={locale}>
            <Header />
            {children}
        </Provider>
    );
}
