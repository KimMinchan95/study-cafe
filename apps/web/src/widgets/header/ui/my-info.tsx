'use client';

import Link from 'next/link';
import { CircleUser, LogIn, LogOut, User } from 'lucide-react';
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

export default function MyInfo() {
    const t = useTranslations('MyInfo');
    const tMenu = useTranslations('Menu');

    const { user, isAuthenticated, isLoading } = useAuthState();
    const logoutMutation = useLogout();

    const handleLogout = async () => {
        await logoutMutation.mutateAsync();
        window.location.href = '/';
    };

    if (isLoading || !isAuthenticated || !user) {
        return (
            <Button
                variant="outline"
                size="sm"
                className="hover:bg-green-700 hover:text-white"
                onClick={() => {
                    window.location.href = '/login';
                }}
            >
                <LogIn className="size-4" />
                로그인
            </Button>
        );
    }

    const displayName = user.displayName || user.email.split('@')[0];

    return (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger className="h-8 gap-2 px-2">
                        <CircleUser className="size-4" />
                        <span className="hidden sm:inline">{displayName}</span>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="right-0 left-auto">
                        <ul className="grid w-[200px] gap-1 p-2">
                            <li className="flex-col gap-2">
                                <p className="px-3 text-xs font-bold">
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
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    disabled={logoutMutation.isPending}
                                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-500 transition-colors hover:bg-red-500 hover:text-white disabled:opacity-50"
                                >
                                    <LogOut className="size-4" />
                                    {logoutMutation.isPending
                                        ? '...'
                                        : t('Logout')}
                                </button>
                            </li>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    );
}
