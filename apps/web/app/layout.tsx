import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import Provider from './provider';

import Header from '@/components/layout/header';

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

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ko" suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable}`}
                suppressHydrationWarning
            >
                <Provider>
                    <Header />
                    {children}
                </Provider>
            </body>
        </html>
    );
}
