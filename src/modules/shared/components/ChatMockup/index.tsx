import { cn } from "@/lib/utils";
import { CheckCircle, Send } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useInView } from "../../../../hooks/useInView";
import AnimatedSection from "../AnimatedSection";

const ChatMockup = () => {
    const { t } = useTranslation();
    const { ref, isInView } = useInView();

    const features = [
        t("homepage.chat_mockup.feature1"),
        t("homepage.chat_mockup.feature2"),
        t("homepage.chat_mockup.feature3"),
    ];

    const messages = [
        { own: false, text: t("homepage.chat_mockup.mock_msg1") },
        { own: true, text: t("homepage.chat_mockup.mock_msg2") },
        { own: false, text: t("homepage.chat_mockup.mock_msg3") },
        { own: true, text: t("homepage.chat_mockup.mock_msg4") },
    ];

    return (
        <section className="bg-muted/30 py-20 md:py-28">
            <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-12 px-5 md:flex-row md:gap-16">
                {/* Left: text */}
                <AnimatedSection as="div" className="flex-1">
                    <h2 className="text-foreground mb-6 text-3xl font-bold md:text-4xl">
                        {t("homepage.chat_mockup.title")}
                    </h2>
                    <ul className="space-y-4">
                        {features.map((feature) => (
                            <li key={feature} className="text-muted-foreground flex items-start gap-3 text-base">
                                <CheckCircle className="text-primary-brand mt-0.5 size-5 shrink-0" />
                                {feature}
                            </li>
                        ))}
                    </ul>
                </AnimatedSection>

                {/* Right: chat mockup */}
                <div ref={ref} className="w-full max-w-[420px] flex-1">
                    <div className="bg-card overflow-hidden rounded-2xl border shadow-xl">
                        {/* Header */}
                        <div className="bg-primary-brand flex items-center gap-3 px-5 py-3.5">
                            <div className="flex size-9 items-center justify-center rounded-full bg-white/20 text-sm font-bold text-white">
                                A
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-white">
                                    {t("homepage.chat_mockup.mock_name")}
                                </p>
                                <p className="text-xs text-white/70">Online</p>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="space-y-3 px-4 py-5">
                            {messages.map(({ own, text }, i) => (
                                <div
                                    key={i}
                                    className={cn(
                                        "flex",
                                        own ? "justify-end" : "justify-start",
                                        isInView && (own ? "animate-slide-in-right" : "animate-slide-in-left"),
                                        !isInView && "opacity-0"
                                    )}
                                    style={{ animationDelay: isInView ? `${i * 0.2 + 0.3}s` : undefined }}
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
            </div>
        </section>
    );
};

export default ChatMockup;
