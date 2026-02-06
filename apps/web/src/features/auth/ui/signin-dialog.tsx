'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Field, FieldGroup, FieldLabel, FieldContent } from '@/shared/ui/field';
import { useInputs } from '@/shared/hooks';
import { useLogin } from '@/features/auth';
import { useTranslations } from 'next-intl';

interface SigninDialogProps {
    open: boolean;
    onClose: () => void;
}

export function SigninDialog({ open, onClose }: SigninDialogProps) {
    const t = useTranslations('MyInfo');
    const tCommon = useTranslations('Common');

    const [values, onChange, resetInputs] = useInputs({
        email: '',
        password: '',
    });
    const loginMutation = useLogin();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await loginMutation.mutateAsync(values);
            resetInputs();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Dialog open={open} onOpenChange={() => onClose()}>
            <DialogContent className="sm:max-w-sm">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>{t('Sign In')}</DialogTitle>
                        <DialogDescription>
                            계정에 로그인하여 시작하세요.
                        </DialogDescription>
                    </DialogHeader>

                    {loginMutation.isError && (
                        <div className="bg-destructive/10 text-destructive rounded-md p-3 text-sm">
                            이메일 또는 비밀번호가 올바르지 않습니다.
                        </div>
                    )}

                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="email">
                                {t('Email')}
                            </FieldLabel>
                            <FieldContent>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder={t('Enter Email')}
                                    value={values.email}
                                    onChange={onChange}
                                    required
                                    disabled={loginMutation.isPending}
                                />
                            </FieldContent>
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="password">
                                {t('Password')}
                            </FieldLabel>
                            <FieldContent>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder={t('Enter Password')}
                                    value={values.password}
                                    onChange={onChange}
                                    required
                                    disabled={loginMutation.isPending}
                                />
                            </FieldContent>
                        </Field>
                    </FieldGroup>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    resetInputs();
                                }}
                                disabled={loginMutation.isPending}
                            >
                                {tCommon('Cancel')}
                            </Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            disabled={loginMutation.isPending}
                        >
                            {loginMutation.isPending
                                ? tCommon('Processing')
                                : t('Sign In')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
