import { Button } from "@/components/ui/button";
import { ArrowRight, Heart } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const DonationsPreview = () => {
    const { t } = useTranslation();

    return (
        <section className="px-5 py-16 md:py-20">
            <div className="bg-primary-brand mx-auto flex max-w-[900px] flex-col items-center gap-6 rounded-3xl px-8 py-12 text-center text-white md:px-16">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-white/15">
                    <Heart className="size-7" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
                    {t("donations.homepage_preview.title")}
                </h2>
                <p className="max-w-[500px] text-white/80">{t("donations.homepage_preview.desc")}</p>
                <Link to="/donations">
                    <Button size="lg" className="gap-2 bg-white text-teal-700 hover:bg-white/90">
                        {t("donations.homepage_preview.read_more")}
                        <ArrowRight className="size-4" />
                    </Button>
                </Link>
            </div>
        </section>
    );
};

export default DonationsPreview;
