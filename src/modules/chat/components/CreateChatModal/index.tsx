import { Box } from "@mui/material";
import Modal from "../../../shared/components/Modal";
import CreateChatForm from "../CreateChatForm";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import convertToCreateChatPayload from "../../helpers/convertToCreateChatPayload";
import createChatMutation from "../../queries/createChatMutation";
import { CreateChatFormValues } from "../../types";

interface Props {
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const CreateChatModal = ({ onSuccess, ...props }: Props) => {
    const { t } = useTranslation();

    const { mutate } = useMutation({
        mutationFn: createChatMutation,
        onSuccess,
    });

    const handleCreateChat = async (values: CreateChatFormValues) => {
        mutate(convertToCreateChatPayload(values));
        props.onClose();
    };

    return (
        <Modal {...props} title={t("chat.create_new_chat")}>
            <Box>
                <CreateChatForm onSubmit={handleCreateChat} />
            </Box>
        </Modal>
    );
};

export default CreateChatModal;
