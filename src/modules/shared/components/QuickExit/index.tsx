import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";

const SAFE_URL = "https://www.google.com";

const QuickExit = () => {
    const { t } = useTranslation();

    const handleExit = useCallback(() => {
        window.location.replace(SAFE_URL);
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                handleExit();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleExit]);

    return (
        <Button
            onClick={handleExit}
            variant="destructive"
            size="sm"
            className="fixed top-3 right-3 z-[100] gap-1.5 rounded-full shadow-lg"
        >
            <LogOut className="size-4" />
            {t("crisis.quick_exit")}
        </Button>
    );
};

export default QuickExit;
