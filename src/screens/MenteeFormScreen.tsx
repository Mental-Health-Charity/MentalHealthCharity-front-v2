import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useUser } from "../modules/auth/components/AuthProvider";
import MenteeForm from "../modules/forms/components/MenteeForm";
import { getCanUserSendFormQueryOptions } from "../modules/forms/queries/getCanUserSendFormQueryOptions";
import sendFormMutation from "../modules/forms/queries/sendFormMutation";
import { formTypes, MenteeForm as MenteeFormType, MenteeFormValues } from "../modules/forms/types";
import Container from "../modules/shared/components/Container";
import Loader from "../modules/shared/components/Loader";

const MenteeFormScreen = () => {
    const { user } = useUser();
    const queryClient = useQueryClient();
    const [showConfetti, setShowConfetti] = useState(false);
    const { data: canSendMenteeForm, isLoading: isFormStatusLoading } = useQuery(
        getCanUserSendFormQueryOptions(
            { form_type_id: formTypes.MENTEE },
            {
                enabled: !!user,
            }
        )
    );
    const [step, setStep] = useState(0);

    useEffect(() => {
        if (canSendMenteeForm?.can_send_form === false) {
            setStep(5);
        }
    }, [canSendMenteeForm?.can_send_form]);

    const { mutate, isPending } = useMutation({
        mutationFn: sendFormMutation,

        onSuccess: () => {
            setShowConfetti(true);
            setStep(5);
            queryClient.invalidateQueries({ queryKey: ["can-user-send-form", { form_type_id: formTypes.MENTEE }] });
        },
    });

    const handleSubmit = (values: MenteeFormValues) => {
        const fields: MenteeFormType = {
            ...values,
            contact_preference: values.contact_preference as MenteeFormType["contact_preference"],
            contacts: values.contacts.map((contact) => ({
                name: contact,
                value: contact,
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
            parentClassName="items-center min-h-[100vh] md:min-h-[calc(100vh-100px)]"
            className="flex items-center justify-center py-10"
        >
            {isFormStatusLoading ? (
                <Loader />
            ) : (
                <MenteeForm isLoading={isPending} onSubmit={handleSubmit} step={step} setStep={setStep} />
            )}

            {showConfetti && <Confetti recycle={false} width={window.innerWidth} height={window.innerHeight} />}
        </Container>
    );
};

export default MenteeFormScreen;
