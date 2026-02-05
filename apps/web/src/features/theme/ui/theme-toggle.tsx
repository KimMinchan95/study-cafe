'use client';

import { Button } from '@/shared/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useDidMount } from '@/shared/hooks';
import { cn } from '@/shared/lib/utils';

function ThemeToggle() {
    const { resolvedTheme, setTheme } = useTheme();
    const mounted = useDidMount();

    const handleThemeToggle = () => {
        setTheme(resolvedTheme === 'light' ? 'dark' : 'light');
    };

    if (!mounted) {
        return (
            <Button
                variant="ghost"
                size="icon"
                className="h-auto w-auto"
                disabled
            >
                <Sun className="size-4" />
            </Button>
        );
    }

    const iconClassName = 'size-4 transition-all duration-600 cursor-pointer';

    return (
        <Button
            variant="ghost"
            size="icon"
            className="h-auto w-auto"
            onClick={handleThemeToggle}
        >
            {resolvedTheme === 'light' ? (
                <Moon className={cn(iconClassName, 'rotate-0')} />
            ) : (
                <Sun className={cn(iconClassName, 'rotate-90')} />
            )}
        </Button>
    );
}

export { ThemeToggle };
