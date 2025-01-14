import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FacebookIcon from '@mui/icons-material/Facebook';
import { Box, Button, IconButton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import PeopleIcon from '../../../../assets/static/landing_icon.png';
import useTheme from '../../../../theme';
import Card from '../Card';
import SimpleCard from '../SimpleCard';
import { ImageWrapperControl, StyledImageWrapper } from './style';

const AboutUs = () => {
    const { t } = useTranslation();
    const theme = useTheme();

    return (
        <Box
            width="100%"
            maxWidth={1600}
            sx={{
                margin: '0 auto',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '20px',
                flexDirection: 'column',
                position: 'relative',
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    gap: '60px',
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    margin: '50px 0',
                }}
            >
                {Array.from({ length: 2 }).map((_, index) => (
                    <Box display="flex" gap={10}>
                        <Card
                            sx={{ width: '100%' }}
                            key={index}
                            title="Baza wiedzy"
                            subtitle="Szkolimy wolontariuszy oraz pomagamy im rozwijać się w obszarze niesienia pomocy psychologicznej."
                        >
                            <Box
                                sx={{
                                    width: '100%',
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                }}
                            >
                                <Button component={Link} to="./" sx={{ gap: '10px' }}>
                                    {t('homepage.about_us.learn_more_button')} <ArrowForwardIcon />
                                </Button>
                            </Box>
                        </Card>
                        <ImageWrapperControl>
                            <StyledImageWrapper>
                                <img width={180} loading="lazy" height={200} alt="People icon" src={PeopleIcon} />
                            </StyledImageWrapper>
                            <StyledImageWrapper>
                                <img width={180} loading="lazy" height={200} alt="People icon" src={PeopleIcon} />
                            </StyledImageWrapper>
                            <StyledImageWrapper>
                                <img width={180} loading="lazy" height={200} alt="People icon" src={PeopleIcon} />
                            </StyledImageWrapper>
                        </ImageWrapperControl>
                    </Box>
                ))}
            </Box>
            <Box zIndex={1} display="flex" gap={8} flexDirection="column">
                {Array.from({ length: 2 }).map((_, index) => (
                    <SimpleCard
                        key={index}
                        subtitle={t('homepage.about_us.about_us_card.subtitle')}
                        title={t('homepage.about_us.about_us_card.title')}
                        text={t('homepage.about_us.about_us_card.text')}
                    >
                        <Box
                            sx={{
                                marginTop: '20px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                flexWrap: { xs: 'wrap', md: 'nowrap' },
                                gap: '20px',
                            }}
                        >
                            <Box
                                sx={{
                                    flexWrap: { xs: 'wrap', md: 'nowrap' },
                                }}
                                display="flex"
                                gap={2}
                            >
                                <Button fullWidth variant="contained">
                                    {t('homepage.choose_volunteer_button')}
                                </Button>
                                <Button fullWidth variant="outlined">
                                    {t('homepage.choose_mentee_button')}
                                </Button>
                            </Box>
                            <IconButton
                                sx={{
                                    color: theme.palette.text.primary,
                                    padding: '10px',
                                    width: '50px',
                                    height: '50px',
                                    backgroundColor: theme.palette.colors.accent,
                                    borderRadius: '50%',
                                }}
                            >
                                <FacebookIcon fontSize="large" />
                            </IconButton>
                        </Box>
                    </SimpleCard>
                ))}
            </Box>
        </Box>
    );
};

export default AboutUs;
