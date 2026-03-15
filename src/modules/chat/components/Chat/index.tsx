import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useFormik } from "formik";
import { Loader2, Send } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ReadyState } from "react-use-websocket";
import { AutoSizer, CellMeasurer, CellMeasurerCache, List, ListRowProps } from "react-virtualized";
import type { CellMeasurerChildProps } from "react-virtualized/dist/es/CellMeasurer";
import * as Yup from "yup";
import { useIsMobile } from "../../../../hooks/useBreakpoint";
import { useUser } from "../../../auth/components/AuthProvider";
import EmojiPicker from "../../../shared/components/EmojiPicker";
import { Permissions } from "../../../shared/constants";
import usePermissions from "../../../shared/hooks/usePermissions";
import { translatedConnectionStatus } from "../../constants";
import { HistoryPaginationState } from "../../hooks/useChat";
import { Chat as ChatType, ConnectionStatus, Message } from "../../types";
import CloseChatModal from "../CloseChatModal";
import ConnectionModal from "../ConnectionModal";
import ChatMessage from "../Message";

const LOAD_MORE_THRESHOLD = 200;
const ESTIMATED_ROW_HEIGHT = 100;

type AlertVariant = "danger" | "warning" | "info";

const alertVariantClasses: Record<AlertVariant, string> = {
    danger: "bg-destructive/10 text-destructive border-destructive/20",
    warning: "bg-warning-brand/10 text-foreground border-warning-brand/20",
    info: "bg-info-brand/10 text-foreground border-info-brand/20",
};

interface Props {
    chat?: ChatType;
    onSendMessage: (message: string) => void;
    onDeleteMessage: (id: number) => void;
    onRetryMessage?: (id: number) => void;
    messages: Message[];
    status: ConnectionStatus;
    onCloseChat: (chat: ChatType) => void;
    onLoadMoreMessages?: () => Promise<void>;
    historyState?: HistoryPaginationState;
}

const Chat = ({
    chat,
    messages,
    onSendMessage,
    status,
    onDeleteMessage,
    onRetryMessage,
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

    const isConnected = status.state === ReadyState.OPEN;
    const isParticipant = chat && user && chat.participants.some((p) => p.id === user.id);
    const canSendMessage = isConnected && !!chat && !!user && !!isParticipant;

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
                                onRetryMessage={onRetryMessage}
                                message={message}
                                showArchiveChip={showArchiveChip}
                            />
                        </div>
                    )}
                </CellMeasurer>
            );
        },
        [reversedMessages, onDeleteMessage, onRetryMessage]
    );

    const renderLoadingIndicator = () => {
        if (!historyState?.isLoadingHistory) {
            return null;
        }

        return (
            <div className="from-background absolute inset-x-0 top-0 z-10 flex justify-center bg-gradient-to-b to-transparent p-4">
                <Loader2 className="text-muted-foreground size-6 animate-spin" />
            </div>
        );
    };

    const renderArchiveNotice = () => {
        if (!hasHiddenArchive) {
            return null;
        }

        return (
            <div className="from-background via-background/80 absolute inset-x-0 top-0 z-10 flex items-center justify-center bg-gradient-to-b to-transparent px-4 py-3">
                <div className="bg-warning-brand/20 text-foreground flex items-center gap-2 rounded-lg px-4 py-2 shadow-sm">
                    <p className="text-sm font-medium">{t("chat.archived_messages_notice")}</p>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-background/50 relative flex min-h-0 flex-1 flex-col">
            {/* Connection status banner */}
            {status.state !== ReadyState.OPEN && (
                <div
                    className={`flex items-center gap-2.5 border-b px-4 py-2.5 text-sm font-medium ${alertVariantClasses[status.state === ReadyState.CONNECTING ? "info" : "danger"]}`}
                    role="status"
                    aria-live="polite"
                >
                    {translatedConnectionStatus[status.state]}
                </div>
            )}

            {/* Messages area */}
            <div
                className="relative min-h-0 flex-1"
                role="log"
                aria-label={t("chat.messages", { defaultValue: "Messages" })}
            >
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
                                    padding: isMobile ? "8px 12px" : "12px 20px",
                                }}
                            />
                        )}
                    </AutoSizer>
                ) : reversedMessages && reversedMessages.length === 0 ? (
                    <div className="flex h-full items-center justify-center">
                        <p className="text-muted-foreground">{t("chat.no_messages")}</p>
                    </div>
                ) : (
                    <div
                        className="flex h-full flex-col justify-end gap-4 p-5"
                        role="status"
                        aria-label="Loading messages"
                    >
                        {/* Left-aligned message skeleton */}
                        <div className="flex items-end gap-2.5">
                            <Skeleton className="size-8 shrink-0 rounded-full" />
                            <div className="flex flex-col gap-1.5">
                                <Skeleton className="h-3 w-20" />
                                <Skeleton className="h-16 w-52 rounded-2xl rounded-bl-md" />
                            </div>
                        </div>
                        {/* Right-aligned message skeleton */}
                        <div className="flex items-end justify-end gap-2.5">
                            <div className="flex flex-col items-end gap-1.5">
                                <Skeleton className="h-3 w-16" />
                                <Skeleton className="h-12 w-44 rounded-2xl rounded-br-md" />
                            </div>
                        </div>
                        {/* Left-aligned message skeleton */}
                        <div className="flex items-end gap-2.5">
                            <Skeleton className="size-8 shrink-0 rounded-full" />
                            <div className="flex flex-col gap-1.5">
                                <Skeleton className="h-3 w-20" />
                                <Skeleton className="h-20 w-64 rounded-2xl rounded-bl-md" />
                            </div>
                        </div>
                        {/* Right-aligned message skeleton */}
                        <div className="flex items-end justify-end gap-2.5">
                            <div className="flex flex-col items-end gap-1.5">
                                <Skeleton className="h-3 w-16" />
                                <Skeleton className="h-10 w-36 rounded-2xl rounded-br-md" />
                            </div>
                        </div>
                        {/* Left-aligned message skeleton */}
                        <div className="flex items-end gap-2.5">
                            <Skeleton className="size-8 shrink-0 rounded-full" />
                            <div className="flex flex-col gap-1.5">
                                <Skeleton className="h-3 w-20" />
                                <Skeleton className="h-14 w-48 rounded-2xl rounded-bl-md" />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input bar */}
            {!chat?.is_active ? (
                <div className="border-border/50 border-t px-4 py-3">
                    <div className="border-destructive bg-destructive/10 rounded-lg border p-3 text-center">
                        <p className="text-destructive text-sm font-bold">{t("chat.chat_closed")}</p>
                    </div>
                </div>
            ) : (
                <div className="border-border/50 flex items-center gap-2 border-t px-3 py-3 md:px-4">
                    <div className="bg-muted/50 flex min-h-[48px] flex-1 items-center gap-2 rounded-full px-4">
                        <input
                            maxLength={1500}
                            className="text-foreground placeholder:text-muted-foreground min-w-0 flex-1 bg-transparent text-sm outline-none disabled:opacity-50"
                            disabled={!canSendMessage}
                            placeholder={
                                isConnected
                                    ? t("chat.enter_message_label")
                                    : t("chat.disconnected_placeholder", { defaultValue: "Reconnecting..." })
                            }
                            aria-label={t("chat.enter_message_label")}
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
                    </div>

                    <Button
                        className="bg-primary-brand hover:bg-primary-brand-dark size-12 shrink-0 rounded-full p-0 text-white disabled:opacity-50"
                        onClick={() => formik.handleSubmit()}
                        disabled={!canSendMessage}
                        aria-label={t("chat.send")}
                    >
                        <Send className="size-5" />
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
