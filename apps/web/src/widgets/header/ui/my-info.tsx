'use client';

import Link from 'next/link';
import { CircleUser, User, LogOut } from 'lucide-react';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuTrigger,
    Separator,
} from '@/shared/ui';

import { useTranslations } from 'next-intl';

export default function MyInfo() {
    const t = useTranslations('MyInfo');
    const tMenu = useTranslations('Menu');

    return (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger className="h-8 gap-2 px-2">
                        <CircleUser className="size-4" />
                        {/* TODO: Display Name 표시 */}
                        <span className="hidden sm:inline">Display Name</span>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="right-0 left-auto">
                        <ul className="grid w-[200px] gap-1 p-2">
                            <li className="flex-col gap-2">
                                <p className="px-3 text-xs font-bold">
                                    {/* TODO: Display Name 표시 */}
                                    Display Name
                                </p>
                                <p className="px-3 text-xs text-gray-500">
                                    {/* TODO: Email Address 표시 */}
                                    Email Address
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
                                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-500 transition-colors hover:bg-red-500 hover:text-white"
                                >
                                    <LogOut className="size-4" />
                                    {t('Logout')}
                                </button>
                            </li>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    );
}
