import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import Confetti from "react-confetti";
import VolunteerForm from "../modules/forms/components/VolunteerForm";
import sendFormMutation from "../modules/forms/queries/sendFormMutation";
import { formTypes, VolunteerForm as VolunteerFormType, VolunteerFormValues } from "../modules/forms/types";
import Container from "../modules/shared/components/Container";
import { SessionStorage } from "../modules/shared/types";

const VolunteerFormScreen = () => {
    const [showConfetti, setShowConfetti] = useState(false);
    const isFormSend = localStorage.getItem(SessionStorage.SEND_FORM);

    const { mutate } = useMutation({
        mutationFn: sendFormMutation,

        onSuccess: () => {
            setShowConfetti(true);
            localStorage.setItem(SessionStorage.SEND_FORM, "true");
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
            <VolunteerForm initStep={isFormSend ? 7 : 0} onSubmit={handleSubmit} />

            {showConfetti && <Confetti recycle={false} width={window.innerWidth} height={window.innerHeight} />}
        </Container>
    );
};

export default VolunteerFormScreen;
