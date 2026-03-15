import { Button } from "@/components/ui/button";
import { Loader2, WifiOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ReadyState } from "react-use-websocket";
import { Permissions } from "../../../shared/constants";
import usePermissions from "../../../shared/hooks/usePermissions";
import { ConnectionStatus } from "../../types";

interface Props {
    status: ConnectionStatus;
}

const ConnectionModal = ({ status }: Props) => {
    const { t } = useTranslation();
    const { hasPermissions } = usePermissions();

    if (hasPermissions(Permissions.MANAGE_CHATS)) {
        return null;
    }

    if (status.state === ReadyState.OPEN || status.state === ReadyState.CONNECTING) {
        return null;
    }

    return (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/20 backdrop-blur-sm">
            <div className="bg-card mx-4 flex max-w-sm flex-col items-center gap-4 rounded-2xl p-8 text-center shadow-lg">
                <div className="bg-destructive/10 flex size-14 items-center justify-center rounded-full">
                    <WifiOff className="text-destructive size-7" />
                </div>
                <p className="text-foreground text-lg font-semibold">
                    {t("chat.connection_lost", { defaultValue: "Connection lost" })}
                </p>
                <p className="text-muted-foreground text-sm">
                    {t("chat.reconnecting_automatically", {
                        defaultValue: "Attempting to reconnect automatically...",
                    })}
                </p>
                <Loader2 className="text-primary-brand size-5 animate-spin" />
                <Button variant="outline" className="mt-2" onClick={() => window.location.reload()}>
                    {t("common.try_again")}
                </Button>
            </div>
        </div>
    );
};

export default ConnectionModal;
