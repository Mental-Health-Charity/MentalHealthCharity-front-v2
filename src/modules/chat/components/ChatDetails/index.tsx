import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { Loader2, LockKeyhole, Trash2, UserPlus, User as UserIcon, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import formatDate from "../../../shared/helpers/formatDate";
import { translatedRoles } from "../../../users/constants";
import removeParticipantMutation from "../../queries/removeParticipantMutation";
import { Chat } from "../../types";

interface Props {
    chat: Chat;
    onClose: () => void;
    onAddParticipant?: () => void;
    canManageParticipants?: boolean;
    onParticipantRemoved?: () => void;
    onCloseChat?: () => void;
}

const ChatDetails = ({
    chat,
    onClose,
    onAddParticipant,
    canManageParticipants,
    onParticipantRemoved,
    onCloseChat,
}: Props) => {
    const { t } = useTranslation();
    const [confirmingId, setConfirmingId] = useState<number | null>(null);

    const { mutate: removeParticipant, isPending: isRemoving } = useMutation({
        mutationFn: removeParticipantMutation,
        onSuccess: () => {
            toast.success(t("chat.remove_participant_success"));
            setConfirmingId(null);
            onParticipantRemoved?.();
        },
    });

    return (
        <div className="border-border/50 bg-card hidden w-[320px] shrink-0 flex-col border-l lg:flex">
            {/* Header */}
            <div className="border-border/50 flex h-16 items-center justify-between border-b px-4">
                <h3 className="text-foreground text-sm font-semibold">
                    {t("chat.show_details", { defaultValue: "Details" })}
                </h3>
                <button
                    onClick={onClose}
                    className="text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg p-1.5 transition-colors"
                    aria-label={t("common.close", { defaultValue: "Close" })}
                >
                    <X className="size-5" />
                </button>
            </div>

            {/* Chat info */}
            <div className="flex-1 overflow-y-auto p-4">
                <div className="mb-6 flex flex-col items-center text-center">
                    <div className="bg-primary-brand/15 text-primary-brand mb-3 flex size-16 items-center justify-center rounded-full text-xl font-bold">
                        {chat.name.charAt(0).toUpperCase()}
                    </div>
                    <h4 className="text-foreground text-base font-semibold">{chat.name}</h4>
                    <p className="text-muted-foreground mt-1 text-xs">
                        {t("common.created_at", { date: formatDate(chat.creation_date) })}
                    </p>
                </div>

                {/* Participants */}
                <div>
                    <div className="mb-3 flex items-center justify-between">
                        <h4 className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                            {t("chat.participants", { defaultValue: "Participants" })} ({chat.participants.length})
                        </h4>
                        {onAddParticipant && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onAddParticipant}
                                className="text-primary-brand hover:text-primary-brand h-auto gap-1 px-2 py-1 text-xs"
                            >
                                <UserPlus className="size-3.5" />
                                {t("chat.add_participant")}
                            </Button>
                        )}
                    </div>
                    <ul className="flex flex-col gap-1">
                        {chat.participants.map((participant) => (
                            <li
                                key={participant.id}
                                className="group hover:bg-muted/50 flex items-center gap-3 rounded-lg px-2 py-2 transition-colors"
                            >
                                <Avatar className="ring-background size-9 shrink-0 rounded-full ring-2">
                                    <AvatarImage src={participant.chat_avatar_url} alt={participant.full_name} />
                                    <AvatarFallback className="rounded-full text-xs">
                                        <UserIcon className="size-4" />
                                    </AvatarFallback>
                                </Avatar>
                                {confirmingId === participant.id ? (
                                    <div className="flex min-w-0 flex-1 items-center gap-2">
                                        <span className="text-muted-foreground truncate text-xs">
                                            {t("chat.remove_from_chat")}?
                                        </span>
                                        <div className="flex shrink-0 gap-1">
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                className="h-6 px-2 text-xs"
                                                disabled={isRemoving}
                                                onClick={() =>
                                                    removeParticipant({
                                                        chat_id: chat.id,
                                                        participant_id: participant.id,
                                                    })
                                                }
                                            >
                                                {isRemoving ? (
                                                    <Loader2 className="size-3 animate-spin" />
                                                ) : (
                                                    t("common.confirm", { defaultValue: "Tak" })
                                                )}
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-6 px-2 text-xs"
                                                onClick={() => setConfirmingId(null)}
                                            >
                                                {t("common.cancel", { defaultValue: "Nie" })}
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-foreground truncate text-sm font-medium">
                                                {participant.full_name}
                                            </p>
                                            <p className="text-muted-foreground text-xs">
                                                {translatedRoles[participant.user_role]}
                                            </p>
                                        </div>
                                        {canManageParticipants && (
                                            <button
                                                onClick={() => setConfirmingId(participant.id)}
                                                className="text-muted-foreground hover:text-destructive shrink-0 rounded-md p-1 opacity-0 transition-all group-hover:opacity-100"
                                                aria-label={t("chat.remove_from_chat")}
                                            >
                                                <Trash2 className="size-3.5" />
                                            </button>
                                        )}
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Close chat */}
                {onCloseChat && chat.is_active && (
                    <div className="border-border/50 mt-6 border-t pt-4">
                        <Button
                            variant="ghost"
                            onClick={onCloseChat}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10 w-full justify-start gap-2"
                        >
                            <LockKeyhole className="size-4" />
                            {t("chat.close_chat")}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatDetails;
