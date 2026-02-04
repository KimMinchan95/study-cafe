'use client';

import { Button } from '@/shared/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useDidMount } from '@/shared/hooks';

export default function ThemeToggle() {
    const { resolvedTheme, setTheme } = useTheme();
    const mounted = useDidMount();

    const handleThemeToggle = () => {
        setTheme(resolvedTheme === 'light' ? 'dark' : 'light');
    };

    if (!mounted) {
        return (
            <Button variant="ghost" size="icon" disabled>
                <Sun className="size-4" />
            </Button>
        );
    }

    const iconClassName = 'size-4 transition-all duration-600';

    return (
        <Button variant="ghost" size="icon" onClick={handleThemeToggle}>
            {resolvedTheme === 'light' ? (
                <Moon className={`${iconClassName} rotate-0`} />
            ) : (
                <Sun className={`${iconClassName} rotate-90`} />
            )}
        </Button>
    );
}
