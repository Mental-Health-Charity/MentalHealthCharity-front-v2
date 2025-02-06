import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Card from '../modules/shared/components/Card';
import Container from '../modules/shared/components/Container';
import ShareWebsite from '../modules/shared/components/ShareWebsite';

const SupportUsScreen = () => {
    const { t } = useTranslation();
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
            </Box>
        </Container>
    );
};

export default SupportUsScreen;
