import { Box, Grid, Stack, Typography, useTheme } from '@mui/material';
import { t } from 'i18next';
import Container from '../Container';
import InternalLink, { ExternalLink } from '../InternalLink/styles';

const Footer = () => {
    const theme = useTheme();

    return (
        <Box component="footer" sx={{ bgcolor: theme.palette.colors.dark, color: 'white', py: 4 }}>
            <Container
                parentProps={{
                    sx: {
                        minHeight: 'fit-content',
                        padding: '0px',
                    },
                }}
                sx={{
                    marginTop: 2,
                }}
            >
                <Grid
                    sx={{
                        textAlign: { xs: 'center', sm: 'left' },
                    }}
                    container
                    spacing={4}
                    justifyContent="space-between"
                >
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Fundacja Peryskop
                        </Typography>
                        <Stack spacing={1}>
                            <InternalLink color="secondary" to="/#about-us">
                                {t('footer.about_us')}
                            </InternalLink>
                            <InternalLink color="secondary" to="/tos">
                                {t('footer.privacy_policy')}
                            </InternalLink>
                            <InternalLink color="secondary" to="/tos">
                                {t('footer.terms_of_service')}
                            </InternalLink>
                        </Stack>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            {t('footer.social')}
                        </Typography>
                        <Stack spacing={1}>
                            <ExternalLink
                                href="https://www.facebook.com/groups/1340769720143310"
                                target="_blank"
                                color="secondary"
                                rel="noopener noreferrer"
                            >
                                Facebook
                            </ExternalLink>
                            <ExternalLink
                                href="https://www.facebook.com/groups/1340769720143310"
                                target="_blank"
                                color="secondary"
                                rel="noopener noreferrer"
                            >
                                Twitter
                            </ExternalLink>
                            <ExternalLink
                                href="https://www.linkedin.com/company/fundacja-peryskop"
                                target="_blank"
                                color="secondary"
                                rel="noopener noreferrer"
                            >
                                LinkedIn
                            </ExternalLink>
                        </Stack>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            {t('footer.contact')}
                        </Typography>
                        <Typography variant="body2">
                            Email:{' '}
                            <ExternalLink color="secondary" href="mailto:kontakt@fundacjaperyskop.org">
                                kontakt@fundacjaperyskop.org
                            </ExternalLink>
                        </Typography>
                    </Grid>
                </Grid>

                <Box sx={{ textAlign: 'center', mt: 4 }}>
                    <Typography variant="body2">
                        &copy; {new Date().getFullYear()} {t('footer.rights_reserved')}
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
