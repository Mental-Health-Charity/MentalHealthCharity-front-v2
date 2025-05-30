import { Box, Button, TextField } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
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
import Loader from "../modules/shared/components/Loader";
import SimpleCard from "../modules/shared/components/SimpleCard";
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
            <SimpleCard
                title={t("admin_screen.chat_list_title")}
                subtitle={t("admin_screen.chat_list_subtitle")}
                sx={{
                    height: "100%",
                }}
            >
                <Box display="flex" flexWrap={{ xs: "wrap", md: "nowrap" }} gap={2} alignItems="center" marginTop={2}>
                    <TextField value={searchQuery} onChange={handleSearch} fullWidth label={t("chat.search_label")} />
                    <Button
                        sx={{
                            textWrap: "nowrap",
                            padding: "10px 30px",
                        }}
                        variant="contained"
                        onClick={() => setShowCreateChatModal(true)}
                    >
                        {t("chat.create_new_chat")}
                    </Button>
                </Box>
            </SimpleCard>

            <div>
                {!chats && <Loader />}
                {/* to force rerender */}
                {chats && (
                    <ChatManager
                        onLoadMore={handleLoadChats}
                        onAddParticipant={(chat) => setSelectedChatToAddParticipant(chat)}
                        onRemoveParticipant={(chat, participant) =>
                            removeParticipant({
                                chat_id: chat.id,
                                participant_id: participant.id,
                            })
                        }
                        data={chats}
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
                )}
            </div>
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
