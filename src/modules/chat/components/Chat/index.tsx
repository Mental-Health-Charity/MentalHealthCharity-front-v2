import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import SendIcon from "@mui/icons-material/Send";
import { Box, Button, IconButton, TextField, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useFormik } from "formik";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { useUser } from "../../../auth/components/AuthProvider";
import EmojiPicker from "../../../shared/components/EmojiPicker";
import Loader from "../../../shared/components/Loader";
import Skeleton from "../../../shared/components/Skeleton";
import { Chat as ChatType, ConnectionStatus, Message } from "../../types";
import ConnectionModal from "../ConnectionModal";
import ChatMessage from "../Message";

interface Props {
    chat?: ChatType;
    onSendMessage: (message: string) => void;
    messages: Message[];
    status: ConnectionStatus;
    onShowDetails?: () => void;
}

const Chat = ({ chat, messages, onSendMessage, onShowDetails, status }: Props) => {
    const theme = useTheme();
    const { t } = useTranslation();
    const { user } = useUser();
    const textFieldRef = useRef<HTMLInputElement | null>(null);
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const validationSchema = Yup.object({
        message: Yup.string().max(1500).required(),
    });

    // formik initialization
    const formik = useFormik({
        initialValues: {
            message: "",
        },
        validationSchema,
        onSubmit: (values, { resetForm }) => {
            onSendMessage(values.message);
            resetForm();
        },
    });

    return (
        <Box
            sx={{
                backgroundColor: theme.palette.background.paper,
                width: "100%",
                height: "100%",
                display: "flex",
                gap: "15px",
                padding: { xs: "5px", md: "15px" },
                borderRadius: "10px",
                flexDirection: "column",
                position: "relative",
            }}
        >
            <Box
                sx={{
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                {chat ? (
                    <Typography
                        sx={{
                            fontSize: "20px",
                            fontWeight: 600,
                        }}
                    >
                        {chat.name}
                    </Typography>
                ) : (
                    <Skeleton />
                )}
                {onShowDetails && (
                    <IconButton onClick={onShowDetails}>
                        <PeopleAltIcon />
                    </IconButton>
                )}
            </Box>

            <Box
                sx={{
                    width: "100%",
                    gap: { md: "10px", xs: "5px" },
                    display: "flex",
                    flexDirection: "column-reverse",
                    height: "70vh",
                    overflowY: "auto",
                    padding: { xs: "0", md: "10px 15px 10px 0" },
                }}
            >
                {messages ? messages.map((message) => <ChatMessage message={message} key={message.id} />) : <Loader />}
            </Box>

            <Box sx={{ display: "flex", gap: "20px", alignItems: "center", position: "relative" }}>
                <TextField
                    slotProps={{
                        htmlInput: {
                            maxLength: 1500,
                        },
                    }}
                    fullWidth
                    variant="filled"
                    disabled={!chat || !user || !chat.participants.some((p) => p.id === user.id)}
                    label={t("chat.enter_message_label")}
                    name="message"
                    value={formik.values.message}
                    onChange={(e) => formik.setFieldValue("message", e.target.value)}
                    onBlur={formik.handleBlur}
                    inputRef={textFieldRef}
                    onKeyDown={(event) => {
                        if (event.key === "Enter") {
                            formik.handleSubmit();
                            event.preventDefault();
                        }
                    }}
                />

                <Box
                    sx={{
                        display: { xs: "none", md: "flex" },
                    }}
                >
                    <EmojiPicker onChange={(val) => formik.setFieldValue("message", val)} textFieldRef={textFieldRef} />
                </Box>

                <Button
                    sx={{
                        gap: "10px",
                        height: "100%",
                    }}
                    variant="contained"
                    onClick={() => formik.handleSubmit()}
                >
                    {!isMobile && t("chat.send")}{" "}
                    <SendIcon
                        sx={{
                            marginTop: "-3px",
                        }}
                    />
                </Button>
            </Box>
            <ConnectionModal status={status} />
        </Box>
    );
};

export default Chat;
