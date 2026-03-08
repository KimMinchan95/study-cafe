import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { CafeImages } from '@/views/cafe';
import { Card, CardContent, Typography } from '@/shared/ui';
import { API_BASE_URL } from '@/shared/lib/api';
import { MapPin, Users } from 'lucide-react';

import type { Cafe } from '@repo/shared';

const EXAMPLE_AVAILABLE_SEATS = 10;
const EXAMPLE_TOTAL_SEATS = 20;

interface CafeCardProps {
    cafe: Cafe;
}

export default function CafeCard({ cafe }: CafeCardProps) {
    const t = useTranslations('Cafe');
    const imageUrls =
        cafe.images?.map((img) => `${API_BASE_URL}${img.imgSrc}`) ?? [];

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
        </Link>
    );
}
