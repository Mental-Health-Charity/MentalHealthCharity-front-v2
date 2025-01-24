import { Box, Button, Typography } from '@mui/material';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import Modal from '../../../shared/components/Modal';
import { downloadFile } from '../../../shared/helpers/downloadFile';

interface Props {
    open: boolean;
    onClose: () => void;
    token: string;
}

const ResetTokenModal = ({ token, ...props }: Props) => {
    const { t } = useTranslation();

    const handleCopy = () => {
        navigator.clipboard.writeText(token);
        toast.success(t('auth.reset_token_modal.copied'));
        props.onClose();
    };

    const handleDownload = () => {
        downloadFile(token, 'reset_token.txt', 'text/plain');
        toast.success(t('auth.reset_token_modal.downloaded'));
        props.onClose();
    };

    return (
        <Modal {...props} title={t('auth.reset_token_modal.title')}>
            <Box maxWidth={600}>
                <Typography fontSize={20}>{t('auth.reset_token_modal.subtitle')}</Typography>
                <Box sx={{ marginTop: '20px', display: 'flex', gap: '10px', flexDirection: 'column' }}>
                    <Button onClick={handleDownload} fullWidth variant="contained">
                        {t('auth.reset_token_modal.download')}
                    </Button>
                    <Button onClick={handleCopy} fullWidth variant="outlined">
                        {t('auth.reset_token_modal.copy')}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default ResetTokenModal;
