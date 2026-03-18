
export interface User {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image: string | null;
    createdAt: Date;
    updatedAt: Date
}

export interface FindUserInput {
    email?: string;
    id?: string;
}

export interface GetUsersInput {
    limit: number;
    page: number;
}