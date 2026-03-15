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
        <div
            id="about-us"
            className="relative mx-auto flex w-full max-w-[1600px] flex-col items-center justify-center gap-5"
        >
            <div className="my-12 flex w-full flex-col justify-center gap-[30px] px-2.5 md:gap-[60px] md:px-0">
                {smallCards.map(({ id, text, title, img }) => (
                    <div key={id} className={`flex gap-10 ${id % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}>
                        <Card textAlign="justify" className="w-full" title={title} subtitle={text} />
                        <div className="flex items-center justify-center max-[600px]:hidden">
                            <div className="bg-secondary flex w-60 items-center justify-center rounded-lg p-5 shadow-[0_4px_13px_rgba(0,0,0,0.25)] max-[980px]:hidden">
                                <img width={180} loading="lazy" height={200} alt="People icon" src={img} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="z-[1] flex flex-col gap-16 px-2.5 md:px-0">
                {cards.map(({ id, text, title, subtitle }) => (
                    <SimpleCard
                        titleClassName="text-start"
                        textAlign="justify"
                        key={id}
                        subtitle={subtitle}
                        title={title}
                        text={text}
                    >
                        <div className="mt-5 flex flex-wrap items-center justify-between gap-5 md:flex-nowrap">
                            <div className="mt-2.5 flex w-full max-w-[700px] flex-wrap gap-4 md:flex-nowrap">
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
                                className="bg-accent-brand text-foreground hover:bg-accent-brand/80 flex size-[50px] items-center justify-center rounded-full transition-colors"
                            >
                                <Facebook className="size-6" />
                            </a>
                        </div>
                    </SimpleCard>
                ))}
            </div>
        </div>
    );
};

export default AboutUs;
