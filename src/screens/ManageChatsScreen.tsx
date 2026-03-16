import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { MessageSquare, Plus, Search } from "lucide-react";
import { ChangeEvent, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import AddParticipantModal from "../modules/chat/components/AddParticipantModal";
import ChatManager from "../modules/chat/components/ChatManager";
import CreateChatModal from "../modules/chat/components/CreateChatModal";
import EditChatModal from "../modules/chat/components/EditChatModal";
import useChatList from "../modules/chat/hooks/useChatList";
import deleteChatMutation from "../modules/chat/queries/deleteChatMutation";
import editChatMutation from "../modules/chat/queries/editChatMutation";
import removeParticipantMutation from "../modules/chat/queries/removeParticipantMutation";
import { Chat } from "../modules/chat/types";
import AdminLayout from "../modules/shared/components/AdminLayout";
import useDebounce from "../modules/shared/hooks/useDebounce";

const ManageChatsScreen = () => {
    const { t } = useTranslation();
    const [params, setParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(params.get("search") || "");
    const debouncedQuery = useDebounce(searchQuery, 500);
    const [showCreateChatModal, setShowCreateChatModal] = useState(false);
    const [selectedChatToEdit, setSelectedChatToEdit] = useState<Chat | null>(null);
    const [selectedChatToAddParticipant, setSelectedChatToAddParticipant] = useState<Chat | null>(null);
    const { chats, handleLoadChats, handleRefetch } = useChatList(debouncedQuery);

    const { mutate: deleteChat } = useMutation({
        mutationFn: deleteChatMutation,
        onSuccess: () => {
            handleRefetch();
            toast.success(t("chat.delete_chat_success"));
        },
    });

    const { mutate: editChat } = useMutation({
        mutationFn: editChatMutation,
        onSuccess: () => {
            toast.success(t("chat.edit_chat_success"));
            handleRefetch();
            setSelectedChatToEdit(null);
        },
    });

    const { mutate: removeParticipant } = useMutation({
        mutationFn: removeParticipantMutation,
        onSuccess: () => {
            handleRefetch();
            toast.success(t("chat.remove_participant_success"));
        },
    });

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setParams({ search: query });
        setSearchQuery(query);
    };

    return (
        <AdminLayout>
            {/* Header card */}
            <div className="bg-card border-border/50 rounded-xl border p-6 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary-brand/10 flex size-11 items-center justify-center rounded-lg">
                            <MessageSquare className="text-primary-brand size-5" />
                        </div>
                        <div>
                            <h1 className="text-foreground text-xl font-bold">{t("admin_screen.chat_list_title")}</h1>
                            <p className="text-muted-foreground text-sm">
                                {t("admin_screen.chat_list_subtitle")}
                                {chats && (
                                    <Badge variant="outline" className="ml-2 align-middle text-xs">
                                        {chats.total}
                                    </Badge>
                                )}
                            </p>
                        </div>
                    </div>
                    <Button onClick={() => setShowCreateChatModal(true)} className="shrink-0">
                        <Plus className="mr-1.5 size-4" />
                        {t("chat.create_new_chat")}
                    </Button>
                </div>

                {/* Search bar */}
                <div className="relative mt-5">
                    <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                    <Input
                        value={searchQuery}
                        onChange={handleSearch}
                        className="pl-9"
                        placeholder={t("chat.search_label")}
                    />
                </div>
            </div>

            {/* Chat list */}
            <ChatManager
                onLoadMore={handleLoadChats}
                onAddParticipant={(chat) => setSelectedChatToAddParticipant(chat)}
                onRemoveParticipant={(chat, participant) =>
                    removeParticipant({
                        chat_id: chat.id,
                        participant_id: participant.id,
                    })
                }
                data={chats ?? undefined}
                onToggleChat={(chat) =>
                    editChat({
                        id: chat.id,
                        is_active: !chat.is_active,
                        name: chat.name,
                    })
                }
                onRemoveChat={({ id }) => deleteChat(id)}
                onEditChat={(chat) => setSelectedChatToEdit(chat)}
            />

            <CreateChatModal
                onClose={() => setShowCreateChatModal(false)}
                open={showCreateChatModal}
                onSuccess={() => {
                    setShowCreateChatModal(false);
                    handleRefetch();
                    toast.success(t("chat.create_chat_success"));
                }}
            />
            {selectedChatToEdit && (
                <EditChatModal
                    chat={selectedChatToEdit}
                    open={!!selectedChatToEdit}
                    onSubmit={editChat}
                    onClose={() => setSelectedChatToEdit(null)}
                />
            )}
            {selectedChatToAddParticipant && (
                <AddParticipantModal
                    onSuccess={() => {
                        handleRefetch();
                        toast.success(t("chat.add_participant_success"));
                    }}
                    chat={selectedChatToAddParticipant}
                    open={!!selectedChatToAddParticipant}
                    onClose={() => setSelectedChatToAddParticipant(null)}
                />
            )}
        </AdminLayout>
    );
};

export default ManageChatsScreen;
