import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logout as logoutApi } from '../api/logout';
import { AUTH_QUERY_KEY } from './constants';

export function useLogout() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: logoutApi,
        onSuccess: () => {
            queryClient.setQueryData(AUTH_QUERY_KEY, null);
            queryClient.removeQueries({ queryKey: AUTH_QUERY_KEY });
        },
    });
}
