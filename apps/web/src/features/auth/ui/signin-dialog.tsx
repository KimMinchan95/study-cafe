'use client';

import Image from 'next/image';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    Button,
    Input,
    Field,
    FieldGroup,
    FieldLabel,
    FieldContent,
    FieldDescription,
} from '@/shared/ui';
import { useLogin, useSigninForm } from '@/features/auth';
import { useTranslations } from 'next-intl';
import { cn } from '@/shared/lib/utils';
import { ErrorCode } from '@repo/shared';

const INVALID_CREDENTIALS_CODE = 401;

interface SigninDialogProps {
    open: boolean;
    onClose: () => void;
    onOpenSignup?: () => void;
}

export function SigninDialog({
    open,
    onClose,
    onOpenSignup,
}: SigninDialogProps) {
    const t = useTranslations('MyInfo');
    const tCommon = useTranslations('Common');
    const tAuth = useTranslations('Auth');
    const tError = useTranslations('Error');

    const loginMutation = useLogin();
    const {
        formData,
        onFormChange,
        resetForm,
        validation: { isEmailInvalid, isPasswordInvalid, isFormValid },
    } = useSigninForm();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await loginMutation.mutateAsync(formData);
            resetForm();
            onClose();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Dialog open={open} onOpenChange={() => onClose()}>
            <DialogContent className="sm:max-w-sm" showCloseButton={false}>
                <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                    <DialogHeader className="items-center gap-2">
                        <Image
                            src={'/logo.svg'}
                            alt="logo"
                            width={180}
                            height={100}
                        />
                        <DialogTitle className="text-xl">
                            {tAuth('Welcome back')}
                        </DialogTitle>
                        <DialogDescription className="text-sm text-gray-500">
                            {tAuth('Sign in to your account to continue')}
                        </DialogDescription>
                    </DialogHeader>
                    {loginMutation.error?.status ===
                        INVALID_CREDENTIALS_CODE && (
                        <div className="text-center text-sm text-red-500">
                            {tError(ErrorCode.INVALID_CREDENTIALS)}
                        </div>
                    )}
                    <FieldGroup className="gap-3">
                        <Field>
                            <FieldLabel htmlFor="email">
                                {t('Email')}
                            </FieldLabel>
                            <FieldContent>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder={'you@example.com'}
                                    value={formData.email}
                                    onChange={onFormChange}
                                    required
                                    disabled={loginMutation.isPending}
                                />
                            </FieldContent>
                            <FieldDescription
                                className={cn(
                                    'text-xs',
                                    'text-gray-500',
                                    isEmailInvalid && 'text-red-500'
                                )}
                            >
                                {tAuth(
                                    isEmailInvalid
                                        ? 'Invalid email address'
                                        : 'Valid email address'
                                )}
                            </FieldDescription>
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
                                    value={formData.password}
                                    onChange={onFormChange}
                                    required
                                    disabled={loginMutation.isPending}
                                />
                            </FieldContent>
                            <FieldDescription
                                className={cn(
                                    'text-xs',
                                    'text-gray-500',
                                    isPasswordInvalid && 'text-red-500'
                                )}
                            >
                                {tAuth(
                                    'Password must contain at least one letter and one number, and be between 8 and 30 characters long'
                                )}
                            </FieldDescription>
                        </Field>
                    </FieldGroup>

                    <DialogFooter className="mt-2 flex-col gap-2">
                        <Button
                            className="w-full rounded-xl bg-green-900 text-white hover:bg-green-800"
                            type="submit"
                            disabled={loginMutation.isPending || !isFormValid}
                        >
                            {loginMutation.isPending
                                ? tCommon('Processing')
                                : t('Sign In')}
                        </Button>
                        <span className="text-center text-sm text-gray-500">
                            {tAuth("Don't have an account?")}
                            <Button
                                variant="link"
                                onClick={() => {
                                    onClose();
                                    onOpenSignup?.();
                                }}
                            >
                                {t('Sign Up')}
                            </Button>
                        </span>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
