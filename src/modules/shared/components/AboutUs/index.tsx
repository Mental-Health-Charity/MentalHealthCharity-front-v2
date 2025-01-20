import FacebookIcon from '@mui/icons-material/Facebook';
import { Box, Button, IconButton } from '@mui/material';
import { useMemo } from 'react';
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

    const cards = useMemo(
        () => [
            {
                title: t('homepage.about_us.cards.0.title'),
                subtitle: t('homepage.about_us.cards.0.subtitle'),
                text: t('homepage.about_us.cards.0.desc'),
                id: 0,
            },
            {
                title: t('homepage.about_us.cards.1.title'),
                subtitle: t('homepage.about_us.cards.1.subtitle'),
                text: t('homepage.about_us.cards.1.desc'),
                id: 1,
            },
        ],
        [t]
    );

    const smallCards = useMemo(
        () => [
            {
                title: t('homepage.about_us.small_cards.0.title'),
                text: t('homepage.about_us.small_cards.0.desc'),
                id: 0,
            },
            {
                title: t('homepage.about_us.small_cards.1.title'),
                text: t('homepage.about_us.small_cards.1.desc'),
                id: 1,
            },
            {
                title: t('homepage.about_us.small_cards.2.title'),
                text: t('homepage.about_us.small_cards.2.desc'),
                id: 2,
            },
        ],
        [t]
    );

    return (
        <Box
            width="100%"
            maxWidth={1600}
            id="about-us"
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
                {smallCards.map(({ id, text, title }) => (
                    <Box key={id} display="flex" gap={10} flexDirection={id % 2 === 0 ? 'row' : 'row-reverse'}>
                        <Card sx={{ width: '100%' }} title={title} subtitle={text}></Card>
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
                {cards.map(({ id, text, title, subtitle }) => (
                    <SimpleCard key={id} subtitle={subtitle} title={title} text={text}>
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
                                    flexWrap: {
                                        xs: 'wrap',
                                        md: 'nowrap',
                                        width: '100%',
                                        maxWidth: '700px',
                                        marginTop: '10px',
                                    },
                                }}
                                display="flex"
                                gap={2}
                            >
                                <Button component={Link} variant="contained" to="/form/volunteer" fullWidth>
                                    {t('homepage.choose_volunteer_button')}
                                </Button>
                                <Button component={Link} to="/form/mentee" fullWidth variant="outlined">
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
