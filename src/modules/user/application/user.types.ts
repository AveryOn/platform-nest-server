
export interface User {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
    phoneNumber: string | null;
    createdAt: string | Date;
    updatedAt: string | Date | null;
    deletedAt: string | Date | null;
}

export interface FindUserInput {
    email?: string;
    id?: string;
}

export interface GetUsersInput {
    limit: number;
    page: number;
}