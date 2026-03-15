import { Button } from "@/components/ui/button";
import { Facebook } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import CardImage01 from "../../../../assets/static/head_1.svg";
import CardImage02 from "../../../../assets/static/head_2.svg";
import CardImage03 from "../../../../assets/static/head_3.svg";
import Card from "../Card";
import SimpleCard from "../SimpleCard";

const AboutUs = () => {
    const { t } = useTranslation();

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
        <section id="about-us" className="mx-auto max-w-[1200px] px-5 py-16 md:py-24">
            {/* Feature cards with illustrations */}
            <div className="flex flex-col gap-10 md:gap-16">
                {smallCards.map(({ id, text, title, img }) => (
                    <div
                        key={id}
                        className={`flex items-center gap-8 md:gap-12 ${id % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
                    >
                        <Card textAlign="justify" className="w-full flex-1" title={title} subtitle={text} />
                        <div className="hidden shrink-0 items-center justify-center min-[650px]:flex">
                            <div className="bg-primary-brand-50 flex w-48 items-center justify-center rounded-xl p-5">
                                <img width={140} loading="lazy" height={160} alt="People icon" src={img} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* CTA cards */}
            <div className="mt-16 flex flex-col gap-10 md:mt-24">
                {cards.map(({ id, text, title, subtitle }) => (
                    <SimpleCard
                        titleClassName="text-start"
                        textAlign="justify"
                        key={id}
                        subtitle={subtitle}
                        title={title}
                        text={text}
                    >
                        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 md:flex-nowrap">
                            <div className="flex w-full max-w-[700px] flex-wrap gap-3 md:flex-nowrap">
                                <Link to="/form/volunteer" className="w-full">
                                    <Button className="w-full">{t("homepage.choose_volunteer_button")}</Button>
                                </Link>
                                <Link to="/form/mentee-getting-started" className="w-full">
                                    <Button variant="outline" className="w-full">
                                        {t("homepage.choose_mentee_button")}
                                    </Button>
                                </Link>
                            </div>
                            <a
                                href="https://www.facebook.com/groups/1340769720143310"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Facebook"
                                className="bg-accent-brand text-foreground hover:bg-accent-brand/80 flex size-11 items-center justify-center rounded-full transition-colors"
                            >
                                <Facebook className="size-5" />
                            </a>
                        </div>
                    </SimpleCard>
                ))}
            </div>
        </section>
    );
};

export default AboutUs;
