import { Box, Grid, Link, Stack, Typography, useTheme } from '@mui/material';
import { t } from 'i18next';
import Container from '../Container';

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
                            <Link href="/#about-us" color="inherit" underline="hover">
                                {t('footer.about_us')}
                            </Link>
                            <Link href="/tos" color="inherit" underline="hover">
                                {t('footer.privacy_policy')}
                            </Link>
                            <Link href="/tos" color="inherit" underline="hover">
                                {t('footer.terms_of_service')}
                            </Link>
                        </Stack>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            {t('footer.social')}
                        </Typography>
                        <Stack spacing={1}>
                            <Link
                                href="https://www.facebook.com/groups/1340769720143310"
                                color="inherit"
                                target="_blank"
                                rel="noopener noreferrer"
                                underline="hover"
                            >
                                Facebook
                            </Link>
                            <Link
                                href="https://www.facebook.com/groups/1340769720143310"
                                color="inherit"
                                target="_blank"
                                rel="noopener noreferrer"
                                underline="hover"
                            >
                                Twitter
                            </Link>
                            <Link
                                href="https://www.linkedin.com/company/fundacja-peryskop"
                                color="inherit"
                                target="_blank"
                                rel="noopener noreferrer"
                                underline="hover"
                            >
                                LinkedIn
                            </Link>
                        </Stack>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            {t('footer.contact')}
                        </Typography>
                        <Typography variant="body2">
                            Email:{' '}
                            <Link href="mailto:kontakt@fundacjaperyskop.org" color="inherit">
                                kontakt@fundacjaperyskop.org
                            </Link>
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
