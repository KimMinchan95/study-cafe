'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/lib/utils';
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

    return (
        <nav className="flex items-center gap-1">
            {TABS.map((tab) => {
                const isActive = pathname === tab.href;
                return (
                    <Button
                        key={tab.href}
                        variant="ghost"
                        size="sm"
                        className={cn(isActive && 'bg-green-900 text-white')}
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
