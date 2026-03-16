import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import Modal from "../../../shared/components/Modal";
import convertToCreateChatPayload from "../../helpers/convertToCreateChatPayload";
import createChatMutation from "../../queries/createChatMutation";
import { CreateChatFormValues } from "../../types";
import CreateChatForm from "../CreateChatForm";

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
            <CreateChatForm onSubmit={handleCreateChat} />
        </Modal>
    );
};

export default CreateChatModal;
