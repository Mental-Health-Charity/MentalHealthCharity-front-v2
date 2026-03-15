import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import dots from "../../../../assets/static/card_dots.svg";
import banner from "../../../../assets/static/hero_image.webp";
import waves from "../../../../assets/static/waves.svg";
import { useUser } from "../../../auth/components/AuthProvider";
import { getChatsQueryOptions } from "../../../chat/queries/getChatsQueryOptions";

const Hero = () => {
    const { t } = useTranslation();
    const { user } = useUser();
    const { data: chats } = useQuery(
        getChatsQueryOptions(
            { size: 50, page: 1 },
            {
                enabled: !!user,
                queryKey: ["chats"],
            }
        )
    );

    return (
        <div
            className="relative flex min-h-[800px] w-full items-center justify-center pt-0 md:pt-10"
            style={{
                backgroundImage: `url(${waves})`,
                backgroundSize: "cover",
                backgroundPosition: "top",
                backgroundRepeat: "no-repeat",
            }}
        >
            {/* Dots decoration (mobile only) */}
            <div
                className="pointer-events-none absolute bottom-0 left-2.5 z-[99] hidden size-20 max-md:block"
                style={{
                    backgroundImage: `url(${dots})`,
                    backgroundSize: "cover",
                    backgroundPosition: "top",
                    backgroundRepeat: "no-repeat",
                }}
            />

            <div className="relative flex w-full max-w-[1600px] flex-wrap items-center justify-between gap-5">
                {/* Hero Card */}
                <div className="bg-card relative z-[1] rounded-xl p-[30px] shadow-sm max-md:mx-5 max-md:flex max-md:flex-col max-md:items-center max-md:justify-center">
                    <main className="flex max-w-[520px] flex-col gap-2.5">
                        <h1 className="text-muted-foreground text-[28px] font-[550] md:text-[32px]">
                            {t("homepage.title")}
                        </h1>
                        <h2 className="text-muted-foreground w-full text-2xl font-normal">{t("homepage.desc")}</h2>
                    </main>

                    <div className="mt-6 flex flex-wrap gap-4 md:flex-nowrap">
                        {chats && chats.total > 0 ? (
                            <Link to="/chat/" className="w-full">
                                <Button className="w-full">{t("homepage.chat_now")}</Button>
                            </Link>
                        ) : (
                            <>
                                <Link to="/form/mentee-getting-started" className={cn("w-full md:w-auto")}>
                                    <Button className="w-full animate-[pulse-glow_2s_infinite] md:w-auto">
                                        {t("homepage.choose_mentee_button")}
                                    </Button>
                                </Link>
                                <Link to="/form/volunteer" className="w-full md:w-auto">
                                    <Button variant="outline" className="w-full md:w-auto">
                                        {t("homepage.choose_volunteer_button")}
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                {/* Hero Image */}
                <div className="absolute right-0 hidden h-[525px] w-auto items-center justify-center overflow-hidden rounded-xl shadow-[0_4px_4px_rgba(0,0,0,0.25)] lg:flex">
                    <img
                        loading="lazy"
                        src={banner}
                        width="1003"
                        height="565"
                        alt="Fundacja peryskop baner"
                        className="size-full object-cover"
                    />
                </div>
            </div>
        </div>
    );
};

export default Hero;
