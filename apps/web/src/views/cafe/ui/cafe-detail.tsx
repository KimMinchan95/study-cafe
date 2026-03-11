import Link from 'next/link';

import { CafeImages } from '@/views/cafe';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getCafeById } from '@/entities/cafe';
import { Typography } from '@/shared/ui';
import { API_BASE_URL } from '@/shared/lib/api';
import { ArrowLeft, MapPin } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { SeatGrid } from './seat-grid';

import type { Cafe } from '@repo/shared';

interface CafeDetailProps {
    params: Promise<{ cafeId: string }>;
}

export default async function CafeDetail({ params }: CafeDetailProps) {
    const t = await getTranslations('Cafe');
    const { cafeId } = await params;

    let cafe: Cafe;
    try {
        cafe = await getCafeById(cafeId);
    } catch {
        notFound();
    }
    return (
        <main className="container">
            <Link
                href="/cafe"
                className="flex cursor-pointer items-center gap-1"
            >
                <ArrowLeft className="text-muted-foreground h-4 w-4" />
                <Typography.Muted>{t('Back to cafes')}</Typography.Muted>
            </Link>
            <section className="flex gap-4">
                <article className="flex flex-3 flex-col gap-4">
                    {cafe.images?.length ? (
                        <CafeImages
                            imageUrls={cafe.images.map(
                                (img) => `${API_BASE_URL}${img.imgSrc}`
                            )}
                            altPrefix={cafe.businessName}
                            sizeClass="h-72 min-h-72"
                            sizes="(max-width: 768px) 100vw, 900px"
                            className="mt-2 rounded-lg"
                        />
                    ) : null}
                    <div>
                        <Typography.H3 className="mt-4">
                            {cafe.businessName}
                        </Typography.H3>
                        <Typography.Muted className="mt-2 flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>
                                {[cafe.address1, cafe.address2]
                                    .filter(Boolean)
                                    .join(', ')}
                            </span>
                        </Typography.Muted>
                    </div>
                    <div className="flex flex-col gap-5 rounded-xl border border-gray-200 bg-white p-5 shadow-lg dark:border-gray-800 dark:bg-gray-900">
                        <Typography.Large>
                            {t('Select a seat')}
                        </Typography.Large>
                        <div className="flex w-full justify-center gap-5">
                            <SeatStatus
                                statusName={t('Available')}
                                colorClass={getSeatStateStyle('IDLE')}
                            />
                            <SeatStatus
                                statusName={t('Using')}
                                colorClass={getSeatStateStyle('USING')}
                            />
                            <SeatStatus
                                statusName={t('Locked')}
                                colorClass={getSeatStateStyle('LOCKED')}
                            />
                        </div>
                        <div className="flex w-full justify-center">
                            {cafe.seats?.length > 0 && (
                                <SeatGrid seats={cafe.seats} />
                            )}
                            {cafe.seats?.length === 0 && (
                                <Typography.Muted>
                                    {t('No seats')}
                                </Typography.Muted>
                            )}
                        </div>
                    </div>
                </article>
                <aside className="flex-1">
                    {/* TODO: 카페정보 넣기 */}
                    <Typography.H4>aside</Typography.H4>
                </aside>
            </section>
        </main>
    );
}

function getSeatStateStyle(state: string): string {
    switch (state) {
        case 'IDLE':
            return 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500';
        case 'LOCKED':
            return 'bg-amber-400 dark:bg-amber-600';
        case 'USING':
            return 'bg-gray-100 dark:bg-gray-500 cursor-not-allowed';
        default:
            return 'bg-gray-200 dark:bg-gray-700';
    }
}

const SeatStatus = ({
    statusName,
    colorClass,
}: {
    statusName: string;
    colorClass: string;
}) => {
    return (
        <div className="flex items-center gap-2">
            <div className={cn('h-5 w-5 rounded-full', colorClass)} />
            <Typography.Small>{statusName}</Typography.Small>
        </div>
    );
};
