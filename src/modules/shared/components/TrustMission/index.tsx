import { useTranslation } from "react-i18next";
import AnimatedSection from "../AnimatedSection";

const TrustMission = () => {
    const { t } = useTranslation();

    const stats = [
        { value: t("homepage.trust_mission.stat1_value"), label: t("homepage.trust_mission.stat1_label") },
        { value: t("homepage.trust_mission.stat2_value"), label: t("homepage.trust_mission.stat2_label") },
        { value: t("homepage.trust_mission.stat3_value"), label: t("homepage.trust_mission.stat3_label") },
    ];

    return (
        <section id="about-us" className="from-primary-brand-50/50 bg-gradient-to-b to-transparent py-20 md:py-28">
            <div className="mx-auto max-w-[800px] px-5 text-center">
                <AnimatedSection as="div">
                    <h2 className="text-foreground text-3xl font-bold md:text-4xl">
                        {t("homepage.trust_mission.title")}
                    </h2>
                    <p className="text-muted-foreground mt-5 text-base leading-relaxed md:text-lg">
                        {t("homepage.trust_mission.description")}
                    </p>
                </AnimatedSection>

                <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
                    {stats.map(({ value, label }, i) => (
                        <AnimatedSection key={label} as="div" delay={i * 100}>
                            <div className="bg-card rounded-xl border p-6 shadow-sm">
                                <p className="text-primary-brand text-3xl font-bold">{value}</p>
                                <p className="text-muted-foreground mt-1 text-sm">{label}</p>
                            </div>
                        </AnimatedSection>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TrustMission;
