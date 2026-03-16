import { Phone, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";

const CrisisBar = () => {
    const { t } = useTranslation();

    return (
        <div className="bg-info-brand/15 border-info-brand/20 border-b px-4 py-2.5">
            <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-center gap-x-4 gap-y-1 text-center text-sm">
                <span className="flex items-center gap-1.5">
                    <ShieldCheck className="text-info-brand size-4" />
                    <span className="text-foreground font-medium">{t("crisis.banner_text")}</span>
                </span>
                <span className="flex items-center gap-1.5">
                    <Phone className="text-info-brand size-3.5" />
                    <a href="tel:112" className="text-info-brand font-bold hover:underline">
                        112
                    </a>
                    <span className="text-muted-foreground">({t("crisis.emergency")})</span>
                </span>
                <span className="flex items-center gap-1.5">
                    <Phone className="text-info-brand size-3.5" />
                    <a href="tel:116123" className="text-info-brand font-bold hover:underline">
                        116 123
                    </a>
                    <span className="text-muted-foreground">({t("crisis.helpline")})</span>
                </span>
            </div>
        </div>
    );
};

export default CrisisBar;
