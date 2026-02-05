export interface Account {
    accountId: string;
    email: string;
    name: string;
    displayName: string;
    role: 'USER' | 'ADMIN';
    status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
    createdAt: string;
    updatedAt: string | null;
    lastLoginAt: string | null;
    emailVerifiedAt: string | null;
}
