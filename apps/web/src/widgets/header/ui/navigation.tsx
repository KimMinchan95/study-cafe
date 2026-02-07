'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/shared/ui/button';
import { removeLocalePrefix } from '@/shared/lib/pathname';
import { useTranslations } from 'next-intl';
import { User, ChartColumn, Coffee } from 'lucide-react';

const TABS = [
    { label: 'Cafes', href: '/cafe', icon: <Coffee /> },
    { label: 'Statics', href: '/statics', icon: <ChartColumn /> },
    { label: 'My Page', href: '/my-page', icon: <User /> },
];

export default function Navigation() {
    const pathname = usePathname();
    const t = useTranslations('Menu');

    const pathnameWithoutLocale = removeLocalePrefix(pathname);

    return (
        <nav className="flex items-center gap-1">
            {TABS.map((tab) => {
                const isActive = pathnameWithoutLocale === tab.href;
                return (
                    <Button
                        key={tab.href}
                        variant="ghost"
                        size="sm"
                        className="hover:bg-green-700 hover:text-white data-[state=active]:bg-green-900 data-[state=active]:text-white"
                        data-state={isActive ? 'active' : 'inactive'}
                        asChild
                    >
                        <Link href={tab.href}>
                            <span className="size-4">{tab.icon}</span>
                            {t(tab.label)}
                        </Link>
                    </Button>
                );
            })}
        </nav>
    );
}
