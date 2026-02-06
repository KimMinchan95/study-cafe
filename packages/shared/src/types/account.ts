export interface BaseAccountFields {
    email: string;
    password: string;
    name: string;
    displayName: string;
}

export interface Account extends BaseAccountFields {
    accountId: string;
    role: 'USER' | 'ADMIN';
    status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
    createdAt: Date;
    updatedAt: Date | null;
    lastLoginAt: Date | null;
    emailVerifiedAt: Date | null;
}
