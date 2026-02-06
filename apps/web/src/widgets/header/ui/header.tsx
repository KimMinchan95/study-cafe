'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Logo from '@/public/logo.svg';
import { ThemeToggle } from '@/features/theme';
import { LocaleToggle } from '@/features/locale';
import Navigation from './navigation';
import MyInfo from './my-info';
import { Separator } from '@/shared/ui';
import { SigninDialog, SignupDialog } from '@/features/auth/ui';

export default function Header() {
    const [signinOpen, setSigninOpen] = useState(false);
    const [signupOpen, setSignupOpen] = useState(false);

    return (
        <>
            <header className="h-12 border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-800">
                <div className="container flex h-full items-center justify-between">
                    <Link href="/">
                        <Image
                            src={Logo}
                            alt="Study Cafe Logo"
                            width={100}
                            height={100}
                        />
                    </Link>
                    <div className="flex items-center gap-2">
                        <Navigation />
                        <Separator
                            className="h-4 bg-gray-200 dark:bg-gray-700"
                            orientation="vertical"
                        />
                        <LocaleToggle />
                        <Separator
                            className="h-4 bg-gray-200 dark:bg-gray-700"
                            orientation="vertical"
                        />
                        <ThemeToggle />
                        <MyInfo
                            onOpenSignin={() => setSigninOpen(true)}
                            onOpenSignup={() => setSignupOpen(true)}
                        />
                    </div>
                </div>
            </header>
            <SigninDialog open={signinOpen} onOpenChange={setSigninOpen} />
            <SignupDialog open={signupOpen} onOpenChange={setSignupOpen} />
        </>
    );
}
