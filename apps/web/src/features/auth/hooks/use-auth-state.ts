import { useAuth } from './use-auth';

export function useAuthState() {
    const { data: user, isLoading, isError } = useAuth();

    return {
        user,
        isAuthenticated: !!user,
        isLoading,
        isError,
    };
}
