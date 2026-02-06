import { useMutation, useQueryClient } from '@tanstack/react-query';
import { login as loginApi } from '../api/login';
import { AUTH_QUERY_KEY } from './constants';

export function useLogin() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            email,
            password,
        }: {
            email: string;
            password: string;
        }) => loginApi(email, password),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
        },
    });
}
