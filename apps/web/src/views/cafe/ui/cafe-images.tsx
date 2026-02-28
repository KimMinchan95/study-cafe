'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DEFAULT_SIZE_CLASS = 'h-52 min-h-52';

interface CafeImagesProps {
    imageUrls: string[];
    altPrefix: string;
    sizeClass?: string;
    sizes?: string;
    className?: string;
}

export default function CafeImages({
    imageUrls,
    altPrefix,
    sizeClass = DEFAULT_SIZE_CLASS,
    sizes,
    className = '',
}: CafeImagesProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const hasMultiple = imageUrls.length > 1;
    const currentImageUrl = imageUrls[currentIndex] ?? null;

    const goPrev = () => {
        setCurrentIndex((i) => (i <= 0 ? imageUrls.length - 1 : i - 1));
    };
    const goNext = () => {
        setCurrentIndex((i) => (i >= imageUrls.length - 1 ? 0 : i + 1));
    };

    return (
        <div
            className={`relative overflow-hidden bg-gray-100 ${sizeClass} ${className}`.trim()}
        >
            {currentImageUrl && (
                <Image
                    key={currentIndex}
                    src={currentImageUrl}
                    alt={`${altPrefix} - ${currentIndex + 1}`}
                    fill
                    {...(sizes != null && { sizes })}
                    className="object-cover"
                />
            )}
            {hasMultiple && (
                <>
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            goPrev();
                        }}
                        className="absolute top-1/2 left-2 z-10 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70"
                        aria-label="pre-image"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            goNext();
                        }}
                        className="absolute top-1/2 right-2 z-10 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70"
                        aria-label="next-image"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </>
            )}
        </div>
    );
}
