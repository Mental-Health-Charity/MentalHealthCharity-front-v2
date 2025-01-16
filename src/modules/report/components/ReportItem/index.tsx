import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import ErrorIcon from '@mui/icons-material/Error';
import { Box, Button, Card, CardContent, Chip, Typography, useTheme } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import Modal from '../../../shared/components/Modal';
import formatDate from '../../../shared/helpers/formatDate';
import { ReportTranslationKeys } from '../../constants';
import changeStatusMutationOptions from '../../queries/changeStatusMutationOptions';
import { getReportsQueryOptions } from '../../queries/getReportsQueryOptions';
import { Report } from '../../types';

interface Props {
    report: Report;
}

const ReportCard = ({ report }: Props) => {
    const theme = useTheme();
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const { refetch } = useQuery(
        getReportsQueryOptions({
            page: 1,
            size: 100,
            is_considered: false,
        })
    );
    const { mutate } = useMutation({
        mutationFn: changeStatusMutationOptions,
        onMutate: () => {
            setLoading(true);
        },
        onSuccess: () => {
            refetch();
            setLoading(false);
            setShowConfirmationModal(false);
        },
        onError: () => {
            toast.error(t('common.error'));
        },
    });

    return (
        <>
            <Card
                sx={{
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: '10px',
                    padding: '0px 20px 20px 20px',
                    boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
                    border: '2px solid rgba(0, 0, 0, 0.1)',
                }}
            >
                <CardContent
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '20px',
                        flexWrap: 'wrap',
                    }}
                >
                    <Box sx={{ flexGrow: 1, maxWidth: '800px' }}>
                        <Typography color="textSecondary" variant="h6" sx={{ fontWeight: 'bold' }}>
                            {report.subject}
                        </Typography>

                        <Typography variant="body2" color="textSecondary">
                            {report.description}
                        </Typography>
                    </Box>

                    <Box minWidth={200} sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="body2" color="textSecondary">
                            {formatDate(report.creation_date)}
                        </Typography>

                        <Typography variant="caption" color="textSecondary">
                            Autor: {report.created_by.full_name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                            Email: {report.created_by.email}
                        </Typography>
                    </Box>
                </CardContent>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '10px',
                        flexWrap: 'wrap',
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            gap: '10px',
                            marginLeft: { xs: 0, md: '15px' },
                            width: { xs: '100%', md: 'auto' },
                        }}
                    >
                        <Button
                            variant="contained"
                            fullWidth
                            sx={{
                                padding: '5px 20px',
                                fontSize: '16px',
                                gap: '10px',
                            }}
                            onClick={() => setShowConfirmationModal(true)}
                        >
                            Rozstrzygnij
                            <ArrowCircleRightIcon />
                        </Button>
                    </Box>
                    <Chip
                        label={
                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: '10px',
                                    width: '190px',
                                }}
                            >
                                <ErrorIcon />
                                <Typography>{t(ReportTranslationKeys[report.report_type])}</Typography>
                            </Box>
                        }
                        color="error"
                    />
                </Box>
            </Card>
            <Modal
                title={t('report.confirmation_modal_title')}
                open={showConfirmationModal}
                onClose={() => setShowConfirmationModal(false)}
            >
                <Box
                    sx={{
                        display: 'flex',
                        gap: '20px',
                        flexDirection: 'column',
                    }}
                >
                    {loading && (
                        <Box>
                            <Typography>{t('common.loading')}</Typography>
                        </Box>
                    )}
                    <Box
                        sx={{
                            display: 'flex',
                            gap: '20px',
                        }}
                    >
                        <Button
                            onClick={() =>
                                mutate({
                                    user_report_id: report.id,
                                })
                            }
                        >
                            {t('common.confirm')}
                        </Button>
                        <Button>{t('common.cancel')}</Button>
                    </Box>
                </Box>
            </Modal>
        </>
    );
};

export default ReportCard;
