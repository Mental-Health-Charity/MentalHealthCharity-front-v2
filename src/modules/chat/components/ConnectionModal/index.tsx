import { Box, Button, Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { ReadyState } from "react-use-websocket";
import { Permissions } from "../../../shared/constants";
import usePermissions from "../../../shared/hooks/usePermissions";
import { ConnectionStatus } from "../../types";

interface Props {
    status: ConnectionStatus;
}

const ConnectionModal = ({ status }: Props) => {
    const theme = useTheme();
    const { t } = useTranslation();
    const { hasPermissions } = usePermissions();

    if (hasPermissions(Permissions.MANAGE_CHATS)) {
        return null;
    }

    if (status.state === ReadyState.OPEN || status.state === ReadyState.CONNECTING) {
        return null;
    }

    return (
        <Box
            sx={{
                position: "absolute",
                height: "100%",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0, 0, 0, 0.2)",
                left: 0,
                top: 0,
                backdropFilter: "blur(2px)",
            }}
        >
            <Box
                sx={{
                    position: "absolute",
                    backgroundColor: theme.palette.background.paper,
                    padding: "15px",
                    borderRadius: "10px",
                }}
            >
                <Typography
                    sx={{
                        fontSize: "20px",
                        marginBottom: "20px",
                    }}
                >
                    {status.text}
                </Typography>
                <Button
                    onClick={() => window.location.reload()}
                    sx={{
                        padding: "5px 20px",
                    }}
                    variant="contained"
                >
                    {t("common.try_again")}
                </Button>
            </Box>
        </Box>
    );
};

export default ConnectionModal;
