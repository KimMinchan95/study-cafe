import { useMutation } from '@tanstack/react-query';
import { createAccount } from '@/entities/user';
import type { CreateAccountDto } from '@/entities/user/api/user';

export function useSignup() {
    return useMutation({
        mutationFn: (createAccountDto: CreateAccountDto) =>
            createAccount(createAccountDto),
    });
}
