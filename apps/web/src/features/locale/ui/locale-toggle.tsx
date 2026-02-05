'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { ToggleGroup, ToggleGroupItem } from '@/shared/ui';
import { LOCALES, type Locale } from '@/shared/locales';
import { removeLocalePrefix } from '@/shared/lib/pathname';
import { cn } from '@/shared/lib/utils';

function LocaleToggle() {
    const locale = useLocale() as Locale;
    const pathname = usePathname();
    const router = useRouter();
    const pathnameWithoutLocale = removeLocalePrefix(pathname);

    const handleLocaleChange = (value: string) => {
        if (!value) return;
        const newPath = `/${value}${pathnameWithoutLocale === '/' ? '' : pathnameWithoutLocale}`;
        router.push(newPath);
    };

    return (
        <ToggleGroup
            type="single"
            value={locale}
            onValueChange={handleLocaleChange}
            className="border-input h-8 gap-0.5 rounded-lg border p-0.5"
        >
            {(Object.keys(LOCALES) as Locale[]).map((loc) => (
                <ToggleGroupItem
                    key={loc}
                    value={loc}
                    variant="default"
                    size="sm"
                    className={cn(
                        'h-7 cursor-pointer rounded-md text-xs font-medium uppercase transition-colors',
                        'data-[state=on]:bg-green-700 data-[state=on]:text-white'
                    )}
                >
                    {loc}
                </ToggleGroupItem>
            ))}
        </ToggleGroup>
    );
}

export { LocaleToggle };
