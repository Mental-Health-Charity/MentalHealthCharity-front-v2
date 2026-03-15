import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    ArrowRight,
    Copy,
    ExternalLink,
    Globe,
    Heart,
    HeartHandshake,
    MessageCircleHeart,
    Monitor,
    ShieldCheck,
    Users,
} from "lucide-react";
import { useCallback } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

const DonationsScreen = () => {
    const { t } = useTranslation();

    const handleCopyAccount = useCallback(() => {
        navigator.clipboard.writeText("62 1870 1045 2083 1080 5210 0001");
        toast.success(t("common.copied_to_clipboard"));
    }, [t]);

    const goals = [
        {
            icon: HeartHandshake,
            title: t("donations.goals.goal1_title"),
            desc: t("donations.goals.goal1_desc"),
        },
        {
            icon: Users,
            title: t("donations.goals.goal2_title"),
            desc: t("donations.goals.goal2_desc"),
        },
        {
            icon: ShieldCheck,
            title: t("donations.goals.goal3_title"),
            desc: t("donations.goals.goal3_desc"),
        },
        {
            icon: Monitor,
            title: t("donations.goals.goal4_title"),
            desc: t("donations.goals.goal4_desc"),
        },
    ];

    return (
        <div className="min-h-screen">
            {/* Hero */}
            <section className="from-primary-brand/10 via-primary-brand/5 relative overflow-hidden bg-gradient-to-b to-transparent px-5 pt-24 pb-16 text-center">
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
                        backgroundSize: "40px 40px",
                    }}
                />
                <div className="relative mx-auto max-w-[700px]">
                    <div className="bg-primary-brand/10 text-primary-brand mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl">
                        <Heart className="size-8" />
                    </div>
                    <h1 className="text-foreground text-4xl font-bold tracking-tight md:text-5xl">
                        {t("donations.hero_title")}
                    </h1>
                    <p className="text-muted-foreground mx-auto mt-4 max-w-[520px] text-lg">
                        {t("donations.hero_subtitle")}
                    </p>
                </div>
            </section>

            {/* What is the Foundation */}
            <section className="px-5 py-16 md:py-24">
                <div className="mx-auto max-w-[760px]">
                    <h2 className="text-foreground text-3xl font-bold tracking-tight md:text-4xl">
                        {t("donations.what_is.title")}
                    </h2>
                    <Separator className="my-6" />
                    <div className="text-muted-foreground space-y-5 text-[1.05rem] leading-relaxed">
                        <p>{t("donations.what_is.p1")}</p>
                        <p>{t("donations.what_is.p2")}</p>
                        <p>{t("donations.what_is.p3")}</p>
                        <p className="text-foreground font-medium italic">{t("donations.what_is.p4")}</p>
                        <p>{t("donations.what_is.p5")}</p>
                        <p className="text-primary-brand text-lg font-semibold">{t("donations.what_is.p6")}</p>
                        <p>{t("donations.what_is.p7")}</p>
                        <p>{t("donations.what_is.p8")}</p>
                        <p className="text-foreground font-medium">{t("donations.what_is.p9")}</p>
                    </div>
                </div>
            </section>

            {/* Our Goals */}
            <section className="bg-muted/50 px-5 py-16 md:py-24">
                <div className="mx-auto max-w-[1000px]">
                    <h2 className="text-foreground text-center text-3xl font-bold tracking-tight md:text-4xl">
                        {t("donations.goals.title")}
                    </h2>
                    <div className="mt-12 grid gap-6 sm:grid-cols-2">
                        {goals.map(({ icon: Icon, title, desc }) => (
                            <div
                                key={title}
                                className="bg-card rounded-2xl border p-6 transition-shadow hover:shadow-md"
                            >
                                <div className="bg-primary-brand/10 text-primary-brand mb-4 flex size-12 items-center justify-center rounded-xl">
                                    <Icon className="size-6" />
                                </div>
                                <h3 className="text-foreground text-lg font-semibold">{title}</h3>
                                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How We Work */}
            <section className="px-5 py-16 md:py-24">
                <div className="mx-auto max-w-[760px]">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary-brand/10 text-primary-brand flex size-12 items-center justify-center rounded-xl">
                            <Globe className="size-6" />
                        </div>
                        <h2 className="text-foreground text-3xl font-bold tracking-tight md:text-4xl">
                            {t("donations.how_we_work.title")}
                        </h2>
                    </div>
                    <Separator className="my-6" />
                    <div className="text-muted-foreground space-y-5 text-[1.05rem] leading-relaxed">
                        <p>{t("donations.how_we_work.p1")}</p>
                        <p>{t("donations.how_we_work.p2")}</p>
                        <div className="bg-primary-brand/5 border-primary-brand/20 flex items-start gap-4 rounded-xl border p-5">
                            <MessageCircleHeart className="text-primary-brand mt-0.5 size-6 shrink-0" />
                            <div>
                                <p className="text-foreground font-medium">{t("donations.how_we_work.p3")}</p>
                                <p className="mt-2 text-sm">{t("donations.how_we_work.p4")}</p>
                            </div>
                        </div>
                        <p className="text-foreground font-medium italic">{t("donations.how_we_work.p5")}</p>
                    </div>
                </div>
            </section>

            {/* Donate CTA */}
            <section className="bg-primary-brand px-5 py-16 text-white md:py-24">
                <div className="mx-auto max-w-[700px] text-center">
                    <Heart className="mx-auto mb-4 size-10 opacity-80" />
                    <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{t("donations.donate.title")}</h2>
                    <p className="mx-auto mt-4 max-w-[500px] text-lg text-white/80">{t("donations.donate.subtitle")}</p>

                    <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium">
                        <Users className="size-4" />
                        {t("donations.donate.supporters", { count: 6 })}
                    </div>

                    {/* Primary CTA */}
                    <div className="mt-8">
                        <a href="https://pomagam.pl/rw9bkc" target="_blank" rel="noopener noreferrer">
                            <Button
                                size="lg"
                                className="gap-2 bg-white text-base font-semibold text-teal-700 shadow-lg hover:bg-white/90"
                            >
                                {t("donations.donate.cta")}
                                <ArrowRight className="size-5" />
                            </Button>
                        </a>
                    </div>

                    {/* Divider */}
                    <div className="mx-auto mt-10 flex max-w-xs items-center gap-3">
                        <div className="h-px flex-1 bg-white/20" />
                        <span className="text-sm tracking-wider text-white/50 uppercase">
                            {t("donations.donate.or")}
                        </span>
                        <div className="h-px flex-1 bg-white/20" />
                    </div>

                    {/* Bank transfer */}
                    <div className="mx-auto mt-8 max-w-md rounded-2xl bg-white/10 p-6 backdrop-blur-sm">
                        <p className="mb-3 text-sm font-medium tracking-wider text-white/60 uppercase">
                            {t("donations.donate.bank_title")}
                        </p>
                        <p className="font-mono text-lg font-bold tracking-wider">62 1870 1045 2083 1080 5210 0001</p>
                        <button
                            onClick={handleCopyAccount}
                            className="mt-3 inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-white/15 px-3 py-1.5 text-sm font-medium transition-colors hover:bg-white/25"
                        >
                            <Copy className="size-3.5" />
                            {t("donations.donate.copy_account")}
                        </button>
                    </div>

                    {/* pomagam.pl link */}
                    <a
                        href="https://pomagam.pl/rw9bkc"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-6 inline-flex items-center gap-1.5 text-sm text-white/70 underline-offset-4 transition-colors hover:text-white hover:underline"
                    >
                        pomagam.pl/rw9bkc
                        <ExternalLink className="size-3.5" />
                    </a>
                </div>
            </section>
        </div>
    );
};

export default DonationsScreen;
