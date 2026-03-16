import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import background from "../assets/static/admin_panel_bg.svg";
import Card from "../modules/shared/components/Card";
import Container from "../modules/shared/components/Container";

const AboutChatScreen = () => {
    const { t } = useTranslation();

    return (
        <Container
            parentClassName="bg-cover bg-center bg-no-repeat"
            parentStyle={{ backgroundImage: `url(${background})` }}
        >
            <Card title={t("chat.about.title")} subtitle={t("chat.about.subtitle")}>
                <Button className="mt-5 w-full md:w-auto" render={<Link to="/form/mentee-getting-started" />}>
                    {t("homepage.choose_mentee_button")}
                </Button>
            </Card>
        </Container>
    );
};

export default AboutChatScreen;
