import { Button } from "@/components/ui/button";
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
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
            <div className="bg-paper absolute rounded-[10px] p-4">
                <p className="text-text-body mb-5 text-xl">{status.text}</p>
                <Button onClick={() => window.location.reload()}>{t("common.try_again")}</Button>
            </div>
        </div>
    );
};

export default ConnectionModal;
