import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { CheckCircle, Clock, Send } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useUser } from "../../../auth/components/AuthProvider";
import { getChatsQueryOptions } from "../../../chat/queries/getChatsQueryOptions";
import { SessionStorage } from "../../types";

interface MockMessage {
    own: boolean;
    text: string;
}

interface MockConversation {
    name: string;
    initial: string;
    messages: MockMessage[];
}

const Hero = () => {
    const { t } = useTranslation();
    const { user } = useUser();
    const { data: chats, isLoading: isChatsLoading } = useQuery(
        getChatsQueryOptions(
            { size: 50, page: 1 },
            {
                enabled: !!user,
                queryKey: ["chats"],
            }
        )
    );

    const conversations: MockConversation[] = [
        {
            name: t("homepage.chat_mockup.mock_name"),
            initial: "A",
            messages: [
                { own: false, text: t("homepage.chat_mockup.mock_msg1") },
                { own: true, text: t("homepage.chat_mockup.mock_msg2") },
                { own: false, text: t("homepage.chat_mockup.mock_msg3") },
                { own: true, text: t("homepage.chat_mockup.mock_msg4") },
            ],
        },
        {
            name: t("homepage.chat_mockup.conv2_name"),
            initial: "M",
            messages: [
                { own: false, text: t("homepage.chat_mockup.conv2_msg1") },
                { own: true, text: t("homepage.chat_mockup.conv2_msg2") },
                { own: false, text: t("homepage.chat_mockup.conv2_msg3") },
                { own: true, text: t("homepage.chat_mockup.conv2_msg4") },
            ],
        },
        {
            name: t("homepage.chat_mockup.conv3_name"),
            initial: "K",
            messages: [
                { own: false, text: t("homepage.chat_mockup.conv3_msg1") },
                { own: true, text: t("homepage.chat_mockup.conv3_msg2") },
                { own: false, text: t("homepage.chat_mockup.conv3_msg3") },
                { own: true, text: t("homepage.chat_mockup.conv3_msg4") },
            ],
        },
    ];

    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000, stopOnInteraction: true })]);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on("select", onSelect);
        return () => {
            emblaApi.off("select", onSelect);
        };
    }, [emblaApi, onSelect]);

    const trustBadges = [t("homepage.trust_free"), t("homepage.trust_anonymous"), t("homepage.trust_safe")];

    const isFormSent = localStorage.getItem(SessionStorage.SEND_FORM) === "true";
    const hasNoChats = !chats || chats.total === 0;
    const isProcessing = !!user && isFormSent && hasNoChats && !isChatsLoading; // User has sent the form, there are no chats, and we're not currently loading chats (which means we've already loaded and confirmed there are no chats)

    return (
        <section className="from-primary-brand-50 bg-gradient-to-b to-transparent">
            <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-10 px-5 pt-16 pb-20 md:flex-row md:gap-16 md:pt-24 md:pb-32">
                {/* Text content */}
                <div className="flex flex-1 flex-col items-center text-center md:items-start md:text-left">
                    <h1 className="text-foreground text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl lg:leading-[1.1]">
                        {t("homepage.title")}
                    </h1>
                    <p className="text-muted-foreground mt-5 max-w-[520px] text-lg md:text-xl">{t("homepage.desc")}</p>

                    {isProcessing && (
                        <div className="border-primary-brand/20 bg-primary-brand/5 mt-8 w-full rounded-2xl border p-5 md:max-w-[440px]">
                            <div className="flex items-start gap-3.5">
                                <div className="bg-primary-brand/10 flex size-10 shrink-0 items-center justify-center rounded-full">
                                    <Clock className="text-primary-brand size-5" />
                                </div>
                                <div>
                                    <p className="text-foreground text-sm font-semibold">
                                        {t("homepage.processing.title")}
                                    </p>
                                    <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                                        {t("homepage.processing.description")}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mt-8 flex w-full flex-wrap justify-center gap-3 md:justify-start">
                        {chats && chats.total > 0 ? (
                            <Link to="/chat/" className="w-full md:w-auto">
                                <Button size="lg" className="animate-gentle-pulse w-full md:w-auto">
                                    {t("homepage.chat_now")}
                                </Button>
                            </Link>
                        ) : (
                            <>
                                <Link to="/form/mentee-getting-started" className={cn("w-full md:w-auto")}>
                                    <Button size="lg" className="animate-gentle-pulse w-full md:w-auto">
                                        {t("homepage.choose_mentee_button")}
                                    </Button>
                                </Link>
                                <Link to="/form/volunteer" className="w-full md:w-auto">
                                    <Button size="lg" variant="outline" className="w-full md:w-auto">
                                        {t("homepage.choose_volunteer_button")}
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Trust badges */}
                    <div className="mt-6 flex flex-wrap justify-center gap-4 md:justify-start">
                        {trustBadges.map((badge) => (
                            <span
                                key={badge}
                                className="text-muted-foreground flex items-center gap-1.5 text-sm font-medium"
                            >
                                <CheckCircle className="text-primary-brand size-4" />
                                {badge}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Chat Carousel */}
                <div className="w-full max-w-[420px] flex-1">
                    <div ref={emblaRef} className="overflow-hidden rounded-2xl shadow-xl">
                        <div className="flex">
                            {conversations.map((conv, convIdx) => (
                                <div key={convIdx} className="min-w-0 flex-[0_0_100%]">
                                    <div className="bg-card">
                                        {/* Chat header */}
                                        <div className="bg-primary-brand flex items-center gap-3 px-5 py-3.5">
                                            <div className="flex size-9 items-center justify-center rounded-full bg-white/20 text-sm font-bold text-white">
                                                {conv.initial}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-white">{conv.name}</p>
                                                <p className="text-xs text-white/70">Online</p>
                                            </div>
                                        </div>

                                        {/* Messages */}
                                        <div className="space-y-3 px-4 py-5">
                                            {conv.messages.map(({ own, text }, msgIdx) => (
                                                <div
                                                    key={msgIdx}
                                                    className={cn(
                                                        "flex transition-all duration-500",
                                                        own ? "justify-end" : "justify-start",
                                                        selectedIndex === convIdx
                                                            ? "translate-y-0 opacity-100"
                                                            : "translate-y-2 opacity-0"
                                                    )}
                                                    style={{
                                                        transitionDelay:
                                                            selectedIndex === convIdx
                                                                ? `${msgIdx * 150 + 200}ms`
                                                                : "0ms",
                                                    }}
                                                >
                                                    <div
                                                        className={cn(
                                                            "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm",
                                                            own
                                                                ? "bg-primary-brand rounded-br-md text-white"
                                                                : "bg-muted text-foreground rounded-bl-md"
                                                        )}
                                                    >
                                                        {text}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Input bar */}
                                        <div className="border-border/50 flex items-center gap-2 border-t px-4 py-3">
                                            <div className="bg-muted/50 h-10 flex-1 rounded-full" />
                                            <div className="bg-primary-brand flex size-10 items-center justify-center rounded-full text-white">
                                                <Send className="size-4" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Carousel dots */}
                    <div className="mt-4 flex justify-center gap-2">
                        {conversations.map((_, idx) => (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => emblaApi?.scrollTo(idx)}
                                className={cn(
                                    "h-2 rounded-full transition-all duration-300",
                                    selectedIndex === idx ? "bg-primary-brand w-6" : "bg-primary-brand/30 w-2"
                                )}
                                aria-label={`Go to conversation ${idx + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
