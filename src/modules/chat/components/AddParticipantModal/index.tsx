import { Box, Button } from "@mui/material";
import Modal from "../../../shared/components/Modal";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Chat } from "../../types";
import { useMutation } from "@tanstack/react-query";
import addParticipantMutation from "../../queries/addParticipantMutation";
import SearchUser from "../../../users/components/SearchUser";
import { User } from "../../../auth/types";

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
            <Box>
                <Box
                    component="form"
                    onSubmit={formik.handleSubmit}
                    noValidate
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        width: "400px",
                    }}
                >
                    <SearchUser
                        onChange={(user) => {
                            console.log("user", user);
                            formik.setFieldValue("participant", user);
                        }}
                        value={formik.values.participant}
                    />
                    <Button
                        onClick={() =>
                            console.log(formik.errors, formik.values)
                        }
                        disabled={!formik.dirty}
                        type="submit"
                        variant="contained"
                    >
                        {!formik.dirty
                            ? t("common.make_changes_to_save")
                            : t("common.submit")}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default AddParticipantModal;
