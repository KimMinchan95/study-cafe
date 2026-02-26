'use client';

import { useEffect, useRef, useState } from 'react';

const SCROLL_THRESHOLD = 10;

interface HeaderScrollWrapperProps {
    children: React.ReactNode;
}

export function HeaderScrollWrapper({ children }: HeaderScrollWrapperProps) {
    const [visible, setVisible] = useState(true);
    const lastScrollY = useRef(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY <= SCROLL_THRESHOLD) {
                setVisible(true);
            } else if (currentScrollY > lastScrollY.current) {
                setVisible(false);
            } else {
                setVisible(true);
            }
            lastScrollY.current = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div
            className="fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-out"
            style={{
                transform: visible ? 'translateY(0)' : 'translateY(-100%)',
            }}
        >
            {children}
        </div>
    );
}
