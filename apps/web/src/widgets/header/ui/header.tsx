import Image from 'next/image';
import Link from 'next/link';
import Logo from '@/public/logo.svg';
import ThemeToggle from '@/shared/ui/theme-toggle';
import { Button } from '@/shared/ui/button';
import { Book, User, ChartBar } from 'lucide-react';

const TABS = [
    { label: 'Cafe', href: '/cafe', icon: <Book /> },
    { label: 'Statics', href: '/statics', icon: <ChartBar /> },
    { label: 'My Page', href: '/my-page', icon: <User /> },
];

export default function Header() {
    return (
        <header className="h-12 border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-800">
            <div className="container flex h-full items-center justify-between">
                <Link href="/">
                    <Image
                        src={Logo}
                        alt="Study Cafe Logo"
                        width={100}
                        height={100}
                    />
                </Link>
                <div className="flex items-center gap-2">
                    <nav className="flex items-center gap-1">
                        {TABS.map((tab) => (
                            <Button
                                key={tab.href}
                                variant="ghost"
                                size="sm"
                                asChild
                            >
                                <Link href={tab.href}>
                                    <span className="size-4">{tab.icon}</span>
                                    {tab.label}
                                </Link>
                            </Button>
                        ))}
                    </nav>
                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
}
