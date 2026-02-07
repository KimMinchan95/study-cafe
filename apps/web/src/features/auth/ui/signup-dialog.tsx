'use client';

import Image from 'next/image';
import { useRef, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    Field,
    FieldGroup,
    FieldLabel,
    FieldContent,
    FieldDescription,
    Button,
    Input,
} from '@/shared/ui';
import { useTranslations } from 'next-intl';
import { cn } from '@/shared/lib/utils';
import { useRegister, useSignupForm } from '@/features/auth';
import { toast } from 'sonner';
import { ErrorCode } from '@repo/shared';

interface SignupDialogProps {
    open: boolean;
    onClose: () => void;
}

export function SignupDialog({ open, onClose }: SignupDialogProps) {
    const tAuth = useTranslations('Auth');
    const tMyInfo = useTranslations('MyInfo');
    const tCommon = useTranslations('Common');
    const tError = useTranslations('Error');

    const timeOutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const registerMutation = useRegister();

    const {
        formData,
        onFormChange,
        resetForm,
        validation: { isPasswordInvalid, isEmailInvalid, isFormValid },
    } = useSignupForm();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isFormValid) return;

        try {
            await registerMutation.mutateAsync(formData);
            toast.success(tAuth('Signup success'));
            timeOutRef.current = setTimeout(() => {
                onClose();
                resetForm();
            }, 1000);
        } catch (err) {
            toast.error(tAuth('Signup error'));
            console.error(err);
        }
    };

    useEffect(() => {
        return () => {
            if (timeOutRef.current) {
                clearTimeout(timeOutRef.current);
            }
        };
    }, []);

    return (
        <Dialog
            open={open}
            onOpenChange={() => {
                onClose();
                resetForm();
            }}
        >
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
                            {tAuth('Create an account')}
                        </DialogTitle>
                        <DialogDescription className="text-sm text-gray-500">
                            {tAuth('Start reserving your study spots today')}
                        </DialogDescription>
                    </DialogHeader>
                    {registerMutation.error?.message ===
                        ErrorCode.EMAIL_ALREADY_EXISTS && (
                        <div className="text-center text-sm text-red-500">
                            {tError(ErrorCode.EMAIL_ALREADY_EXISTS)}
                        </div>
                    )}

                    <FieldGroup className="gap-3">
                        <Field>
                            <FieldLabel htmlFor="email">
                                {tMyInfo('Email')}
                            </FieldLabel>
                            <FieldContent>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder={'example@email.com'}
                                    value={formData.email}
                                    onChange={onFormChange}
                                    required
                                    disabled={registerMutation.isPending}
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
                                {tMyInfo('Password')}
                            </FieldLabel>
                            <FieldContent>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder={tMyInfo('Enter Password')}
                                    value={formData.password}
                                    onChange={onFormChange}
                                    required
                                    disabled={registerMutation.isPending}
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

                        <Field>
                            <FieldLabel htmlFor="name">
                                {tMyInfo('Name')}
                            </FieldLabel>
                            <FieldContent>
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder={tMyInfo('Name')}
                                    value={formData.name}
                                    onChange={onFormChange}
                                    required
                                    disabled={registerMutation.isPending}
                                />
                            </FieldContent>
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="displayName">
                                {tMyInfo('Nickname')}
                            </FieldLabel>
                            <FieldContent>
                                <Input
                                    id="displayName"
                                    name="displayName"
                                    type="text"
                                    placeholder={tMyInfo('Nickname')}
                                    value={formData.displayName}
                                    onChange={onFormChange}
                                    required
                                    disabled={registerMutation.isPending}
                                />
                            </FieldContent>
                        </Field>
                    </FieldGroup>

                    <DialogFooter className="mt-2 flex-col gap-2">
                        <Button
                            className="w-full rounded-xl bg-green-900 text-white hover:bg-green-800"
                            type="submit"
                            disabled={
                                registerMutation.isPending || !isFormValid
                            }
                        >
                            {registerMutation.isPending
                                ? tCommon('Processing')
                                : tMyInfo('Sign Up')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
