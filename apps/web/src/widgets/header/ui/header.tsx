import Image from 'next/image';
import Link from 'next/link';
import Logo from '@/public/logo.svg';
import ThemeToggle from '@/shared/ui/theme-toggle';
import Navigation from './navigation';

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
                    <Navigation />
                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
}
