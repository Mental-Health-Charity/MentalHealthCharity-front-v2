import { Box, Button, Link, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Link as ReactRouterLink } from "react-router-dom";
import dots from "../../../../assets/static/card_dots.svg";
import banner from "../../../../assets/static/hero_image.webp";
import waves from "../../../../assets/static/waves.svg";
import { useUser } from "../../../auth/components/AuthProvider";
import { getChatsQueryOptions } from "../../../chat/queries/getChatsQueryOptions";
import Card from "../Card";
import { HeroLogoContainer, StyledPulseButton } from "./styles";

const Hero = () => {
    const { t } = useTranslation();
    const { user } = useUser();
    const { data: chats } = useQuery(
        getChatsQueryOptions(
            { size: 50, page: 1 },
            {
                enabled: !!user,
                queryKey: ["chats"],
            }
        )
    );

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "800px",
                position: "relative",
                width: "100%",
                paddingTop: { xs: "0px", md: "40px" },

                "&:before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundImage: `url(${waves})`,
                    backgroundSize: "cover",
                    backgroundPosition: "top",
                    backgroundRepeat: "no-repeat",
                },

                "&:after": {
                    content: '""',
                    position: "absolute",
                    bottom: 0,
                    left: 10,
                    width: "80px",
                    zIndex: 99,
                    height: "80px",
                    backgroundImage: `url(${dots})`,
                    backgroundSize: "cover",
                    backgroundPosition: "top",
                    backgroundRepeat: "no-repeat",
                    display: { xs: "block", md: "none" },
                },
            }}
        >
            <Box
                width="100%"
                sx={{
                    display: "flex",
                    maxWidth: "1600px",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "20px",
                    position: "relative",
                }}
            >
                <Card
                    variant="secondary"
                    sx={{
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        padding: { xs: "20px", md: "30px" },
                    }}
                >
                    <Box
                        component="main"
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px",
                            maxWidth: "520px",
                        }}
                    >
                        <Typography
                            sx={{
                                color: "text.secondary",
                                fontSize: { xs: "28px", md: "32px" },
                            }}
                            variant="h1"
                            fontWeight={550}
                        >
                            {t("homepage.title")}
                        </Typography>
                        <Typography
                            component="h2"
                            sx={{
                                color: "text.secondary",
                                fontSize: "24px",
                                width: "100%",
                            }}
                        >
                            {t("homepage.desc")}
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            marginTop: "25px",
                            display: "flex",
                            gap: "15px",
                            flexWrap: { xs: "wrap", md: "nowrap" },
                        }}
                    >
                        {chats && chats.total > 0 ? (
                            <Button component={ReactRouterLink} to="/chat/" variant="contained" fullWidth>
                                {t("homepage.chat_now")}
                            </Button>
                        ) : (
                            <>
                                {/* todo fix */}
                                <Link
                                    component={ReactRouterLink}
                                    sx={{
                                        width: {
                                            xs: "100%",
                                            md: "auto",
                                        },
                                    }}
                                    to="/form/mentee"
                                >
                                    <StyledPulseButton
                                        sx={{
                                            width: { xs: "100%", md: "auto" },
                                        }}
                                        variant="contained"
                                    >
                                        {t("homepage.choose_mentee_button")}
                                    </StyledPulseButton>
                                </Link>
                                <Button
                                    sx={{
                                        width: { xs: "100%", md: "auto" },
                                    }}
                                    fullWidth
                                    component={ReactRouterLink}
                                    variant="outlined"
                                    to="/form/volunteer"
                                >
                                    {t("homepage.choose_volunteer_button")}
                                </Button>
                            </>
                        )}
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
