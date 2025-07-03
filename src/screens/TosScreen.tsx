import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import bgImage from "../assets/static/admin_panel_bg.svg";
import Card from "../modules/shared/components/Card";
import Container from "../modules/shared/components/Container";
import InternalLink from "../modules/shared/components/InternalLink/styles";

const TosScreen = () => {
    const { t } = useTranslation();
    return (
        <Container
            sx={{
                backgroundImage: `url(${bgImage})`,
                backgroundPosition: "center",
                backgroundSize: "100%",
                width: "100%",
            }}
        >
            <Card
                title={t("tos.title")}
                subtitle={t("tos.subtitle")}
                sx={{
                    width: "100%",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "20px",
                        marginTop: "20px",
                    }}
                >
                    <InternalLink target="_blank" to="/klauzula-informacyjna-RODO.pdf">
                        {t("tos.clause")}
                    </InternalLink>
                    <InternalLink target="_blank" to="/polityka-prywatnosci-i-cookies.pdf">
                        {t("tos.privacy_policy")}
                    </InternalLink>
                    <InternalLink target="_blank" to="/przetwarzanie-danych-osobowych.pdf">
                        {t("tos.data_processing")}
                    </InternalLink>
                    <InternalLink target="_blank" to="/regulamin-serwisu.pdf">
                        {t("tos.terms")}
                    </InternalLink>
                </Box>
            </Card>
        </Container>
    );
};

export default TosScreen;
