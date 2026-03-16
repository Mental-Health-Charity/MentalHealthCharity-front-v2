import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Link as ReactRouterLink } from "react-router-dom";
import ScrollIndicator from "../modules/shared/components/ScrollIndicator";

const MenteeFormGettingStartedScreen = () => {
    const { t } = useTranslation();

    return (
        <>
            {/* HEADER */}
            <div className="from-primary-brand to-primary-brand-dark bg-gradient-to-br px-5 pt-[160px] pb-[120px] text-white">
                <div className="mx-auto max-w-[768px]">
                    <h1 className="text-3xl font-extrabold">{t("mentee_form_getting_started_screen.header.title")}</h1>

                    <p className="mt-4 max-w-[520px] text-white/90">
                        {t("mentee_form_getting_started_screen.header.subtitle")}
                    </p>
                </div>
            </div>

            {/* CONTENT */}
            <div className="mx-auto -mt-12 max-w-[768px] px-4 pb-20">
                <div className="border-border bg-card rounded-xl border p-6 shadow-sm md:p-10">
                    <div className="flex flex-col gap-6">
                        <p className="text-foreground font-bold">
                            {t("mentee_form_getting_started_screen.content.p1")}
                        </p>

                        <p className="text-foreground">{t("mentee_form_getting_started_screen.content.p2")}</p>

                        <p className="text-foreground">{t("mentee_form_getting_started_screen.content.p3")}</p>

                        <div>
                            <p className="text-foreground mb-2 font-bold">
                                {t("mentee_form_getting_started_screen.content.chat_section.title")}
                            </p>

                            <div className="flex flex-col gap-4">
                                <p className="text-foreground">
                                    {t("mentee_form_getting_started_screen.content.chat_section.p4")}
                                </p>

                                <p className="text-foreground">
                                    {t("mentee_form_getting_started_screen.content.chat_section.p5")}
                                </p>

                                <p className="text-foreground">
                                    {t("mentee_form_getting_started_screen.content.chat_section.p6")}
                                </p>
                            </div>
                        </div>

                        <p className="text-foreground">{t("mentee_form_getting_started_screen.content.p7")}</p>

                        <p className="text-foreground">{t("mentee_form_getting_started_screen.content.p8")}</p>

                        {/* CTA SECTION */}
                        <div className="border-border mt-8 flex justify-center border-t pt-8">
                            <Button className="w-full" render={<ReactRouterLink to="/form/mentee" />}>
                                {t("homepage.chat_now")}
                            </Button>
                        </div>
                    </div>
                </div>

                <p className="text-muted-foreground mt-6 text-center text-sm">
                    {t("mentee_form_getting_started_screen.content.footer")}
                </p>

                <ScrollIndicator />
            </div>
        </>
    );
};

export default MenteeFormGettingStartedScreen;
