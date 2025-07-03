import { Box, Button, Typography } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { t } from "i18next";
import { useEffect, useLayoutEffect, useState } from "react";
import toast from "react-hot-toast";
import Loader from "../../../shared/components/Loader";
import Markdown from "../../../shared/components/Markdown";
import Modal from "../../../shared/components/Modal";
import { Permissions } from "../../../shared/constants";
import useDebounce from "../../../shared/hooks/useDebounce";
import usePermissions from "../../../shared/hooks/usePermissions";
import { confirmContractForChatMutation } from "../../queries/confirmContractForChat";
import { editContractForChatMutation } from "../../queries/editContractForChat";
import { getContractForChat } from "../../queries/getContractForChat";
interface Props {
    onClose: () => void;
    isOpen: boolean;
    chatId: string;
}

const ContractModal = ({ isOpen, onClose, chatId }: Props) => {
    const [modalContent, setModalContent] = useState("");
    const { data, isLoading, refetch } = useQuery(getContractForChat({ id: chatId }));
    const { hasPermissions } = usePermissions();
    const debouncedModalContent = useDebounce(modalContent, 1000);

    useLayoutEffect(() => {
        if (data) {
            setModalContent(data.content);
        }
    }, [data, chatId]);

    const handleModalContentChange = (content: string) => {
        setModalContent(content);
    };

    useEffect(() => {
        if (debouncedModalContent && data && !data.is_confirmed && debouncedModalContent !== data.content) {
            editContractForChat({ id: chatId, body: modalContent });
        }
    }, [debouncedModalContent, data]);

    const { mutate: editContractForChat } = useMutation({
        mutationFn: editContractForChatMutation,
        onSuccess: () => {
            toast.success(t("common.saved"));

            refetch();
        },
    });

    const { mutate } = useMutation({
        mutationFn: confirmContractForChatMutation,
        onSuccess: () => {
            toast.success(t("chat.contract_confirmed"));
            refetch();
        },
    });

    const handleConfirmContract = async () => {
        mutate({
            id: chatId,
            body: {
                is_confirmed: true,
            },
        });
    };

    if (isLoading || !data) {
        return <Loader />;
    }

    return (
        <Modal title="Kontrakt" onClose={onClose} open={isOpen}>
            <Box sx={{ width: "800px" }}>
                <Markdown
                    onChange={handleModalContentChange}
                    content={modalContent}
                    className="markdown-editor"
                    readOnly={data.is_confirmed}
                />
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "20px",
                        justifyContent: "space-between",
                    }}
                >
                    {hasPermissions(Permissions.CAN_CONFIRM_CONTRACT) && (
                        <Button variant="contained" onClick={handleConfirmContract} disabled={data.is_confirmed}>
                            {t("chat.accept_contract")}
                        </Button>
                    )}
                    {data.is_confirmed && <Typography color="success">{t("chat.contract_confirmed_desc")}</Typography>}
                </Box>
            </Box>
        </Modal>
    );
};

export default ContractModal;
