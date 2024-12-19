import { Box, Button, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import useTheme from "../../../../theme";
import wave_icon from "../../../../assets/static/wave.svg";
import logo_with_shadow_icon from "../../../../assets/static/logo_shadow.webp";
import { HeroLogoContainer } from "./styles";
import { Link } from "react-router-dom";

const Hero = () => {
    const { t } = useTranslation();
    const theme = useTheme();
    console.log("theme", theme);
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "800px",
                position: "relative",
                width: "100%",
                background: theme.palette.gradients.primary,

                "&:before": {
                    content: '""',
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    height: "500px",
                    backgroundImage: `url(${wave_icon})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
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
                }}
            >
                <Box
                    sx={{
                        backgroundColor: theme.palette.gradients.dark,
                        borderRadius: "8px",
                        padding: "50px",
                        maxWidth: "850px",
                        zIndex: 1,
                    }}
                >
                    <Box
                        component="main"
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "20px",
                        }}
                    >
                        <Typography
                            sx={{
                                color: "text.primary",
                                textTransform: "uppercase",
                            }}
                            variant="h1"
                            fontSize="36px"
                            fontWeight={550}
                        >
                            {t("homepage.title.1")}{" "}
                            <Typography
                                fontWeight={550}
                                component="span"
                                fontSize="36px"
                                color="colors.accent"
                                variant="h1"
                                sx={{
                                    textShadow: `0px 4px 4px ${theme.palette.shadows.text}`,
                                }}
                            >
                                {t("homepage.title.2")}
                            </Typography>{" "}
                            {t("homepage.title.3")}{" "}
                        </Typography>
                        <Typography
                            component="h2"
                            sx={{
                                color: "text.primary",
                                fontSize: "24px",
                                fontWeight: 550,
                            }}
                        >
                            {t("homepage.desc")}
                        </Typography>
                    </Box>
                    <Box
                        sx={{ marginTop: "25px", display: "flex", gap: "15px" }}
                    >
                        <Button
                            component={Link}
                            variant="contained"
                            to="/form/mentee"
                        >
                            {t("homepage.choose_mentee_button")}
                        </Button>
                        <Button
                            component={Link}
                            variant="outlined"
                            to="/form/volunteer"
                        >
                            {t("homepage.choose_volunteer_button")}
                        </Button>
                    </Box>
                </Box>
                <HeroLogoContainer>
                    <img
                        src={logo_with_shadow_icon}
                        width="100%"
                        height="100%"
                        alt="Fundacja peryskop logo"
                    />
                </HeroLogoContainer>
            </Box>
        </Box>
    );
};

export default Hero;
