import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Confetti from "react-confetti";
import { useUser } from "../modules/auth/components/AuthProvider";
import VolunteerForm from "../modules/forms/components/VolunteerForm";
import { getCanUserSendFormQueryOptions } from "../modules/forms/queries/getCanUserSendFormQueryOptions";
import sendFormMutation from "../modules/forms/queries/sendFormMutation";
import { formTypes, VolunteerForm as VolunteerFormType, VolunteerFormValues } from "../modules/forms/types";
import Container from "../modules/shared/components/Container";
import Loader from "../modules/shared/components/Loader";

const VolunteerFormScreen = () => {
    const { user } = useUser();
    const queryClient = useQueryClient();
    const [showConfetti, setShowConfetti] = useState(false);
    const { data: canSendVolunteerForm, isLoading: isFormStatusLoading } = useQuery(
        getCanUserSendFormQueryOptions(
            { form_type_id: formTypes.VOLUNTEER },
            {
                enabled: !!user,
            }
        )
    );
    const hasSubmittedVolunteerForm = canSendVolunteerForm?.can_send_form === false;

    const { mutate } = useMutation({
        mutationFn: sendFormMutation,

        onSuccess: () => {
            setShowConfetti(true);
            queryClient.invalidateQueries({ queryKey: ["can-user-send-form", { form_type_id: formTypes.VOLUNTEER }] });
        },
    });

    const handleSubmit = (values: VolunteerFormValues) => {
        const fields: VolunteerFormType = {
            ...values,
            contacts: values.contacts.map((contact) => ({
                name: contact,
                value: contact,
            })),
            themes: values.themes.map((theme) => ({
                name: theme,
                value: theme,
            })),
        };

        mutate({
            fields,
            form_type_id: formTypes.VOLUNTEER,
        });
    };

    return (
        <Container
            parentClassName="items-center min-h-[100vh] md:min-h-[calc(100vh-100px)]"
            className="flex items-center justify-center py-10"
        >
            {isFormStatusLoading ? (
                <Loader />
            ) : (
                <VolunteerForm
                    key={hasSubmittedVolunteerForm ? "submitted-volunteer-form" : "editable-volunteer-form"}
                    initStep={hasSubmittedVolunteerForm ? 7 : 0}
                    onSubmit={handleSubmit}
                />
            )}

            {showConfetti && <Confetti recycle={false} width={window.innerWidth} height={window.innerHeight} />}
        </Container>
    );
};

export default VolunteerFormScreen;
