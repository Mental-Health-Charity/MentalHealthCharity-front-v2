import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { t } from "i18next";
import { AlertCircle, Archive, RotateCcw, Trash2, User as UserIcon } from "lucide-react";
import { useUser } from "../../../auth/components/AuthProvider";
import ActionMenu from "../../../shared/components/ActionMenu";
import { Permissions } from "../../../shared/constants";
import formatDate from "../../../shared/helpers/formatDate";
import usePermissions from "../../../shared/hooks/usePermissions";
import { Message } from "../../types";

interface Props {
    message: Message;
    onDeleteMessage: (id: number) => void;
    onRetryMessage?: (id: number) => void;
    showArchiveChip?: boolean;
    isNew?: boolean;
}

const ChatMessage = ({ message, onDeleteMessage, onRetryMessage, showArchiveChip = false, isNew = false }: Props) => {
    const { user } = useUser();
    const senderIsCurrentUser = user && user.id === message.sender.id;
    const { hasPermissions } = usePermissions();
    const canDeleteMessage = senderIsCurrentUser || hasPermissions(Permissions.DELETE_OTHERS_CHAT_MESSAGES);

    return (
        <div
            className={cn(
                "group flex w-full items-end gap-2.5",
                senderIsCurrentUser ? "flex-row-reverse" : "flex-row",
                isNew && (senderIsCurrentUser ? "animate-msg-in-right" : "animate-msg-in-left")
            )}
        >
            {!senderIsCurrentUser && (
                <Avatar className="ring-background size-8 shrink-0 rounded-full ring-2 md:size-10">
                    <AvatarImage src={message.sender.full_name} alt={message.sender.full_name} />
                    <AvatarFallback className="rounded-full text-sm">
                        <UserIcon className="size-4" />
                    </AvatarFallback>
                </Avatar>
            )}
            <div className={cn("flex max-w-[65%] flex-col gap-0.5", senderIsCurrentUser ? "items-end" : "items-start")}>
                {/* Sender name above bubble */}
                {!senderIsCurrentUser && (
                    <span className="text-muted-foreground px-1 text-[11px] font-semibold">
                        {message.sender.full_name}
                    </span>
                )}

                {/* Message bubble */}
                <div
                    className={cn(
                        "max-w-full overflow-hidden rounded-2xl px-4 py-2.5 shadow-xs",
                        senderIsCurrentUser
                            ? "bg-primary-brand rounded-br-md text-white"
                            : "border-border/30 bg-card text-foreground rounded-bl-md border",
                        message.isPending && "opacity-50",
                        message.isFailed && "border-destructive/50 opacity-70"
                    )}
                >
                    <p className="text-start text-[15px] leading-relaxed [overflow-wrap:anywhere] break-all">
                        {message.content}
                    </p>
                    <div
                        className={cn(
                            "mt-1 flex items-center gap-1.5 text-[11px]",
                            senderIsCurrentUser ? "justify-end text-white/60" : "text-muted-foreground justify-end"
                        )}
                    >
                        <span>{formatDate(message.creation_date, "HH:mm")}</span>
                        {showArchiveChip && (
                            <Badge
                                variant="outline"
                                className={cn(
                                    "ml-1 h-[18px] gap-1 text-[9px]",
                                    senderIsCurrentUser
                                        ? "border-white/40 text-white/60"
                                        : "border-warning-brand text-warning-brand"
                                )}
                            >
                                <Archive className="size-2.5" />
                                {t("chat.archive")}
                            </Badge>
                        )}
                    </div>
                    {message.isPending && (
                        <p
                            className={cn(
                                "mt-0.5 text-start text-[11px]",
                                senderIsCurrentUser ? "text-white/50" : "text-info-brand"
                            )}
                        >
                            {t("chat.sending", { defaultValue: "Wysyłanie..." })}
                        </p>
                    )}
                    {message.isFailed && (
                        <div className="mt-1 flex items-center gap-1.5">
                            <AlertCircle className="size-3 text-red-300" />
                            <span className="text-[11px] text-red-300">
                                {t("chat.send_failed", { defaultValue: "Failed to send" })}
                            </span>
                            {onRetryMessage && (
                                <button
                                    onClick={() => onRetryMessage(message.id)}
                                    className="ml-1 inline-flex cursor-pointer items-center gap-0.5 text-[11px] text-white/80 underline underline-offset-2 hover:text-white"
                                >
                                    <RotateCcw className="size-2.5" />
                                    {t("chat.retry", { defaultValue: "Retry" })}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
            {canDeleteMessage && !message.isPending && !message.isFailed && (
                <div className="invisible shrink-0 group-hover:visible">
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
