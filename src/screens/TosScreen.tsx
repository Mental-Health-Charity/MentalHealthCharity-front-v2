import { useTranslation } from "react-i18next";
import bgImage from "../assets/static/admin_panel_bg.svg";
import Card from "../modules/shared/components/Card";
import Container from "../modules/shared/components/Container";
import InternalLink from "../modules/shared/components/InternalLink";

const TosScreen = () => {
    const { t } = useTranslation();
    return (
        <Container className="w-full bg-[length:100%] bg-center" style={{ backgroundImage: `url(${bgImage})` }}>
            <Card title={t("tos.title")} subtitle={t("tos.subtitle")} className="w-full">
                <div className="mt-5 flex flex-col gap-5">
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
                </div>
            </Card>
        </Container>
    );
};

export default TosScreen;
