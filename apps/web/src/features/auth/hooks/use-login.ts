import { useMutation, useQueryClient } from '@tanstack/react-query';
import { login as loginApi } from '../api/login';
import { AUTH_QUERY_KEY } from './constants';
import { ApiError } from '@/shared/lib/api';
import type { Account } from '@repo/shared';

export function useLogin() {
    const queryClient = useQueryClient();

    return useMutation<Account, ApiError, { email: string; password: string }>({
        mutationFn: ({ email, password }) => loginApi(email, password),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
        },
    });
}
