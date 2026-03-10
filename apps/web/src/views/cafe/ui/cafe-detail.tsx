import Link from 'next/link';

import { CafeImages } from '@/views/cafe';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getCafeById } from '@/entities/cafe';
import { Typography } from '@/shared/ui';
import { API_BASE_URL } from '@/shared/lib/api';
import { ArrowLeft, MapPin } from 'lucide-react';

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
                <article className="flex-3">
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
                </article>
                <aside className="flex-1">
                    {/* TODO: 카페정보 넣기 */}
                    <Typography.H4>aside</Typography.H4>
                </aside>
            </section>
        </main>
    );
}
