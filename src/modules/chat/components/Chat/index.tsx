import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFormik } from "formik";
import { AlertTriangle, Loader2, Send, Users } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ReadyState } from "react-use-websocket";
import { AutoSizer, CellMeasurer, CellMeasurerCache, List, ListRowProps } from "react-virtualized";
import type { CellMeasurerChildProps } from "react-virtualized/dist/es/CellMeasurer";
import * as Yup from "yup";
import { useIsMobile } from "../../../../hooks/useBreakpoint";
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

/** Threshold (in pixels) from the top to trigger loading more messages */
const LOAD_MORE_THRESHOLD = 200;

/** Estimated row height for initial rendering before measurement */
const ESTIMATED_ROW_HEIGHT = 100;

type AlertVariant = "danger" | "warning" | "info";

const alertVariantClasses: Record<AlertVariant, string> = {
    danger: "bg-destructive text-white",
    warning: "bg-warning-brand text-text-body",
    info: "bg-info-brand text-text-body",
};

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
    const { t } = useTranslation();
    const { user } = useUser();
    const textFieldRef = useRef<HTMLInputElement | null>(null);
    const listRef = useRef<List | null>(null);
    const isMobile = useIsMobile();
    const validationSchema = Yup.object({
        message: Yup.string().max(1500).required(),
    });
    const [showChatCloseModal, setShowChatCloseModal] = useState(false);
    const { hasPermissions } = usePermissions();

    const canReadChatHistory = hasPermissions(Permissions.CAN_READ_CHAT_HISTORY);

    const shouldScrollToBottomRef = useRef(true);
    const prevMessagesLengthRef = useRef(0);

    const [initialScrollDone, setInitialScrollDone] = useState(false);
    const [isNearTop, setIsNearTop] = useState(false);

    const scrollPositionRef = useRef<{ scrollTop: number; scrollHeight: number } | null>(null);

    const reversedMessages = useMemo(() => [...messages].reverse(), [messages]);

    const hasHiddenArchive = !canReadChatHistory && historyState && historyState.hasMore && isNearTop;

    const cacheRef = useRef(
        new CellMeasurerCache({
            fixedWidth: true,
            defaultHeight: ESTIMATED_ROW_HEIGHT,
        })
    );

    const canEditChat = chat && !chat.is_supervisor_chat && user && hasPermissions(Permissions.EDIT_CHAT_DATA);

    const formik = useFormik({
        initialValues: {
            message: "",
        },
        validationSchema,
        onSubmit: (values, { resetForm }) => {
            onSendMessage(values.message);
            resetForm();
            shouldScrollToBottomRef.current = true;
        },
    });

    useEffect(() => {
        if (chat?.id) {
            cacheRef.current.clearAll();
            shouldScrollToBottomRef.current = true;
            setInitialScrollDone(false);
            prevMessagesLengthRef.current = 0;
        }
    }, [chat?.id]);

    useEffect(() => {
        if (listRef.current && reversedMessages.length > 0) {
            const prevLength = prevMessagesLengthRef.current;
            const newLength = reversedMessages.length;

            cacheRef.current.clearAll();
            listRef.current.recomputeRowHeights();

            if (newLength > prevLength && prevLength > 0) {
                const addedCount = newLength - prevLength;

                if (shouldScrollToBottomRef.current) {
                    listRef.current.scrollToRow(reversedMessages.length - 1);
                } else {
                    listRef.current.scrollToRow(addedCount);
                }
            } else if (prevLength === 0 && newLength > 0) {
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
            scrollPositionRef.current = { scrollTop, scrollHeight };
            setIsNearTop(scrollTop < LOAD_MORE_THRESHOLD);

            if (scrollTop < LOAD_MORE_THRESHOLD && canReadChatHistory) {
                if (onLoadMoreMessages && historyState && !historyState.isLoadingHistory && historyState.hasMore) {
                    onLoadMoreMessages().catch((error) => {
                        console.error("Failed to load more messages:", error);
                    });
                }
            }

            const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
            shouldScrollToBottomRef.current = distanceFromBottom < 100;
        },
        [onLoadMoreMessages, historyState, canReadChatHistory]
    );

    const rowRenderer = useCallback(
        ({ index, key, parent, style }: ListRowProps) => {
            const message = reversedMessages[index];

            if (!message) {
                return null;
            }

            const showArchiveChip = message.isArchived === true;

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
                            <ChatMessage
                                onDeleteMessage={onDeleteMessage}
                                message={message}
                                showArchiveChip={showArchiveChip}
                            />
                        </div>
                    )}
                </CellMeasurer>
            );
        },
        [reversedMessages, onDeleteMessage]
    );

    const renderLoadingIndicator = () => {
        if (!historyState?.isLoadingHistory) {
            return null;
        }

        return (
            <div
                className="absolute inset-x-0 top-0 z-10 flex justify-center p-4"
                style={{ background: "linear-gradient(180deg, #FAFAFA 0%, transparent 100%)" }}
            >
                <Loader2 className="text-muted-foreground size-6 animate-spin" />
            </div>
        );
    };

    const renderArchiveNotice = () => {
        if (!hasHiddenArchive) {
            return null;
        }

        return (
            <div
                className="absolute inset-x-0 top-0 z-10 flex items-center justify-center px-4 py-3"
                style={{ background: "linear-gradient(180deg, #FAFAFA 0%, #FAFAFAdd 70%, transparent 100%)" }}
            >
                <div className="bg-warning-brand/20 text-text-body flex items-center gap-2 rounded-lg px-4 py-2 shadow-sm">
                    <p className="text-sm font-medium">{t("chat.archived_messages_notice")}</p>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-paper relative flex h-full w-full flex-col gap-4 rounded-[10px] p-1.5 md:p-4">
            <div className="relative flex h-10 items-center justify-between">
                {chat ? <h2 className="text-text-body text-xl font-semibold">{chat.name}</h2> : <Skeleton />}
                <div className="flex items-center gap-2">
                    <Button onClick={() => setShowChatCloseModal(true)} variant="destructive">
                        <AlertTriangle className="-mt-0.5 mr-1 size-4" />
                        {t("chat.close_chat")}
                    </Button>
                    {onShowDetails && (
                        <button onClick={onShowDetails} className="text-text-body hover:bg-muted rounded-lg p-2">
                            <Users className="size-5" />
                        </button>
                    )}
                </div>
                {status.state !== ReadyState.OPEN && (
                    <div
                        className={`absolute -bottom-15 left-0 z-[1000] mb-2.5 flex w-full items-center gap-2.5 rounded-b-lg p-2.5 text-base font-medium shadow-sm max-[1100px]:-bottom-20 ${alertVariantClasses[status.state === ReadyState.CONNECTING ? "info" : "danger"]}`}
                    >
                        {translatedConnectionStatus[status.state]}
                    </div>
                )}
            </div>

            <div className="relative h-[70vh] w-full">
                {renderLoadingIndicator()}
                {renderArchiveNotice()}
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
                    <div className="flex h-full items-center justify-center">
                        <p className="text-muted-foreground">{t("chat.no_messages")}</p>
                    </div>
                ) : (
                    <Loader />
                )}
            </div>

            {!chat?.is_active ? (
                <div className="border-destructive bg-destructive/10 rounded-lg border p-5 text-center">
                    <p className="text-destructive font-bold">{t("chat.chat_closed")}</p>
                </div>
            ) : (
                <div className="relative flex items-center gap-5">
                    <Input
                        maxLength={1500}
                        className="h-12 flex-1"
                        disabled={!chat || !user || !chat.participants.some((p) => p.id === user.id)}
                        placeholder={t("chat.enter_message_label")}
                        name="message"
                        value={formik.values.message}
                        onChange={(e) => formik.setFieldValue("message", e.target.value)}
                        onBlur={formik.handleBlur}
                        ref={textFieldRef}
                        onKeyDown={(event) => {
                            if (event.key === "Enter") {
                                formik.handleSubmit();
                                event.preventDefault();
                            }
                        }}
                    />

                    <div className="hidden md:flex">
                        <EmojiPicker
                            onChange={(val) => formik.setFieldValue("message", val)}
                            textFieldRef={textFieldRef}
                        />
                    </div>

                    <Button className="h-12 gap-2.5" onClick={() => formik.handleSubmit()}>
                        {!isMobile && t("chat.send")} <Send className="-mt-0.5 size-4" />
                    </Button>
                </div>
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
        </div>
    );
};

export default Chat;
