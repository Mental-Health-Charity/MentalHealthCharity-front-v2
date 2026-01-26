import { Box, Button, Container, Paper, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Link as ReactRouterLink } from "react-router-dom";
import ScrollIndicator from "../modules/shared/components/ScrollIndicator";

const MenteeFormGettingStartedScreen = () => {
    const { t } = useTranslation();

    return (
        <>
            {/* HEADER */}
            <Box
                sx={{
                    background: (theme) => theme.palette.gradients.primary,
                    color: "white",
                    p: "160px 20px 120px",
                }}
            >
                <Container maxWidth="md">
                    <Typography variant="h3" fontWeight={800}>
                        {t("mentee_form_getting_started_screen.header.title")}
                    </Typography>

                    <Typography variant="body1" sx={{ opacity: 0.9, mt: 2, maxWidth: 520 }}>
                        {t("mentee_form_getting_started_screen.header.subtitle")}
                    </Typography>
                </Container>
            </Box>

            {/* CONTENT */}
            <Container
                maxWidth="md"
                sx={{
                    mt: -6,
                    pb: 10,
                }}
            >
                <Paper
                    sx={{
                        p: { xs: 3, md: 5 },
                        borderRadius: 3,
                        border: "1px solid",
                        borderColor: "colors.border",
                        boxShadow: "none",
                        backgroundColor: "background.paper",
                    }}
                >
                    <Stack spacing={3}>
                        <Typography fontWeight={700} color="text.secondary">
                            {t("mentee_form_getting_started_screen.content.p1")}
                        </Typography>

                        <Typography color="text.secondary">
                            {t("mentee_form_getting_started_screen.content.p2")}
                        </Typography>

                        <Typography color="text.secondary">
                            {t("mentee_form_getting_started_screen.content.p3")}
                        </Typography>

                        <Box>
                            <Typography color="text.secondary" fontWeight={700} gutterBottom>
                                {t("mentee_form_getting_started_screen.content.chat_section.title")}
                            </Typography>

                            <Stack spacing={2}>
                                <Typography color="text.secondary">
                                    {t("mentee_form_getting_started_screen.content.chat_section.p4")}
                                </Typography>

                                <Typography color="text.secondary">
                                    {t("mentee_form_getting_started_screen.content.chat_section.p5")}
                                </Typography>

                                <Typography color="text.secondary">
                                    {t("mentee_form_getting_started_screen.content.chat_section.p6")}
                                </Typography>
                            </Stack>
                        </Box>

                        <Typography color="text.secondary">
                            {t("mentee_form_getting_started_screen.content.p7")}
                        </Typography>

                        <Typography color="text.secondary">
                            {t("mentee_form_getting_started_screen.content.p8")}
                        </Typography>

                        {/* CTA SECTION */}
                        <Box
                            sx={{
                                mt: 4,
                                pt: 4,
                                borderTop: "1px solid",
                                borderColor: "colors.border",
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <Button component={ReactRouterLink} to="/form/mentee" variant="contained" fullWidth>
                                {t("homepage.chat_now")}
                            </Button>
                        </Box>
                    </Stack>
                </Paper>

                <Typography variant="body2" color="text.light" textAlign="center" sx={{ mt: 3 }}>
                    {t("mentee_form_getting_started_screen.content.footer")} 💙
                </Typography>

                <ScrollIndicator />
            </Container>
        </>
    );
};

export default MenteeFormGettingStartedScreen;
