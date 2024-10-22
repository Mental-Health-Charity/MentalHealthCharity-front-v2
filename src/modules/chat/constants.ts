import { User } from "../auth/types";
import { Roles } from "../users/constants";

export const UnknownUser: User = {
  email: "unknown",
  id: 999999,
  full_name: "ERROR",
  is_assigned_to_chat: false,
  user_role: Roles.USER,
  chat_avatar_url: "",
};
