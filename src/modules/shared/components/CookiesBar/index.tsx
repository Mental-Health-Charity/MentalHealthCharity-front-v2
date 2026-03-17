import { Button } from "@/components/ui/button";
import { Cookie } from "lucide-react";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import InternalLink from "../InternalLink";

const CookiesBar = () => {
    const { t } = useTranslation();
    const cookiesAccepted = localStorage.getItem("cookiesAccepted");
    const [isOpen, setIsOpen] = useState(cookiesAccepted === null);

    const handleAcceptCookies = useCallback(() => {
        localStorage.setItem("cookiesAccepted", "true");
        setIsOpen(false);
    }, []);

    if (!isOpen) return null;

    return (
        <div className="bg-background text-foreground fixed bottom-0 left-0 z-[9999] w-full p-2 opacity-90 transition-opacity hover:opacity-100">
            <div className="mx-auto max-w-screen-xl px-4">
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                    <p className="text-foreground inline-flex flex-wrap items-center gap-2.5 text-sm">
                        <Cookie className="size-5" />
                        {t("common.cookies_message")}
                        <InternalLink color="secondary" to="/tos">
                            {t("common.cookies_policy")}
                        </InternalLink>
                    </p>
                    <Button size="sm" onClick={handleAcceptCookies}>
                        {t("common.accept_cookies")}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CookiesBar;
