import { Roles } from "../users/constants";

export interface LoginFormValues {
    email: string;
    password: string;
}

export interface RegisterFormValues {
    password: string;
    email: string;
    full_name: string;
    confirmPassword: string;
    policy_confirm: boolean;
}

export interface LoginAccessTokenResponse {
    access_token: string;
    token_type: string;
}

export interface RegisterResponse extends User {
    reset_token: string;
}

export interface User {
    email: string;
    full_name: string;
    user_role: Roles;
    is_assigned_to_chat: boolean;
    chat_avatar_url?: string;
    id: number;
}

export interface ResetPasswordPayload {
    email: string;
    token: string;
    new_password: string;
}
