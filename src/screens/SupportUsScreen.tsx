import { Box, Button } from '@mui/material';
import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import Card from '../modules/shared/components/Card';
import Container from '../modules/shared/components/Container';
import ShareWebsite from '../modules/shared/components/ShareWebsite';

const SupportUsScreen = () => {
    const { t } = useTranslation();

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText('62 1870 1045 2083 1080 5210 0001');
        toast.success(t('common.copied_to_clipboard'));
    }, [t]);

    return (
        <Container waves>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                    padding: {
                        md: '0 20px',
                        lg: '20px 50px',
                    },
                }}
            >
                <Card title={t('support_us.title')} subtitle={t('support_us.subtitle')}></Card>
                <Card
                    title={t('support_us.options.share.title')}
                    variant="secondary"
                    subtitle={t('support_us.options.share.subtitle')}
                >
                    <ShareWebsite />
                </Card>
                <Card
                    title={t('support_us.options.donate.title')}
                    variant="secondary"
                    subtitle={t('support_us.options.donate.subtitle')}
                >
                    <Button
                        onClick={handleCopy}
                        sx={{ fontSize: '28px', fontWeight: 'bold', padding: '10px 0', userSelect: 'all' }}
                    >
                        62 1870 1045 2083 1080 5210 0001
                    </Button>
                </Card>
            </Box>
        </Container>
    );
};

export default SupportUsScreen;
