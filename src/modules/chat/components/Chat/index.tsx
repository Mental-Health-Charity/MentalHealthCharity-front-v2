import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import SendIcon from "@mui/icons-material/Send";
import {
    Box,
    Button,
    CircularProgress,
    IconButton,
    TextField,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { useFormik } from "formik";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ReadyState } from "react-use-websocket";
import { AutoSizer, CellMeasurer, CellMeasurerCache, List, ListRowProps } from "react-virtualized";
import type { CellMeasurerChildProps } from "react-virtualized/dist/es/CellMeasurer";
import * as Yup from "yup";
import { useUser } from "../../../auth/components/AuthProvider";
import EmojiPicker from "../../../shared/components/EmojiPicker";
import Loader from "../../../shared/components/Loader";
import Skeleton from "../../../shared/components/Skeleton";
import { Permissions } from "../../../shared/constants";
import usePermissions from "../../../shared/hooks/usePermissions";
import { translatedConnectionStatus } from "../../constants";
import { HistoryPaginationState } from "../../hooks/useChat";
import { Chat as ChatType, ConnectionStatus, Message } from "../../types";
import CloseChatModal from "../CloseChatModal";
import ConnectionModal from "../ConnectionModal";
import ChatMessage from "../Message";
import { StyledAlert } from "./style";

/** Threshold (in pixels) from the top to trigger loading more messages */
const LOAD_MORE_THRESHOLD = 200;

/** Estimated row height for initial rendering before measurement */
const ESTIMATED_ROW_HEIGHT = 100;

interface Props {
    chat?: ChatType;
    onSendMessage: (message: string) => void;
    onDeleteMessage: (id: number) => void;
    messages: Message[];
    status: ConnectionStatus;
    onShowDetails?: () => void;
    onCloseChat: (chat: ChatType) => void;
    onLoadMoreMessages?: () => Promise<void>;
    historyState?: HistoryPaginationState;
}

const Chat = ({
    chat,
    messages,
    onSendMessage,
    onShowDetails,
    status,
    onDeleteMessage,
    onCloseChat,
    onLoadMoreMessages,
    historyState,
}: Props) => {
    const theme = useTheme();
    const { t } = useTranslation();
    const { user } = useUser();
    const textFieldRef = useRef<HTMLInputElement | null>(null);
    const listRef = useRef<List | null>(null);
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const validationSchema = Yup.object({
        message: Yup.string().max(1500).required(),
    });
    const [showChatCloseModal, setShowChatCloseModal] = useState(false);
    const { hasPermissions } = usePermissions();

    // Track if we should scroll to bottom (for new messages)
    const shouldScrollToBottomRef = useRef(true);
    const prevMessagesLengthRef = useRef(0);

    // Track if initial scroll to bottom has been done
    const [initialScrollDone, setInitialScrollDone] = useState(false);

    // Track scroll position for maintaining position when loading older messages
    const scrollPositionRef = useRef<{ scrollTop: number; scrollHeight: number } | null>(null);

    // Reverse messages so oldest are at index 0, newest at end (natural chat order)
    const reversedMessages = useMemo(() => [...messages].reverse(), [messages]);

    // Cache for measuring dynamic row heights
    const cacheRef = useRef(
        new CellMeasurerCache({
            fixedWidth: true,
            defaultHeight: ESTIMATED_ROW_HEIGHT,
        })
    );

    const canEditChat = chat && !chat.is_supervisor_chat && user && hasPermissions(Permissions.EDIT_CHAT_DATA);

    // formik initialization
    const formik = useFormik({
        initialValues: {
            message: "",
        },
        validationSchema,
        onSubmit: (values, { resetForm }) => {
            onSendMessage(values.message);
            resetForm();
            // Scroll to bottom when sending a message
            shouldScrollToBottomRef.current = true;
        },
    });

    // Clear cache when messages change significantly (different chat)
    useEffect(() => {
        if (chat?.id) {
            cacheRef.current.clearAll();
            shouldScrollToBottomRef.current = true;
            setInitialScrollDone(false);
            prevMessagesLengthRef.current = 0;
        }
    }, [chat?.id]);

    // Handle scrolling when new messages arrive or older messages are loaded
    useEffect(() => {
        if (listRef.current && reversedMessages.length > 0) {
            const prevLength = prevMessagesLengthRef.current;
            const newLength = reversedMessages.length;

            // Clear cache for proper re-measurement
            cacheRef.current.clearAll();
            listRef.current.recomputeRowHeights();

            if (newLength > prevLength && prevLength > 0) {
                const addedCount = newLength - prevLength;

                // Check if this is a new message at the end (WebSocket) or older messages at the start
                if (shouldScrollToBottomRef.current) {
                    // New message arrived - scroll to bottom (last index)
                    listRef.current.scrollToRow(reversedMessages.length - 1);
                } else {
                    // Older messages loaded - maintain scroll position
                    // Scroll to the row that keeps the previously visible content in view
                    listRef.current.scrollToRow(addedCount);
                }
            } else if (prevLength === 0 && newLength > 0) {
                // Initial load - scroll to bottom after a brief delay to let measurements complete
                setTimeout(() => {
                    if (listRef.current) {
                        listRef.current.scrollToRow(reversedMessages.length - 1);
                        setInitialScrollDone(true);
                    }
                }, 50);
            }

            prevMessagesLengthRef.current = newLength;
        }
    }, [reversedMessages.length]);

    /**
     * Handle scroll events to trigger loading more messages
     * and track scroll position for auto-scroll behavior
     */
    const handleScroll = useCallback(
        ({
            scrollTop,
            scrollHeight,
            clientHeight,
        }: {
            scrollTop: number;
            scrollHeight: number;
            clientHeight: number;
        }) => {
            // Save scroll position for maintaining position when loading older messages
            scrollPositionRef.current = { scrollTop, scrollHeight };

            // User is near the TOP - load older messages (natural scroll direction)
            if (scrollTop < LOAD_MORE_THRESHOLD) {
                if (onLoadMoreMessages && historyState && !historyState.isLoadingHistory && historyState.hasMore) {
                    onLoadMoreMessages().catch((error) => {
                        console.error("Failed to load more messages:", error);
                    });
                }
            }

            // Track if user is at the bottom (viewing newest messages)
            // User is at bottom when scrollTop + clientHeight is near scrollHeight
            const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
            shouldScrollToBottomRef.current = distanceFromBottom < 100;
        },
        [onLoadMoreMessages, historyState]
    );

    /**
     * Render a single message row with dynamic height measurement
     */
    const rowRenderer = useCallback(
        ({ index, key, parent, style }: ListRowProps) => {
            const message = reversedMessages[index];

            if (!message) {
                return null;
            }

            return (
                <CellMeasurer cache={cacheRef.current} columnIndex={0} key={key} parent={parent} rowIndex={index}>
                    {({ registerChild, measure }: CellMeasurerChildProps) => (
                        <div
                            ref={(el) => {
                                if (el) registerChild?.(el);
                            }}
                            style={{
                                ...style,
                                paddingBottom: "10px",
                            }}
                            onLoad={measure}
                        >
                            <ChatMessage onDeleteMessage={onDeleteMessage} message={message} />
                        </div>
                    )}
                </CellMeasurer>
            );
        },
        [reversedMessages, onDeleteMessage]
    );

    /**
     * Render loading indicator at the top of the list
     */
    const renderLoadingIndicator = () => {
        if (!historyState?.isLoadingHistory) {
            return null;
        }

        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    padding: "16px",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 10,
                    background: `linear-gradient(180deg, ${theme.palette.background.paper} 0%, transparent 100%)`,
                }}
            >
                <CircularProgress size={24} />
            </Box>
        );
    };

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
                    position: "relative",
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
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Button onClick={() => setShowChatCloseModal(true)} variant="contained" color="error">
                        <ReportProblemIcon sx={{ marginRight: "5px" }} />
                        {t("chat.close_chat")}
                    </Button>
                    {onShowDetails && (
                        <IconButton onClick={onShowDetails}>
                            <PeopleAltIcon />
                        </IconButton>
                    )}
                </Box>
                {status.state !== ReadyState.OPEN && (
                    <StyledAlert variant={status.state === ReadyState.CONNECTING ? "info" : "danger"}>
                        {translatedConnectionStatus[status.state]}
                    </StyledAlert>
                )}
            </Box>

            <Box
                sx={{
                    width: "100%",
                    height: "70vh",
                    position: "relative",
                }}
            >
                {renderLoadingIndicator()}
                {reversedMessages && reversedMessages.length > 0 ? (
                    <AutoSizer>
                        {({ height, width }: { height: number; width: number }) => (
                            <List
                                ref={listRef}
                                height={height}
                                width={width}
                                rowCount={reversedMessages.length}
                                rowHeight={cacheRef.current.rowHeight}
                                rowRenderer={rowRenderer}
                                deferredMeasurementCache={cacheRef.current}
                                onScroll={handleScroll}
                                overscanRowCount={5}
                                scrollToIndex={!initialScrollDone ? reversedMessages.length - 1 : undefined}
                                scrollToAlignment={!initialScrollDone ? "end" : undefined}
                                style={{
                                    outline: "none",
                                    padding: isMobile ? "0" : "10px 15px 10px 0",
                                }}
                            />
                        )}
                    </AutoSizer>
                ) : reversedMessages && reversedMessages.length === 0 ? (
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "100%",
                        }}
                    >
                        <Typography color="text.secondary">{t("chat.no_messages")}</Typography>
                    </Box>
                ) : (
                    <Loader />
                )}
            </Box>

            {!chat?.is_active ? (
                <Box
                    sx={{
                        backgroundColor: `${theme.palette.error.main}1b`,
                        padding: "20px",
                        borderRadius: "8px",
                        textAlign: "center",
                        border: `1px solid ${theme.palette.error.main}`,
                    }}
                >
                    <Typography color="error" fontWeight="bold" textAlign="center">
                        {t("chat.chat_closed")}
                    </Typography>
                </Box>
            ) : (
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
                        <EmojiPicker
                            onChange={(val) => formik.setFieldValue("message", val)}
                            textFieldRef={textFieldRef}
                        />
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
            )}
            <ConnectionModal status={status} />
            {canEditChat && (
                <CloseChatModal
                    open={showChatCloseModal}
                    onClose={() => setShowChatCloseModal(false)}
                    onConfirm={() => {
                        onCloseChat(chat);
                        setShowChatCloseModal(false);
                    }}
                />
            )}
        </Box>
    );
};

export default Chat;
