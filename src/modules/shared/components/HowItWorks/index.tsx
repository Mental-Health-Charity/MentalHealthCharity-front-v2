import { ClipboardList, MessageCircle, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import AnimatedSection from "../AnimatedSection";

const steps = [
    { icon: ClipboardList, key: "step1" },
    { icon: Users, key: "step2" },
    { icon: MessageCircle, key: "step3" },
] as const;

const HowItWorks = () => {
    const { t } = useTranslation();

    return (
        <section className="py-20 md:py-28">
            <div className="mx-auto max-w-[1200px] px-5">
                <AnimatedSection as="div" className="mb-14 text-center">
                    <h2 className="text-foreground text-3xl font-bold md:text-4xl">
                        {t("homepage.how_it_works.title")}
                    </h2>
                </AnimatedSection>

                <div className="relative grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
                    {/* Connecting line (desktop) */}
                    <div className="border-border/60 absolute top-16 right-[33%] left-[33%] z-0 hidden border-t-2 border-dashed md:block" />

                    {steps.map(({ icon: Icon, key }, i) => (
                        <AnimatedSection
                            key={key}
                            as="div"
                            delay={i * 150}
                            className="relative z-10 flex flex-col items-center text-center"
                        >
                            <div className="bg-primary-brand relative mb-5 flex size-14 items-center justify-center rounded-full text-white shadow-md">
                                <span className="bg-card text-foreground absolute -top-1 -right-1 flex size-6 items-center justify-center rounded-full text-xs font-bold shadow-sm">
                                    {i + 1}
                                </span>
                                <Icon className="size-6" />
                            </div>
                            <h3 className="text-foreground mb-2 text-lg font-semibold">
                                {t(`homepage.how_it_works.${key}_title`)}
                            </h3>
                            <p className="text-muted-foreground max-w-[300px] text-sm leading-relaxed">
                                {t(`homepage.how_it_works.${key}_desc`)}
                            </p>
                        </AnimatedSection>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
