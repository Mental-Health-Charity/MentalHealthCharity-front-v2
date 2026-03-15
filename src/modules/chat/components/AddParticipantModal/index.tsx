import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { User } from "../../../auth/types";
import Modal from "../../../shared/components/Modal";
import SearchUser from "../../../users/components/SearchUser";
import addParticipantMutation from "../../queries/addParticipantMutation";
import { Chat } from "../../types";

interface Props {
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    chat: Chat;
}

const AddParticipantModal = ({ chat, onSuccess, ...props }: Props) => {
    const { t } = useTranslation();

    const validationSchema = Yup.object({
        participant: Yup.object().required(t("chat.participant_required")),
        chat_id: Yup.number().required(t("chat.id_required")),
    });

    const { mutate } = useMutation({
        mutationFn: addParticipantMutation,
        onSuccess,
    });

    const formik = useFormik<{
        participant: User | undefined;
        chat_id: number;
    }>({
        initialValues: {
            participant: undefined,
            chat_id: chat.id,
        },
        validationSchema,
        onSubmit: (values) => {
            if (values.participant) {
                mutate({
                    chat_id: values.chat_id,
                    participant_id: values.participant?.id,
                });
                props.onClose();
            }
        },
    });

    return (
        <Modal {...props} title={t("chat.add_participant")}>
            <form onSubmit={formik.handleSubmit} noValidate className="flex w-[400px] flex-col gap-4">
                <SearchUser
                    onChange={(user) => {
                        formik.setFieldValue("participant", user);
                    }}
                    value={formik.values.participant}
                />
                <Button disabled={!formik.dirty} type="submit">
                    {!formik.dirty ? t("common.make_changes_to_save") : t("common.submit")}
                </Button>
            </form>
        </Modal>
    );
};

export default AddParticipantModal;
