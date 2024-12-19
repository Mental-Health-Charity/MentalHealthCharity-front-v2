import { Typography } from "@mui/material";
import Container from "../modules/shared/components/Container";
import { useTranslation } from "react-i18next";
import Layout from "../modules/shared/components/Layout";

const NotFoundScreen = () => {
    const { t } = useTranslation();

    return (
        <Layout>
            <Container>
                <Typography variant="h1">
                    {t("not_found_screen.title")}
                </Typography>
                <Typography variant="body1">
                    {t("not_found_screen.subtitle")}
                </Typography>
            </Container>
        </Layout>
    );
};

export default NotFoundScreen;
