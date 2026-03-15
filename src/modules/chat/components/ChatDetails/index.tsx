import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User as UserIcon, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import formatDate from "../../../shared/helpers/formatDate";
import { translatedRoles } from "../../../users/constants";
import { Chat } from "../../types";

interface Props {
    chat: Chat;
    onClose: () => void;
}

const ChatDetails = ({ chat, onClose }: Props) => {
    const { t } = useTranslation();

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
                    <h4 className="text-muted-foreground mb-3 text-xs font-semibold tracking-wide uppercase">
                        {t("chat.participants", { defaultValue: "Participants" })} ({chat.participants.length})
                    </h4>
                    <ul className="flex flex-col gap-1">
                        {chat.participants.map((participant) => (
                            <li
                                key={participant.id}
                                className="hover:bg-muted/50 flex items-center gap-3 rounded-lg px-2 py-2 transition-colors"
                            >
                                <Avatar className="ring-background size-9 rounded-full ring-2">
                                    <AvatarImage src={participant.chat_avatar_url} alt={participant.full_name} />
                                    <AvatarFallback className="rounded-full text-xs">
                                        <UserIcon className="size-4" />
                                    </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0">
                                    <p className="text-foreground truncate text-sm font-medium">
                                        {participant.full_name}
                                    </p>
                                    <p className="text-muted-foreground text-xs">
                                        {translatedRoles[participant.user_role]}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ChatDetails;
