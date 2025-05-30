import { ReadyState } from "react-use-websocket";
import i18n from "../../locales/i18n";
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

export const translatedConnectionStatus: Record<ReadyState, string> = {
    [ReadyState.CLOSED]: i18n.t("chat.connection_closed"),
    [ReadyState.CLOSING]: i18n.t("chat.connection_closing"),
    [ReadyState.CONNECTING]: i18n.t("chat.connection_connecting"),
    [ReadyState.OPEN]: i18n.t("chat.connection_open"),
    [ReadyState.UNINSTANTIATED]: i18n.t("chat.connection_uninstantiated"),
};
