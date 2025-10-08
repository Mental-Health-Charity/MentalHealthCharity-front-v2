import type { ModalProps } from "@mui/material";
import { Box, Button, LinearProgress, List, ListItem, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Modal from "../../../shared/components/Modal";

interface Props extends Omit<ModalProps, "children"> {
    onConfirm: () => void;
}

const WAIT_TIME = 5_000;

const CloseChatModal = ({ onConfirm, ...rest }: Props) => {
    const { t } = useTranslation();
    const [progress, setProgress] = useState(0);
    const [canConfirm, setCanConfirm] = useState(false);

    useEffect(() => {
        if (!rest.open) return;
        setProgress(0);
        setCanConfirm(false);

        const start = Date.now();
        const timer = setInterval(() => {
            const elapsed = Date.now() - start;
            const percent = Math.min((elapsed / WAIT_TIME) * 100, 100);
            setProgress(percent);

            if (percent >= 100) {
                clearInterval(timer);
                setCanConfirm(true);
            }
        }, 100);

        return () => clearInterval(timer);
    }, [rest.open]);

    return (
        <Modal {...rest} title={t("chat.close_chat_confirmation")}>
            <Box sx={{ maxWidth: 500 }} display="flex" flexDirection="column" gap={3}>
                <Typography
                    sx={{
                        opacity: 0.7,
                    }}
                    variant="body1"
                >
                    {t("chat.close_chat_confirmation_text_1")}
                </Typography>

                <Box>
                    <Typography variant="subtitle1" fontWeight={600}>
                        {t("chat.close_chat_when_title")}
                    </Typography>
                    <List sx={{ listStyleType: "disc", pl: 4, opacity: 0.7 }}>
                        <ListItem sx={{ display: "list-item" }}>{t("chat.close_reasons.close_chat_reason_1")}</ListItem>
                        <ListItem sx={{ display: "list-item" }}>{t("chat.close_reasons.close_chat_reason_2")}</ListItem>
                        <ListItem sx={{ display: "list-item" }}>{t("chat.close_reasons.close_chat_reason_3")}</ListItem>
                    </List>
                </Box>

                <Box position="relative" mt={2}>
                    <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{
                            height: 4,
                            borderRadius: 2,
                            mb: 1,
                            bgcolor: "action.hover",
                            "& .MuiLinearProgress-bar": {
                                transition: "width 0.1s linear",
                            },
                        }}
                    />

                    <Button
                        fullWidth
                        variant="contained"
                        color="error"
                        disabled={!canConfirm}
                        onClick={onConfirm}
                        sx={{
                            transition: "opacity 0.3s",
                            opacity: canConfirm ? 1 : 0.6,
                            fontWeight: 600,
                        }}
                    >
                        {canConfirm
                            ? t("chat.close_chat_button_confirm", "Zamknij czat")
                            : t("chat.close_chat_button_wait", "Poczekaj...")}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default CloseChatModal;
