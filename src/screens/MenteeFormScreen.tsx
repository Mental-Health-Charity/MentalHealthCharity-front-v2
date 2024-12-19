import MenteeForm from "../modules/forms/components/MenteeForm";
import Container from "../modules/shared/components/Container";
import bgImg from "../assets/static/line_bg.webp";
import Confetti from "react-confetti";
import { useState } from "react";
import {
    formTypes,
    MenteeForm as MenteeFormType,
    MenteeFormValues,
} from "../modules/forms/types";
import { useMutation } from "@tanstack/react-query";
import sendFormMutation from "../modules/forms/queries/sendFormMutation";

const MenteeFormScreen = () => {
    const [showConfetti, setShowConfetti] = useState(false);
    const { mutate } = useMutation({
        mutationFn: sendFormMutation,

        onSuccess: () => {
            setShowConfetti(true);
        },
    });

    const handleSubmit = (values: MenteeFormValues) => {
        const fields: MenteeFormType = {
            ...values,
            contacts: values.contacts.map((contact) => ({
                name: contact,
                value: contact,
            })),
            themes: values.themes.map((theme) => ({
                name: theme,
                value: theme,
            })),
            phone: values.phone !== "" ? values.phone : "0",
        };

        mutate({
            fields,
            form_type_id: formTypes.MENTEE,
        });
    };

    return (
        <Container
            parentProps={{
                sx: {
                    backgroundImage: `url(${bgImg})`,
                    backgroundSize: "100% auto",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    alignItems: "center",

                    backgroundAttachment: "fixed",
                },
            }}
            sx={{
                width: "fit-content",
            }}
        >
            <MenteeForm onSubmit={handleSubmit} />

            {showConfetti && (
                <Confetti
                    recycle={false}
                    width={window.innerWidth}
                    height={window.innerHeight}
                />
            )}
        </Container>
    );
};

export default MenteeFormScreen;
