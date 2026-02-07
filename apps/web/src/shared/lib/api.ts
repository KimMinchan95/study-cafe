const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export class ApiError extends Error {
    constructor(
        public status: number,
        public message: string,
        public data?: any
    ) {
        super(message);
        this.name = 'API_ERROR';
    }
}

interface FetchApiConfig {
    throwOn401?: boolean;
}

export async function fetchApi<T>(
    endpoint: string,
    options?: RequestInit,
    config?: FetchApiConfig
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
            if (response.status === 401 && !config?.throwOn401) {
                return null as T;
            }
            let errorMessage = `API Error: ${response.status} ${response.statusText}`;
            let errorData;
            try {
                errorData = await response.json();
                const rawMessage =
                    errorData.message || errorData.error?.message;
                if (rawMessage) {
                    errorMessage = Array.isArray(rawMessage)
                        ? rawMessage.join(', ')
                        : rawMessage;
                }
            } catch {
                // JSON 파싱 실패 시 기본 메시지(상태 코드 등)를 그대로 사용
            }
            throw new ApiError(response.status, errorMessage, errorData);
        }

        const json = await response.json();
        return json.data;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        if (error instanceof TypeError && error.message === 'Failed to fetch') {
            throw new ApiError(
                0,
                `네트워크 연결 실패: API 서버(${API_BASE_URL})에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.`
            );
        }

        throw error;
    }
}
