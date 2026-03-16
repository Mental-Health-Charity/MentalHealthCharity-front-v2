import { cn } from "@/lib/utils";
import { ArrowRight, ClipboardList, MessageCircle, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import AnimatedSection from "../AnimatedSection";

const steps = [
    { icon: ClipboardList, key: "step1", accent: "bg-primary-brand" },
    { icon: Users, key: "step2", accent: "bg-info-brand" },
    { icon: MessageCircle, key: "step3", accent: "bg-success-brand" },
] as const;

const HowItWorks = () => {
    const { t } = useTranslation();

    return (
        <section className="bg-primary-brand-50/50 py-16 md:py-20">
            <div className="mx-auto max-w-[1200px] px-5">
                <AnimatedSection as="div" className="mb-10 text-center md:mb-12">
                    <h2 className="text-foreground text-3xl font-bold md:text-4xl">
                        {t("homepage.how_it_works.title")}
                    </h2>
                </AnimatedSection>

                <div className="relative flex flex-col items-center gap-5 md:flex-row md:items-stretch md:gap-0">
                    {steps
                        .map(({ icon: Icon, key, accent }, i) => (
                            <AnimatedSection
                                key={key}
                                as="div"
                                delay={i * 150}
                                className="flex w-full max-w-[380px] flex-1 flex-col items-center md:max-w-none"
                            >
                                <div className="bg-card flex h-full w-full flex-col items-center rounded-2xl border border-transparent px-6 py-8 text-center shadow-sm transition-shadow hover:shadow-md">
                                    {/* Step number + icon */}
                                    <div className="relative mb-5">
                                        <div
                                            className={cn(
                                                "flex size-16 items-center justify-center rounded-2xl text-white shadow-md",
                                                accent
                                            )}
                                        >
                                            <Icon className="size-7" />
                                        </div>
                                        <span className="bg-card text-foreground absolute -top-2 -right-2 flex size-7 items-center justify-center rounded-full text-xs font-bold shadow">
                                            {i + 1}
                                        </span>
                                    </div>

                                    <h3 className="text-foreground mb-2 text-lg font-semibold">
                                        {t(`homepage.how_it_works.${key}_title`)}
                                    </h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        {t(`homepage.how_it_works.${key}_desc`)}
                                    </p>
                                </div>
                            </AnimatedSection>
                        ))
                        .reduce<React.ReactNode[]>((acc, card, i) => {
                            if (i > 0) {
                                acc.push(
                                    <div
                                        key={`arrow-${i}`}
                                        className="text-border flex shrink-0 items-center justify-center md:px-3"
                                    >
                                        <ArrowRight className="hidden size-6 md:block" />
                                        <ArrowRight className="size-5 rotate-90 md:hidden" />
                                    </div>
                                );
                            }
                            acc.push(card);
                            return acc;
                        }, [])}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
