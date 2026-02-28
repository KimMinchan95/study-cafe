import { Cafe } from '@repo/shared';

interface CafeDetailProps {
    cafe: Cafe;
}

export default function CafeDetail({ cafe }: CafeDetailProps) {
    return <main className="container">CafeDetail</main>;
}
