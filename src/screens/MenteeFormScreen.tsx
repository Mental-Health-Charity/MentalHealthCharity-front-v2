import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import Confetti from "react-confetti";
import bgImg from "../assets/static/admin_panel_bg.svg";
import MenteeForm from "../modules/forms/components/MenteeForm";
import sendFormMutation from "../modules/forms/queries/sendFormMutation";
import { formTypes, MenteeForm as MenteeFormType, MenteeFormValues } from "../modules/forms/types";
import Container from "../modules/shared/components/Container";
import { SessionStorage } from "../modules/shared/types";

const MenteeFormScreen = () => {
    const [showConfetti, setShowConfetti] = useState(false);
    const isFormSend = localStorage.getItem(SessionStorage.SEND_FORM);
    const [step, setStep] = useState(isFormSend ? 5 : 0);

    const { mutate } = useMutation({
        mutationFn: sendFormMutation,

        onSuccess: () => {
            setShowConfetti(true);
            setStep((prev) => prev + 1);
            localStorage.setItem(SessionStorage.SEND_FORM, "true");
        },
    });

    const handleSubmit = (values: MenteeFormValues) => {
        const { password, confirmPassword, ...rest } = values;
        const fields: MenteeFormType = {
            ...rest,
            contacts: rest.contacts.map((contact) => ({
                name: contact,
                value: contact,
            })),
            themes: rest.themes.map((theme) => ({
                name: theme,
                value: theme,
            })),
            phone: rest.phone !== "" ? rest.phone : "0",
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
                    backgroundSize: { xs: "cover", md: "100% auto" },
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    alignItems: "center",
                    backgroundAttachment: "fixed",
                    minHeight: { xs: "100vh", md: "calc(100vh - 100px)" },
                },
            }}
            sx={{
                width: "fit-content",
            }}
        >
            <MenteeForm onSubmit={handleSubmit} step={step} setStep={setStep} />

            {showConfetti && <Confetti recycle={false} width={window.innerWidth} height={window.innerHeight} />}
        </Container>
    );
};

export default MenteeFormScreen;
