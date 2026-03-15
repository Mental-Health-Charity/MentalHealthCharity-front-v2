import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { t } from "i18next";
import { Archive, Circle, Trash2, User as UserIcon } from "lucide-react";
import { useUser } from "../../../auth/components/AuthProvider";
import ActionMenu from "../../../shared/components/ActionMenu";
import { Permissions } from "../../../shared/constants";
import formatDate from "../../../shared/helpers/formatDate";
import usePermissions from "../../../shared/hooks/usePermissions";
import { Message } from "../../types";

interface Props {
    message: Message;
    onDeleteMessage: (id: number) => void;
    showArchiveChip?: boolean;
}

const ChatMessage = ({ message, onDeleteMessage, showArchiveChip = false }: Props) => {
    const { user } = useUser();
    const senderIsCurrentUser = user && user.id === message.sender.id;
    const { hasPermissions } = usePermissions();
    const canDeleteMessage = senderIsCurrentUser || hasPermissions(Permissions.DELETE_OTHERS_CHAT_MESSAGES);

    return (
        <div
            className={`group flex w-full items-center gap-2.5 ${senderIsCurrentUser ? "flex-row-reverse" : "flex-row"}`}
        >
            {!senderIsCurrentUser && (
                <Avatar className="mt-auto size-[30px] rounded-md md:size-[50px]">
                    <AvatarImage src={message.sender.full_name} alt={message.sender.full_name} />
                    <AvatarFallback className="rounded-md text-2xl">
                        <UserIcon className="size-4" />
                    </AvatarFallback>
                </Avatar>
            )}
            <div
                className={`w-full rounded-[10px] px-2.5 py-2.5 shadow-[0_0_10px_rgba(0,0,0,0.05)] md:w-auto md:max-w-[70%] md:px-[30px] md:py-4 ${
                    senderIsCurrentUser ? "bg-secondary/60 text-text-body" : "bg-border-brand/40 text-text-body"
                } ${message.isPending ? "opacity-50" : ""} ${senderIsCurrentUser ? "text-right" : "text-left"}`}
            >
                <div className={senderIsCurrentUser ? "text-primary-brand-dark" : "text-accent-brand"}>
                    <div
                        className={`flex items-center gap-1.5 md:gap-2.5 ${
                            senderIsCurrentUser
                                ? "justify-between md:justify-end"
                                : "justify-between md:flex-row-reverse md:justify-end"
                        }`}
                    >
                        {showArchiveChip && (
                            <Badge
                                variant="outline"
                                className="border-warning-brand text-warning-brand h-[22px] gap-1 text-[11px]"
                            >
                                <Archive className="size-3" />
                                {t("chat.archive")}
                            </Badge>
                        )}
                        <span className="w-full text-sm md:w-auto md:text-base">
                            {formatDate(message.creation_date, "dd/MM/yyyy HH:mm")}
                        </span>
                        <Circle className="mb-0.5 hidden size-2.5 fill-current md:block" />
                        <span className="-mt-0.5 text-sm font-semibold md:text-lg">{message.sender.full_name}</span>
                    </div>
                </div>

                <p className="text-start text-lg break-words">{message.content}</p>
                {message.isPending && <p className="text-info-brand text-start text-sm">Wysyłanie...</p>}
            </div>
            {canDeleteMessage && (
                <div className="invisible group-hover:visible">
                    <ActionMenu
                        actions={[
                            {
                                label: t("common.remove"),
                                id: "delete",
                                disabled: !canDeleteMessage,
                                variant: "default",
                                onClick: () => onDeleteMessage(message.id),
                                icon: <Trash2 className="size-4" />,
                            },
                        ]}
                    />
                </div>
            )}
        </div>
    );
};

export default ChatMessage;
