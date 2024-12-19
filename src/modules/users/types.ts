import { User } from "../auth/types";

export interface ReadSearchUsersOptions {
    query: string;
    role?: string;
}

export interface ReadUserByIdOptions {
    id: number;
}

export interface PublicProfileOptions {
    id: number;
}

export interface PublicProfile {
    avatar_url: string;
    description: string;
    id: number;
    user: User;
}

export interface editPublicProfilePayload {
    avatar_url: string;
    description: string;
    id: number;
}

export interface EditUserFormValues {
    full_name: string;
    user_role: string;
}
