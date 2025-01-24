import { Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import background from '../assets/static/admin_panel_bg.svg';
import Card from '../modules/shared/components/Card';
import Container from '../modules/shared/components/Container';

const AboutChatScreen = () => {
    const { t } = useTranslation();

    return (
        <Container
            parentProps={{
                sx: {
                    backgroundImage: `url(${background})`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                },
            }}
        >
            <Card title={t('chat.about.title')} subtitle={t('chat.about.subtitle')}>
                <Typography sx={{ marginTop: '20px' }}>{t('chat.about.tutorial')}</Typography>
                <Button
                    sx={{
                        width: { xs: '100%', md: 'auto' },
                    }}
                    component={Link}
                    variant="contained"
                    to="/form/mentee"
                >
                    {t('homepage.choose_mentee_button')}
                </Button>
            </Card>
        </Container>
    );
};

export default AboutChatScreen;
