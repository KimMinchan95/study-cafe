import { useMutation } from '@tanstack/react-query';
import { createAccount } from '@/entities/user';
import { ApiError } from '@/shared/lib/api';
import type { CreateAccountDto } from '@/entities/user/api/user';
import type { Account } from '@repo/shared';

export function useRegister() {
    return useMutation<Account, ApiError, CreateAccountDto>({
        mutationFn: (data: CreateAccountDto) => createAccount(data),
    });
}
