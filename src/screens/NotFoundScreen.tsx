import { useTranslation } from "react-i18next";
import bgImg from "../assets/static/line_bg.webp";
import Container from "../modules/shared/components/Container";
import Layout from "../modules/shared/components/Layout";

const NotFoundScreen = () => {
    const { t } = useTranslation();

    return (
        <Layout>
            <Container
                className="flex items-center justify-center bg-cover bg-center text-center"
                style={{ backgroundImage: `url(${bgImg})` }}
            >
                <h4 className="md:hidden" style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)" }}>
                    {t("not_found_screen.title")}
                </h4>
                <h2 className="hidden md:block" style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)" }}>
                    {t("not_found_screen.title")}
                </h2>
                <p style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)" }}>{t("not_found_screen.subtitle")}</p>
            </Container>
        </Layout>
    );
};

export default NotFoundScreen;
