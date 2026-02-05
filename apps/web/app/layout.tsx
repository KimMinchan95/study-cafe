import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { getLocale } from 'next-intl/server';
import './globals.css';
import type { Locale } from '@/shared/locales';

const geistSans = localFont({
    src: './fonts/GeistVF.woff',
    variable: '--font-geist-sans',
    display: 'swap',
});
const geistMono = localFont({
    src: './fonts/GeistMonoVF.woff',
    variable: '--font-geist-mono',
    display: 'swap',
});

export const metadata: Metadata = {
    title: 'Study Cafe',
    description: '스터디 카페 좌석 예약 및 관리 시스템',
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const locale = (await getLocale()) as Locale;

    return (
        <html lang={locale} suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable}`}
                suppressHydrationWarning
            >
                {children}
            </body>
        </html>
    );
}
