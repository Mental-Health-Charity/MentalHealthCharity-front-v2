import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import AnimatedSection from "../AnimatedSection";

const FinalCTA = () => {
    const { t } = useTranslation();

    return (
        <section className="bg-primary-brand py-16 md:py-20">
            <AnimatedSection as="div" className="mx-auto max-w-[700px] px-5 text-center">
                <h2 className="text-2xl font-bold text-white md:text-3xl">{t("homepage.final_cta.title")}</h2>
                <p className="mt-3 text-base text-white/80 md:text-lg">{t("homepage.final_cta.subtitle")}</p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                    <Link to="/form/mentee-getting-started">
                        <Button size="lg" className="text-primary-brand bg-white hover:bg-white/90">
                            {t("homepage.final_cta.cta_mentee")}
                        </Button>
                    </Link>
                    <Link to="/form/volunteer">
                        <Button
                            size="lg"
                            variant="ghost"
                            className="border border-white/30 text-white hover:bg-white/10 hover:text-white"
                        >
                            {t("homepage.final_cta.cta_volunteer")}
                        </Button>
                    </Link>
                </div>
            </AnimatedSection>
        </section>
    );
};

export default FinalCTA;
