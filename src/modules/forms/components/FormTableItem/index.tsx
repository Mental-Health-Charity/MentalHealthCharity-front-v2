import CheckBoxIcon from '@mui/icons-material/CheckBox';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, BoxProps, Button, Step, StepLabel, Stepper, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import useTheme from '../../../../theme';
import UserTableItem from '../../../users/components/UserTableItem';
import acceptFormMutation from '../../queries/acceptFormMutation';
import rejectFormMutation from '../../queries/rejectFormMutation';
import { FormResponse, formTypes, MenteeForm, VolunteerForm } from '../../types';

interface Props extends BoxProps {
    form: FormResponse<MenteeForm | VolunteerForm>;
    refetch?: () => void;
}

const FormTableItem = ({ form, refetch, ...props }: Props) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { mutate: acceptForm } = useMutation({
        mutationFn: acceptFormMutation,
        onSuccess: () => {
            refetch && refetch();
            toast.success(t('common.success'));
        },
    });

    const { mutate: rejectForm } = useMutation({
        mutationFn: rejectFormMutation,
        onSuccess: () => {
            refetch && refetch();
            toast.success(t('common.success'));
        },
    });

    const getFormsSteps = () => {
        if (form.form_type.id === formTypes.MENTEE) {
            return ['Oczekuje na przypisanie do czatu', 'Zaakceptowany'];
        } else {
            return ['Oczekuje na zaakceptowanie', 'Rozmowa kwalifikacyjna i nadanie uprawnień', 'Zaakceptowany'];
        }
    };

    const steps = getFormsSteps();

    const formFieldsRenderer = (fields: MenteeForm | VolunteerForm) => {
        return Object.keys(fields).map((key) => {
            const value = fields[key as keyof (MenteeForm | VolunteerForm)];

            const displayValue =
                Array.isArray(value) && value.every((item) => typeof item === 'object' && 'name' in item)
                    ? value.map((option) => option.name).join(', ')
                    : value;

            return (
                <Box
                    key={key}
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        color: theme.palette.text.secondary,
                        padding: '10px',
                        border: `1px solid ${theme.palette.colors.border}`,
                    }}
                >
                    <Typography
                        sx={{
                            fontWeight: 'bold',
                            fontSize: '20px',
                        }}
                    >
                        {t(`forms_fields.${key}`)}
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: '20px',
                        }}
                    >
                        {(displayValue as string) || '-'}{' '}
                    </Typography>
                </Box>
            );
        });
    };

    return (
        <Box {...props}>
            <Box
                sx={{
                    padding: '10px',
                    backgroundColor: theme.palette.background.paper,
                    border: `2px solid ${theme.palette.colors.border}`,
                    borderRadius: '8px',
                    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.15)',
                }}
            >
                <Box
                    sx={{
                        marginTop: '15px',
                        marginBottom: '20px',
                    }}
                >
                    <Stepper style={{ flexWrap: 'wrap' }} activeStep={form.current_step - 1}>
                        {steps.map((label, index) => (
                            <Step key={index}>
                                <StepLabel>
                                    <Typography
                                        sx={{
                                            color: theme.palette.text.secondary,
                                        }}
                                    >
                                        {label}
                                    </Typography>
                                </StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Box>
                <UserTableItem
                    sx={{
                        padding: '15px',
                    }}
                    user={form.created_by}
                    onEdit={() => navigate(`/admin/users?search=${form.created_by.email}`)}
                />
                <Box
                    sx={{
                        padding: '1px',
                        marginTop: '10px',
                        width: '100%',
                        borderRadius: '8px',
                    }}
                >
                    {formFieldsRenderer(form.fields)}
                </Box>

                {form.current_step < form.form_type.max_step && (
                    <Box
                        sx={{
                            marginTop: '15px',
                            display: 'flex',
                            gap: '10px',
                        }}
                    >
                        <Button
                            sx={{
                                gap: '10px',
                            }}
                            variant="contained"
                            fullWidth
                            onClick={() =>
                                acceptForm({
                                    id: form.id,
                                })
                            }
                        >
                            <CheckBoxIcon />
                            Zaakceptuj
                        </Button>
                        <Button
                            sx={{
                                gap: '10px',
                                borderColor: theme.palette.error.main,
                                color: theme.palette.error.main,
                            }}
                            variant="outlined"
                            fullWidth
                            onClick={() =>
                                rejectForm({
                                    id: form.id,
                                })
                            }
                        >
                            <DeleteIcon />
                            Odrzuć
                        </Button>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default FormTableItem;
