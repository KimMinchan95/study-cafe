'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCafeList } from '@/entities/cafe';
import { useDebouncedValue } from '@/shared/hooks';
import { Input } from '@/shared/ui';
import { useTranslations } from 'next-intl';
import { Search } from 'lucide-react';

import CafeCard from './cafe-card';
import type { Cafe } from '@repo/shared';

const SEARCH_DEBOUNCE_MS = 300;

function filterCafes(cafes: Cafe[], query: string): Cafe[] {
    const q = query.trim().toLowerCase();
    if (!q) return cafes;
    return cafes.filter(
        (cafe) =>
            cafe.businessName.toLowerCase().includes(q) ||
            cafe.address1?.toLowerCase().includes(q) ||
            cafe.address2?.toLowerCase().includes(q)
    );
}

export default function CafeList() {
    const t = useTranslations('Common');
    const tCafe = useTranslations('Cafe');

    const [searchInput, setSearchInput] = useState('');
    const debouncedSearch = useDebouncedValue(searchInput, SEARCH_DEBOUNCE_MS);

    const {
        data: cafeList,
        isPending,
        isError,
    } = useQuery({
        queryKey: ['cafe'],
        queryFn: getCafeList,
    });

    const filteredList = useMemo(
        () => (cafeList ? filterCafes(cafeList, debouncedSearch) : []),
        [cafeList, debouncedSearch]
    );

    if (isPending)
        return <p className="text-muted-foreground text-sm">{t('Loading')}</p>;
    if (isError)
        return <p className="text-destructive text-sm">{t('Error')}</p>;
    if (!cafeList?.length)
        return <p className="text-muted-foreground text-sm">{t('No data')}</p>;

    return (
        <div className="mt-4">
            <div className="relative mb-4">
                <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                    type="search"
                    placeholder={tCafe('Search by name or location')}
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="pl-9"
                    aria-label={tCafe('Search by name or location')}
                />
            </div>
            {!filteredList.length ? (
                <p className="text-muted-foreground text-sm">
                    {tCafe('No search results')}
                </p>
            ) : (
                <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {filteredList.map((cafe) => (
                        <li key={cafe.cafeId}>
                            <CafeCard cafe={cafe} />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
