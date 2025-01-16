import { Box, Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import dots from '../../../../assets/static/card_dots.svg';
import banner from '../../../../assets/static/hero_image.webp';
import waves from '../../../../assets/static/waves.svg';
import Card from '../Card';
import { HeroLogoContainer } from './styles';

const Hero = () => {
    const { t } = useTranslation();

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '800px',
                position: 'relative',
                width: '100%',
                paddingTop: '40px',

                '&:before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundImage: `url(${waves})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'top',
                    backgroundRepeat: 'no-repeat',
                },

                '&:after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: 10,
                    width: '80px',
                    zIndex: 99,
                    height: '80px',
                    backgroundImage: `url(${dots})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'top',
                    backgroundRepeat: 'no-repeat',
                    display: { xs: 'block', md: 'none' },
                },
            }}
        >
            <Box
                width="100%"
                sx={{
                    display: 'flex',
                    maxWidth: '1600px',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '20px',
                    position: 'relative',
                }}
            >
                <Card variant="secondary">
                    <Box
                        component="main"
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '20px',
                            maxWidth: '520px',
                        }}
                    >
                        <Typography
                            sx={{
                                color: 'text.secondary',
                            }}
                            variant="h1"
                            fontSize="32px"
                            fontWeight={550}
                        >
                            {t('homepage.title')}
                        </Typography>
                        <Typography
                            component="h2"
                            sx={{
                                color: 'text.secondary',
                                fontSize: '24px',
                                width: '100%',
                                fontWeight: 550,
                            }}
                        >
                            {t('homepage.desc')}
                            {/* dodaje sobie coś */}
                        </Typography>
                    </Box>

                    <Box
                        sx={{ marginTop: '25px', display: 'flex', gap: '15px', flexWrap: { xs: 'wrap', md: 'nowrap' } }}
                    >
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
                        <Button
                            sx={{
                                width: { xs: '100%', md: 'auto' },
                            }}
                            fullWidth
                            component={Link}
                            variant="outlined"
                            to="/form/volunteer"
                        >
                            {t('homepage.choose_volunteer_button')}
                        </Button>
                    </Box>
                </Card>
                <HeroLogoContainer>
                    <img loading="lazy" src={banner} width="100%" height="100%" alt="Fundacja peryskop baner" />
                </HeroLogoContainer>
            </Box>
        </Box>
    );
};

export default Hero;
