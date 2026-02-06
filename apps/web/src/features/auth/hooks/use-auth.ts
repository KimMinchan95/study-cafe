import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUser } from '@/entities/user';
import { logout as logoutApi } from '../api/auth';

const AUTH_QUERY_KEY = ['auth', 'me'] as const;

export function useAuth() {
    return useQuery({
        queryKey: AUTH_QUERY_KEY,
        queryFn: getUser,
        staleTime: 5 * 60 * 1000, // 5분
        retry: false,
    });
}

export function useLogout() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: logoutApi,
        onSuccess: () => {
            // 인증 쿼리 무효화 및 제거
            queryClient.setQueryData(AUTH_QUERY_KEY, null);
            queryClient.removeQueries({ queryKey: AUTH_QUERY_KEY });
        },
    });
}

export function useAuthState() {
    const { data: user, isLoading, isError } = useAuth();

    return {
        user,
        isAuthenticated: !!user,
        isLoading,
        isError,
    };
}
