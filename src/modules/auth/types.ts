import { Roles } from "../users/constants";

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface LoginAccessTokenResponse {
  access_token: string;
  token_type: string;
}

export interface User {
  email: string;
  full_name: string;
  user_role: Roles;
  is_assigned_to_chat: boolean;
  chat_avatar_url?: string;
  id: number;
}
