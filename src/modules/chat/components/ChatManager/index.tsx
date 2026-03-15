import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRightCircle, MessageSquare, Pause, Pencil, Play, Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { CellMeasurer, Index } from "react-virtualized";
import { useIsCompact } from "../../../../hooks/useBreakpoint";
import { User } from "../../../auth/types";
import ActionMenu from "../../../shared/components/ActionMenu";
import WindowListInfiniteLoader from "../../../shared/components/WindowListInfiniteLoader";
import { CachedListRowProps } from "../../../shared/components/WindowListVirtualizer";
import formatDate from "../../../shared/helpers/formatDate";
import { Pagination } from "../../../shared/types";
import UserTableItem from "../../../users/components/UserTableItem";
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
    const isMobile = useIsCompact();

    const navigate = useNavigate();
    const userHeight = isMobile ? 110 : 70;
    const padding = isMobile ? 200 : 150;

    const getRowHeight = ({ index }: Index) => {
        const chat = data && data.items[index];
        return chat ? chat.participants.length * userHeight + padding : 0;
    };

    const onRender = ({ index, key, style, cache, parent }: CachedListRowProps) => {
        const chat = data && data.items[index];
        if (!chat) return null;

        return (
            <CellMeasurer cache={cache} parent={parent} columnIndex={0} rowIndex={index} key={key}>
                <div
                    key={key}
                    style={{
                        ...style,
                        padding: "10px 0",
                    }}
                >
                    <div
                        className="border-border-brand bg-paper text-text-body flex flex-col items-start rounded-lg border-2 p-4"
                        style={{ maxHeight: getRowHeight({ index }) - 10 }}
                    >
                        <div className="flex w-full flex-wrap items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="bg-border-brand flex items-center justify-center rounded p-3.5">
                                        <MessageSquare className="text-bg-brand size-5" />
                                    </div>
                                    <h3 className="text-xl font-semibold">{chat.name}</h3>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="bg-info-brand/20 text-text-body">
                                    {formatDate(chat.creation_date)}
                                </Badge>
                                {chat.is_supervisor_chat && <Badge variant="destructive">{t("chat.admin_chat")}</Badge>}
                                <Badge
                                    variant={chat.is_active ? "default" : "destructive"}
                                    className={chat.is_active ? "bg-success-brand/20 text-text-body" : ""}
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
                        <div className="before:bg-border-brand relative mt-5 flex w-full flex-col items-start gap-4 before:absolute before:left-0 before:block before:min-h-[calc(100%-81px)] before:w-[5px]">
                            {chat.participants.length > 0 &&
                                chat.participants.map((participant) => (
                                    <UserTableItem
                                        key={participant.id}
                                        additionalActions={[
                                            {
                                                id: "remove",
                                                label: t("chat.remove_from_chat"),
                                                variant: "divider",
                                                onClick: () => onRemoveParticipant(chat, participant),
                                                icon: <Trash2 className="text-destructive size-4" />,
                                            },
                                        ]}
                                        user={participant}
                                        className="after:bg-border-brand relative w-full border-none pl-9 after:absolute after:left-0 after:block after:h-1 after:w-[25px]"
                                        onEdit={() => navigate(`/admin/users?search=${participant.email}`)}
                                    />
                                ))}
                            <Button variant="ghost" onClick={() => onAddParticipant(chat)}>
                                <Plus className="mr-1 size-4" /> {t("chat.add_participant")}
                            </Button>
                        </div>
                    </div>
                </div>
            </CellMeasurer>
        );
    };

    return (
        <div className="min-h-screen">
            <WindowListInfiniteLoader data={data} onLoadMore={onLoadMore} onRender={onRender} />
        </div>
    );
};

export default ChatManager;
