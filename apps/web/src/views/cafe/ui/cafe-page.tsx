import { Typography } from '@/shared/ui';
import { useTranslations } from 'next-intl';

export default function CafePage() {
    const t = useTranslations('Cafe');

    return (
        <main className="container">
            <Typography.H3>{t('Find my study spot')}</Typography.H3>
            <Typography.Muted>
                {t('Reserve a seat at the nearest study cafe')}
            </Typography.Muted>
        </main>
    );
}
