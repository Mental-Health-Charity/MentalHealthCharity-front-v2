import FacebookIcon from "@mui/icons-material/Facebook";
import { Box, Button, IconButton } from "@mui/material";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import CardImage01 from "../../../../assets/static/head_1.svg";
import CardImage02 from "../../../../assets/static/head_2.svg";
import CardImage03 from "../../../../assets/static/head_3.svg";
import useTheme from "../../../../theme";
import Card from "../Card";
import SimpleCard from "../SimpleCard";
import { ImageWrapperControl, StyledImageWrapper } from "./style";

const AboutUs = () => {
    const { t } = useTranslation();
    const theme = useTheme();

    const cards = useMemo(
        () => [
            {
                title: t("homepage.about_us.cards.0.title"),
                subtitle: t("homepage.about_us.cards.0.subtitle"),
                text: t("homepage.about_us.cards.0.desc"),
                id: 0,
            },
            {
                title: t("homepage.about_us.cards.1.title"),
                subtitle: t("homepage.about_us.cards.1.subtitle"),
                text: t("homepage.about_us.cards.1.desc"),
                id: 1,
            },
        ],
        [t]
    );

    const smallCards = useMemo(
        () => [
            {
                title: t("homepage.about_us.small_cards.0.title"),
                text: t("homepage.about_us.small_cards.0.desc"),
                img: CardImage01,
                id: 0,
            },
            {
                title: t("homepage.about_us.small_cards.1.title"),
                text: t("homepage.about_us.small_cards.1.desc"),
                img: CardImage02,
                id: 1,
            },
            {
                title: t("homepage.about_us.small_cards.2.title"),
                text: t("homepage.about_us.small_cards.2.desc"),
                img: CardImage03,
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
                margin: "0 auto",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "20px",
                flexDirection: "column",
                position: "relative",
            }}
        >
            <Box
                sx={{
                    width: "100%",
                    gap: { xs: "30px", md: "60px" },
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                    margin: "50px 0",
                    padding: { xs: "10px", md: 0 },
                }}
            >
                {smallCards.map(({ id, text, title, img }) => (
                    <Box key={id} display="flex" gap={10} flexDirection={id % 2 === 0 ? "row" : "row-reverse"}>
                        <Card textAlign="justify" sx={{ width: "100%" }} title={title} subtitle={text}></Card>
                        <ImageWrapperControl>
                            <StyledImageWrapper>
                                <img width={180} loading="lazy" height={200} alt="People icon" src={img} />
                            </StyledImageWrapper>
                        </ImageWrapperControl>
                    </Box>
                ))}
            </Box>
            <Box zIndex={1} display="flex" gap={8} flexDirection="column" sx={{ padding: { xs: "10px", md: 0 } }}>
                {cards.map(({ id, text, title, subtitle }) => (
                    <SimpleCard
                        titleProps={{
                            sx: {
                                textAlign: "start",
                            },
                        }}
                        textAlign="justify"
                        key={id}
                        subtitle={subtitle}
                        title={title}
                        text={text}
                    >
                        <Box
                            sx={{
                                marginTop: "20px",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                flexWrap: { xs: "wrap", md: "nowrap" },
                                gap: "20px",
                            }}
                        >
                            <Box
                                sx={{
                                    flexWrap: {
                                        xs: "wrap",
                                        md: "nowrap",
                                        width: "100%",
                                        maxWidth: "700px",
                                        marginTop: "10px",
                                    },
                                }}
                                display="flex"
                                gap={2}
                            >
                                <Button component={Link} variant="contained" to="/form/volunteer" fullWidth>
                                    {t("homepage.choose_volunteer_button")}
                                </Button>
                                <Button component={Link} to="/form/mentee" fullWidth variant="outlined">
                                    {t("homepage.choose_mentee_button")}
                                </Button>
                            </Box>
                            <IconButton
                                component="a"
                                href="https://www.facebook.com/groups/1340769720143310"
                                target="_blank"
                                rel="noreferrer"
                                sx={{
                                    color: theme.palette.text.primary,
                                    padding: "10px",
                                    width: "50px",
                                    height: "50px",
                                    backgroundColor: theme.palette.colors.accent,
                                    borderRadius: "50%",
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
