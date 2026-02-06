const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function fetchApi<T>(
    endpoint: string,
    options?: RequestInit
): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    try {
        const response = await fetch(url, {
            ...options,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                ...options?.headers,
            },
        });

        if (!response.ok) {
            if (response.status === 401) {
                return null as T;
            }
            throw new Error(
                `API Error: ${response.status} ${response.statusText}`
            );
        }

        return response.json();
    } catch (error) {
        // 네트워크 에러 처리
        if (error instanceof TypeError && error.message === 'Failed to fetch') {
            throw new Error(
                `네트워크 연결 실패: API 서버(${API_BASE_URL})에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.`
            );
        }
        // 다른 에러는 그대로 전파
        throw error;
    }
}
