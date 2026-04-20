import { ScrollText, X } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Props {
    onClose: () => void;
}

const HelpRulesSidebar = ({ onClose }: Props) => {
    const { t } = useTranslation();

    return (
        <div className="border-border/50 bg-card flex h-full w-[320px] shrink-0 flex-col border-l">
            <div className="border-border/50 flex h-16 items-center justify-between border-b px-4">
                <div className="flex items-center gap-2.5">
                    <ScrollText className="text-primary-brand size-5" />
                    <h3 className="text-foreground text-sm font-semibold">{t("chat.help_rules")}</h3>
                </div>
                <button
                    onClick={onClose}
                    className="text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg p-1.5 transition-colors"
                    aria-label={t("common.close", { defaultValue: "Close" })}
                >
                    <X className="size-4" />
                </button>
            </div>

            <div className="flex-1 overflow-auto p-4">
                <div className="border-border bg-muted/40 rounded-xl border p-4">
                    <p className="text-muted-foreground text-sm leading-relaxed">{t("chat.help_rules_placeholder")}</p>
                </div>
            </div>
        </div>
    );
};

export default HelpRulesSidebar;
