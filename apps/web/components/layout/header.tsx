import Image from 'next/image';
import Logo from '@/public/logo.svg';
import ThemeToggle from '@/components/common/theme-toggle';

export default function Header() {
    return (
        <header className="bg-white dark:bg-gray-800 h-12 border-b border-gray-200 dark:border-gray-800">
            <div className="flex h-full items-center justify-between container">
                <Image src={Logo} alt="Study Cafe Logo" width={100} height={100} />
                <ThemeToggle />
            </div>
        </header>
    )
}
