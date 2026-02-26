'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Card, CardContent, Typography } from '@/shared/ui';
import { API_BASE_URL } from '@/shared/lib/api';
import { ChevronLeft, ChevronRight, MapPin, Users } from 'lucide-react';
import type { Cafe } from '@repo/shared';

const EXAMPLE_AVAILABLE_SEATS = 10;
const EXAMPLE_TOTAL_SEATS = 20;

interface CafeCardProps {
    cafe: Cafe;
}

export default function CafeCard({ cafe }: CafeCardProps) {
    const t = useTranslations('Cafe');

    const [currentIndex, setCurrentIndex] = useState(0);

    const imageUrls =
        cafe.images?.map((img) => `${API_BASE_URL}${img.imgSrc}`) ?? [];
    const hasMultiple = imageUrls.length > 1;
    const currentImageUrl = imageUrls[currentIndex] ?? null;

    const goPrev = () => {
        setCurrentIndex((i) => (i <= 0 ? imageUrls.length - 1 : i - 1));
    };
    const goNext = () => {
        setCurrentIndex((i) => (i >= imageUrls.length - 1 ? 0 : i + 1));
    };

    return (
        <Card>
            <div className="relative h-52 min-h-52 overflow-hidden bg-gray-100">
                {currentImageUrl && (
                    <Image
                        key={currentIndex}
                        src={currentImageUrl}
                        alt={`${cafe.businessName} - ${currentIndex + 1}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 400px"
                        className="object-cover"
                    />
                )}
                {hasMultiple && (
                    <>
                        <button
                            type="button"
                            onClick={goPrev}
                            className="absolute top-1/2 left-2 z-10 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70"
                            aria-label="pre-image"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                            type="button"
                            onClick={goNext}
                            className="absolute top-1/2 right-2 z-10 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70"
                            aria-label="next-image"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </>
                )}
                <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/50 to-transparent p-2">
                    <Typography.Medium className="font-bold text-white">
                        {cafe.businessName}
                    </Typography.Medium>
                    <Typography.Muted className="flex items-center gap-1 text-xs text-white opacity-70">
                        <MapPin className="h-3 w-3" />
                        {[cafe.address1, cafe.address2].join(',')}
                    </Typography.Muted>
                </div>
            </div>
            <CardContent>
                <div className="flex items-center gap-1 font-light text-lime-700 dark:text-lime-400">
                    <Users className="h-3 w-3" />
                    <Typography.XSmall>
                        {`${EXAMPLE_AVAILABLE_SEATS}${t('Seats available')}`}
                    </Typography.XSmall>
                    <Typography.XSmall className="font-extralight text-black dark:text-white">
                        / {EXAMPLE_TOTAL_SEATS}
                    </Typography.XSmall>
                </div>
            </CardContent>
        </Card>
    );
}
