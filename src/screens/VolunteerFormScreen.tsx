import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import Confetti from 'react-confetti';
import bgImg from '../assets/static/line_bg.webp';
import VolunteerForm from '../modules/forms/components/VolunteerForm';
import sendFormMutation from '../modules/forms/queries/sendFormMutation';
import { formTypes, VolunteerForm as VolunteerFormType, VolunteerFormValues } from '../modules/forms/types';
import Container from '../modules/shared/components/Container';
import { SessionStorage } from '../modules/shared/types';

const VolunteerFormScreen = () => {
    const [showConfetti, setShowConfetti] = useState(false);
    const isFormSend = localStorage.getItem(SessionStorage.SEND_FORM);

    const { mutate } = useMutation({
        mutationFn: sendFormMutation,

        onSuccess: () => {
            setShowConfetti(true);
            localStorage.setItem(SessionStorage.SEND_FORM, 'true');
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
            parentProps={{
                sx: {
                    backgroundImage: `url(${bgImg})`,
                    backgroundSize: '100% auto',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    alignItems: 'center',

                    backgroundAttachment: 'fixed',
                },
            }}
            sx={{
                width: 'fit-content',
            }}
        >
            <VolunteerForm initStep={isFormSend ? 6 : 0} onSubmit={handleSubmit} />

            {showConfetti && <Confetti recycle={false} width={window.innerWidth} height={window.innerHeight} />}
        </Container>
    );
};

export default VolunteerFormScreen;
