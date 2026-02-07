'use client';

import Link from 'next/link';
import { LogIn, LogOut, User } from 'lucide-react';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuTrigger,
    Separator,
    Button,
} from '@/shared/ui';
import { useTranslations } from 'next-intl';
import { useAuthState, useLogout } from '@/features/auth';
import { SigninDialog, SignupDialog } from '@/features/auth/ui';
import { useToggle } from '@/shared/hooks';

export default function MyInfo() {
    const t = useTranslations('MyInfo');
    const tMenu = useTranslations('Menu');

    const {
        value: isSigninDialogOpen,
        setTrue: openSigninDialog,
        setFalse: closeSigninDialog,
    } = useToggle(false);
    const {
        value: isSignupDialogOpen,
        setTrue: openSignupDialog,
        setFalse: closeSignupDialog,
    } = useToggle(false);

    const { user, isAuthenticated, isLoading } = useAuthState();
    const logoutMutation = useLogout();

    const handleLogout = async () => {
        await logoutMutation.mutateAsync();
        window.location.href = '/';
    };

    if (isLoading || !isAuthenticated || !user) {
        return (
            <>
                <Button
                    variant="outline"
                    size="sm"
                    className="hover:bg-green-700 hover:text-white"
                    onClick={openSigninDialog}
                >
                    <LogIn className="size-4" />
                    {t('Sign In')}
                </Button>
                <SigninDialog
                    open={isSigninDialogOpen}
                    onClose={closeSigninDialog}
                    onOpenSignup={openSignupDialog}
                />
                <SignupDialog
                    open={isSignupDialogOpen}
                    onClose={closeSignupDialog}
                />
            </>
        );
    }

    const displayName = user.displayName || user.email?.split('@')?.[0] || '';

    return (
        <>
            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger className="mx-2 h-7 gap-1 border border-gray-200 px-2 shadow-2xs">
                            <span className="rounded-full bg-green-100/80 px-1 text-green-900">
                                {displayName.charAt(0)}
                            </span>
                            <span className="hidden max-w-[3rem] truncate sm:inline">
                                {displayName}
                            </span>
                        </NavigationMenuTrigger>
                        <NavigationMenuContent className="right-0 left-auto">
                            <ul className="grid w-[200px] gap-1 p-2">
                                <li className="flex-col gap-2">
                                    <p className="truncate px-3 text-xs font-bold">
                                        {displayName}
                                    </p>
                                    <p className="px-3 text-xs text-gray-500">
                                        {user.email}
                                    </p>
                                </li>
                                <Separator className="bg-gray-200 dark:bg-gray-700" />
                                <li>
                                    <Link
                                        href="/my-page"
                                        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-green-700 hover:text-white"
                                    >
                                        <User className="size-4" />
                                        {tMenu('My Page')}
                                    </Link>
                                </li>
                                <li>
                                    <Separator className="bg-gray-200 dark:bg-gray-700" />
                                </li>
                                <li>
                                    <Button
                                        onClick={handleLogout}
                                        disabled={logoutMutation.isPending}
                                        className="flex w-full justify-start gap-2 rounded-md px-3 py-2 text-sm text-red-500 transition-colors hover:bg-red-500 hover:text-white disabled:opacity-50"
                                    >
                                        <LogOut className="size-4" />
                                        {logoutMutation.isPending
                                            ? '...'
                                            : t('Logout')}
                                    </Button>
                                </li>
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
        </>
    );
}
