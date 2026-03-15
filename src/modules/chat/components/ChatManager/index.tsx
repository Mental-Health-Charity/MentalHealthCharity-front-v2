import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
    ArrowRightCircle,
    Copy,
    MessageSquare,
    Pause,
    Pencil,
    Play,
    Plus,
    Trash2,
    User as UserIcon,
    Users,
} from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { User } from "../../../auth/types";
import ActionMenu from "../../../shared/components/ActionMenu";
import formatDate from "../../../shared/helpers/formatDate";
import { Pagination } from "../../../shared/types";
import { translatedRoles } from "../../../users/constants";
import { Chat } from "../../types";

interface Props {
    data?: Pagination<Chat>;
    onEditChat: (chat: Chat) => void;
    onRemoveChat: (chat: Chat) => void;
    onToggleChat: (chat: Chat) => void;
    onAddParticipant: (chat: Chat) => void;
    onRemoveParticipant: (chat: Chat, participant: User) => void;
    onLoadMore: () => void;
}

const ChatManager = ({
    data,
    onEditChat,
    onRemoveChat,
    onToggleChat,
    onAddParticipant,
    onRemoveParticipant,
    onLoadMore,
}: Props) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const sentinelRef = useRef<HTMLDivElement>(null);

    const handleCopy = useCallback(
        (text: string) => {
            navigator.clipboard.writeText(text);
            toast.success(t("common.copied_to_clipboard"));
        },
        [t]
    );

    // Infinite scroll via IntersectionObserver
    useEffect(() => {
        if (!data || !sentinelRef.current) return;
        if (data.items.length >= data.total) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) onLoadMore();
            },
            { rootMargin: "200px" }
        );
        observer.observe(sentinelRef.current);
        return () => observer.disconnect();
    }, [data, onLoadMore]);

    if (!data) {
        return (
            <div className="flex flex-col gap-4 py-6">
                {Array.from({ length: 4 }, (_, i) => (
                    <div key={i} className="bg-card border-border/50 rounded-xl border p-5">
                        <div className="flex items-center gap-4">
                            <Skeleton className="size-10 rounded-lg" />
                            <Skeleton className="h-5 w-48" />
                            <div className="ml-auto flex gap-2">
                                <Skeleton className="h-6 w-20 rounded-full" />
                                <Skeleton className="h-6 w-16 rounded-full" />
                            </div>
                        </div>
                        <div className="mt-4 flex flex-col gap-3 pl-4">
                            <Skeleton className="h-12 w-full rounded-lg" />
                            <Skeleton className="h-12 w-full rounded-lg" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (data.items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="bg-muted/50 mb-4 flex size-16 items-center justify-center rounded-full">
                    <MessageSquare className="text-muted-foreground size-7" />
                </div>
                <p className="text-muted-foreground text-lg font-medium">
                    {t("chat.no_chats_found", { defaultValue: "No chats found" })}
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 py-6">
            {/* Chat count summary */}
            <div className="text-muted-foreground flex items-center gap-2 px-1 text-sm">
                <Users className="size-4" />
                <span>
                    {t("chat.total_chats", {
                        defaultValue: "{{count}} chats",
                        count: data.total,
                    })}
                </span>
            </div>

            {data.items.map((chat) => (
                <div
                    key={chat.id}
                    className="bg-card border-border/50 overflow-hidden rounded-xl border shadow-sm transition-shadow hover:shadow-md"
                >
                    {/* Chat header */}
                    <div className="flex flex-wrap items-center gap-3 p-5">
                        <div className="bg-primary-brand/10 flex size-11 shrink-0 items-center justify-center rounded-lg">
                            <MessageSquare className="text-primary-brand size-5" />
                        </div>

                        <div className="min-w-0 flex-1">
                            <h3 className="text-foreground truncate text-lg font-semibold">{chat.name}</h3>
                            <p className="text-muted-foreground text-xs">
                                {t("common.created_at", { date: formatDate(chat.creation_date) })}
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            {chat.is_supervisor_chat && (
                                <Badge
                                    variant="secondary"
                                    className="bg-amber-500/15 text-amber-700 dark:text-amber-400"
                                >
                                    {t("chat.admin_chat")}
                                </Badge>
                            )}
                            <Badge
                                variant={chat.is_active ? "secondary" : "destructive"}
                                className={
                                    chat.is_active ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400" : ""
                                }
                            >
                                {chat.is_active ? t("common.active") : t("common.inactive")}
                            </Badge>

                            <ActionMenu
                                actions={[
                                    {
                                        id: "edit",
                                        label: t("common.edit"),
                                        onClick: () => onEditChat(chat),
                                        icon: <Pencil className="size-4" />,
                                    },
                                    {
                                        id: "go_to_chat",
                                        label: t("chat.go_to_chat"),
                                        href: `/chat/${chat.id}`,
                                        icon: <ArrowRightCircle className="size-4" />,
                                    },
                                    {
                                        id: "disable",
                                        variant: "divider",
                                        label: chat.is_active ? t("common.disable") : t("common.enable"),
                                        onClick: () => onToggleChat(chat),
                                        icon: chat.is_active ? (
                                            <Pause className="text-warning-brand size-4" />
                                        ) : (
                                            <Play className="text-success-brand size-4" />
                                        ),
                                    },
                                    {
                                        id: "remove",
                                        variant: "divider",
                                        label: t("common.remove"),
                                        onClick: () => onRemoveChat(chat),
                                        icon: <Trash2 className="text-destructive size-4" />,
                                    },
                                ]}
                            />
                        </div>
                    </div>

                    {/* Participants */}
                    {chat.participants.length > 0 && (
                        <>
                            <Separator />
                            <div className="px-5 py-4">
                                <p className="text-muted-foreground mb-3 flex items-center gap-1.5 text-xs font-medium tracking-wider uppercase">
                                    <Users className="size-3.5" />
                                    {t("chat.participants", { defaultValue: "Participants" })} (
                                    {chat.participants.length})
                                </p>
                                <div className="flex flex-col gap-2">
                                    {chat.participants.map((participant) => (
                                        <div
                                            key={participant.id}
                                            className="hover:bg-muted/50 flex flex-wrap items-center gap-3 rounded-lg p-2.5 transition-colors"
                                        >
                                            <Avatar className="size-9 rounded-lg">
                                                <AvatarImage
                                                    src={participant.chat_avatar_url || undefined}
                                                    alt={participant.full_name}
                                                />
                                                <AvatarFallback className="rounded-lg text-xs">
                                                    {participant.full_name?.charAt(0)?.toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-foreground truncate text-sm font-medium">
                                                    {participant.full_name}
                                                </p>
                                                <button
                                                    onClick={() => handleCopy(participant.email)}
                                                    className="text-muted-foreground flex items-center gap-1 border-none bg-transparent p-0 text-xs hover:underline"
                                                >
                                                    {participant.email}
                                                    <Copy className="size-3" />
                                                </button>
                                            </div>
                                            <Badge variant="outline" className="text-xs">
                                                {translatedRoles[participant.user_role]}
                                            </Badge>
                                            <ActionMenu
                                                actions={[
                                                    {
                                                        id: "go_to_profile",
                                                        label: t("common.go_to_profile"),
                                                        href: `/profile/${participant.id}`,
                                                        icon: <UserIcon className="size-4" />,
                                                    },
                                                    {
                                                        id: "edit_user",
                                                        label: t("common.edit"),
                                                        onClick: () =>
                                                            navigate(`/admin/users?search=${participant.email}`),
                                                        icon: <Pencil className="size-4" />,
                                                    },
                                                    {
                                                        id: "remove",
                                                        label: t("chat.remove_from_chat"),
                                                        variant: "divider",
                                                        onClick: () => onRemoveParticipant(chat, participant),
                                                        icon: <Trash2 className="text-destructive size-4" />,
                                                    },
                                                ]}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Footer actions */}
                    <div className="bg-muted/30 border-border/30 flex items-center gap-3 border-t px-5 py-3">
                        <Button variant="ghost" size="sm" onClick={() => onAddParticipant(chat)} className="text-xs">
                            <Plus className="mr-1 size-3.5" />
                            {t("chat.add_participant")}
                        </Button>
                        <Link
                            to={`/chat/${chat.id}`}
                            className="text-primary-brand ml-auto flex items-center gap-1.5 text-xs font-medium no-underline transition-opacity hover:opacity-80"
                        >
                            {t("chat.go_to_chat")}
                            <ArrowRightCircle className="size-3.5" />
                        </Link>
                    </div>
                </div>
            ))}

            {/* Infinite scroll sentinel */}
            {data.items.length < data.total && (
                <div ref={sentinelRef} className="flex justify-center py-6">
                    <Skeleton className="h-8 w-32 rounded-full" />
                </div>
            )}
        </div>
    );
};

export default ChatManager;
