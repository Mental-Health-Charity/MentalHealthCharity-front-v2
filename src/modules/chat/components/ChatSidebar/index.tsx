import { Input } from "@/components/ui/input";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { t } from "i18next";
import { X } from "lucide-react";
import { useState } from "react";
import { AutoSizer, IndexRange, InfiniteLoader, List as RVList } from "react-virtualized";
import { useIsSmallMobile } from "../../../../hooks/useBreakpoint";
import { Pagination } from "../../../shared/types";
import { Chat } from "../../types";
import ChatItem from "../ChatItem";

interface Props {
    data?: Pagination<Chat>;
    onChangeChat: (id: string) => void;
    currentChatId?: number;
    showSidebar?: boolean;
    handleDrawerToggle?: () => void;
    loadMore?: () => Promise<void>;
}

const ChatSidebar = ({ data, onChangeChat, currentChatId, showSidebar, handleDrawerToggle, loadMore }: Props) => {
    const isMobile = useIsSmallMobile();
    const [readed, setReaded] = useState<{ [key: number]: boolean }>({});

    const sidebarContent = (
        <div className="bg-background flex h-full w-full rounded-lg p-2.5 sm:rounded-lg">
            <div className="w-full">
                <div className="flex items-center gap-4 pb-4">
                    <Input placeholder={t("common.search")} className="w-full" />
                    <div className="sm:hidden">
                        <button onClick={handleDrawerToggle} className="text-danger-brand">
                            <X className="size-5" />
                        </button>
                    </div>
                </div>
                <div className="h-[75vh] min-h-[500px]">
                    {data ? (
                        <InfiniteLoader
                            isRowLoaded={({ index }) => !!data && index < data.items.length}
                            loadMoreRows={async (range: IndexRange) => {
                                if (!data) return Promise.resolve();
                                if (range.stopIndex < data.items.length) return Promise.resolve();
                                if (data.page < data.pages) {
                                    return loadMore ? loadMore() : Promise.resolve();
                                }
                                return Promise.resolve();
                            }}
                            rowCount={data.total}
                        >
                            {({ onRowsRendered, registerChild }) => (
                                <AutoSizer>
                                    {({ height, width }) => (
                                        <RVList
                                            ref={registerChild}
                                            height={height}
                                            width={width}
                                            rowCount={data.total}
                                            rowHeight={72}
                                            rowRenderer={({ index, key, style }) => {
                                                const chat = data.items[index];
                                                if (!chat) {
                                                    return <div key={key} style={style} />;
                                                }

                                                return (
                                                    <div key={key} style={style}>
                                                        <ChatItem
                                                            onChange={(id) => {
                                                                onChangeChat(id);
                                                                setReaded((prev) => ({ ...prev, [chat.id]: true }));
                                                                if (isMobile) {
                                                                    handleDrawerToggle?.();
                                                                }
                                                            }}
                                                            selected={!!currentChatId && chat.id === currentChatId}
                                                            readed={readed[chat.id]}
                                                            chat={chat}
                                                        />
                                                    </div>
                                                );
                                            }}
                                            onRowsRendered={onRowsRendered}
                                        />
                                    )}
                                </AutoSizer>
                            )}
                        </InfiniteLoader>
                    ) : null}
                </div>
            </div>
        </div>
    );

    return (
        <>
            {isMobile ? (
                <Sheet open={showSidebar} onOpenChange={(open) => !open && handleDrawerToggle?.()}>
                    <SheetContent side="left" className="w-full p-0">
                        {sidebarContent}
                    </SheetContent>
                </Sheet>
            ) : (
                <div className="h-full w-[350px]">{sidebarContent}</div>
            )}
        </>
    );
};

export default ChatSidebar;
