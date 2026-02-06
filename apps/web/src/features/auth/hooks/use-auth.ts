import { useQuery } from '@tanstack/react-query';
import { getUser } from '@/entities/user';
import { AUTH_QUERY_KEY } from './constants';

export function useAuth() {
    return useQuery({
        queryKey: AUTH_QUERY_KEY,
        queryFn: getUser,
        staleTime: 5 * 60 * 1000,
        retry: false,
    });
}
