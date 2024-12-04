import { useMutation, useQuery } from "@tanstack/react-query";
import ChatManager from "../modules/chat/components/ChatManager";
import { getChatsQueryOptions } from "../modules/chat/queries/getChatsQueryOptions";
import AdminLayout from "../modules/shared/components/AdminLayout";
import Loader from "../modules/shared/components/Loader";
import SimpleCard from "../modules/shared/components/SimpleCard";
import { useTranslation } from "react-i18next";
import { Box, Button, TextField } from "@mui/material";
import { ChangeEvent, useState } from "react";
import useDebounce from "../modules/shared/hooks/useDebounce";
import { useSearchParams } from "react-router-dom";
import CreateChatModal from "../modules/chat/components/CreateChatModal";
import toast from "react-hot-toast";
import deleteChatMutation from "../modules/chat/queries/deleteChatMutation";
import editChatMutation from "../modules/chat/queries/editChatMutation";
import EditChatModal from "../modules/chat/components/EditChatModal";
import { Chat } from "../modules/chat/types";
import AddParticipantModal from "../modules/chat/components/AddParticipantModal";
import removeParticipantMutation from "../modules/chat/queries/removeParticipantMutation";

const ManageChatsScreen = () => {
    const { t } = useTranslation();
    const [params, setParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(params.get("search") || "");
    const debouncedQuery = useDebounce(searchQuery, 500);
    const [showCreateChatModal, setShowCreateChatModal] = useState(false);
    const [selectedChatToEdit, setSelectedChatToEdit] = useState<Chat | null>(
        null
    );
    const [selectedChatToAddParticipant, setSelectedChatToAddParticipant] =
        useState<Chat | null>(null);

    const { mutate: deleteChat } = useMutation({
        mutationFn: deleteChatMutation,
        onSuccess: () => {
            refetch();
            toast.success(t("chat.delete_chat_success"));
        },
    });

    const { mutate: editChat } = useMutation({
        mutationFn: editChatMutation,

        onSuccess: () => {
            toast.success(t("chat.edit_chat_success"));
            refetch();
            setSelectedChatToEdit(null);
        },
    });

    const { mutate: removeParticipant } = useMutation({
        mutationFn: removeParticipantMutation,
        onSuccess: () => {
            refetch();
            toast.success(t("chat.remove_participant_success"));
        },
    });

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;

        setParams({ search: query });
        setSearchQuery(query);
    };

    const { data, isLoading, refetch, isRefetching } = useQuery(
        getChatsQueryOptions({ size: 50, page: 1, search: debouncedQuery })
    );

    return (
        <AdminLayout>
            <SimpleCard
                title={t("admin_screen.chat_list_title")}
                subtitle={t("admin_screen.chat_list_subtitle")}
                style={{
                    height: "100%",
                }}
            >
                <Box display="flex" gap={2} alignItems="center" marginTop={2}>
                    <TextField
                        value={searchQuery}
                        onChange={handleSearch}
                        fullWidth
                        label={t("chat.search_label")}
                    />
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
                {isLoading && <Loader />}
                {/* to force rerender */}
                {!isRefetching && (
                    <ChatManager
                        onAddParticipant={(chat) =>
                            setSelectedChatToAddParticipant(chat)
                        }
                        onRemoveParticipant={(chat, participant) =>
                            removeParticipant({
                                chat_id: chat.id,
                                participant_id: participant.id,
                            })
                        }
                        data={data}
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
                    refetch();
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
                        refetch();
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
