import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { cn } from '@/shared/lib/utils';

import { CafeImages } from '@/views/cafe';
import { Card, CardContent, Typography } from '@/shared/ui';
import { API_BASE_URL } from '@/shared/lib/api';
import { MapPin, Users } from 'lucide-react';

import type { Cafe } from '@repo/shared';

const SEAT_SCARCITY_PERCENT = 0.33;

interface CafeCardProps {
    cafe: Cafe;
}

export default function CafeCard({ cafe }: CafeCardProps) {
    const t = useTranslations('Cafe');
    const imageUrls =
        cafe.images?.map((img) => `${API_BASE_URL}${img.imgSrc}`) ?? [];

    const availableSeats =
        cafe.seats?.filter((seat) => seat.state === 'IDLE').length ?? 0;
    const totalSeats = cafe.seats?.length ?? 0;
    const seatScarcity = totalSeats * SEAT_SCARCITY_PERCENT;
    const isSeatScarcity = availableSeats <= seatScarcity;
    const cheapestPrice = cafe.prices?.sort(
        (a, b) => Number(a.amountTotal) - Number(b.amountTotal)
    )[0];

    return (
        <Link href={`/cafe/${cafe.cafeId}`}>
            <Card>
                <div className="relative">
                    <CafeImages
                        imageUrls={imageUrls}
                        altPrefix={cafe.businessName}
                        sizes="(max-width: 768px) 100vw, 400px"
                    />
                    <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/50 to-transparent p-2">
                        <Typography.Medium className="font-bold text-white">
                            {cafe.businessName}
                        </Typography.Medium>
                        <Typography.Muted className="flex items-center gap-1 text-xs text-white opacity-70">
                            <MapPin className="h-3 w-3" />
                            <span>
                                {[cafe.address1, cafe.address2]
                                    .filter(Boolean)
                                    .join(',')}
                            </span>
                        </Typography.Muted>
                    </div>
                </div>
                <CardContent className="space-y-2">
                    <div className="flex items-center justify-between">
                        <div
                            className={cn(
                                'flex items-center gap-1 font-light text-lime-700 dark:text-lime-400',
                                isSeatScarcity &&
                                    'text-yellow-500 dark:text-yellow-400'
                            )}
                        >
                            <Users className="h-3 w-3" />
                            <Typography.XSmall>
                                {`${availableSeats}${t('Seats available')}`}
                            </Typography.XSmall>
                            <Typography.XSmall className="font-extralight text-black dark:text-white">
                                / {totalSeats}
                            </Typography.XSmall>
                        </div>
                        <div className="rounded-lg bg-gray-200 px-2 py-1 dark:bg-gray-800">
                            <Typography.XSmall>
                                {cheapestPrice?.amountTotal}/{t('Hour')}
                            </Typography.XSmall>
                        </div>
                    </div>
                    {cafe.badges?.length ? (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                            {cafe.badges.map((badge) => (
                                <span
                                    key={badge.badgeId}
                                    className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium shadow-sm ring-1 ring-black/5"
                                    style={{
                                        backgroundColor: badge.bgColor,
                                        color: badge.txtColor,
                                    }}
                                >
                                    {badge.title}
                                </span>
                            ))}
                        </div>
                    ) : null}
                </CardContent>
            </Card>
        </Link>
    );
}
