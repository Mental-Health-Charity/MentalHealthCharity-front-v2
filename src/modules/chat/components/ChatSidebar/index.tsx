import CloseIcon from "@mui/icons-material/Close";
import { Box, Drawer, IconButton, TextField, useMediaQuery } from "@mui/material";
import { t } from "i18next";
import { useState } from "react";
import { AutoSizer, IndexRange, InfiniteLoader, List as RVList } from "react-virtualized";
import useTheme from "../../../../theme";
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
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [readed, setReaded] = useState<{ [key: number]: boolean }>({});

    const sidebarContent = (
        <Box
            sx={{
                backgroundColor: theme.palette.background.default,
                borderRadius: { sm: "8px", xs: 0 },
                display: "flex",
                width: "100%",
                padding: "10px",
                height: "100%",
            }}
        >
            <Box sx={{ width: "100%" }}>
                <Box display="flex" gap={2} alignItems="center" sx={{ paddingBottom: "15px" }}>
                    <TextField
                        fullWidth
                        label={t("common.search")}
                        variant="filled"
                        sx={{
                            color: theme.palette.text.primary,
                        }}
                    />
                    <Box
                        sx={{
                            display: { sm: "none", md: "none" },
                        }}
                    >
                        <IconButton
                            onClick={handleDrawerToggle}
                            sx={{
                                color: theme.palette.colors.danger,
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </Box>
                <Box sx={{ height: "75vh", minHeight: "500px" }}>
                    {data ? (
                        <InfiniteLoader
                            isRowLoaded={({ index }) => !!data && index < data.items.length}
                            loadMoreRows={async (range: IndexRange) => {
                                if (!data) return Promise.resolve();
                                // If we already have items covering requested rows, do nothing
                                if (range.stopIndex < data.items.length) return Promise.resolve();
                                // If there are more pages, ask parent to load next page
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
                </Box>
            </Box>
        </Box>
    );

    return (
        <>
            {isMobile ? (
                <>
                    <Drawer
                        variant="temporary"
                        anchor="left"
                        open={showSidebar}
                        onClose={handleDrawerToggle}
                        ModalProps={{
                            keepMounted: true,
                        }}
                        sx={{
                            "& .MuiDrawer-paper": {
                                width: "100%",
                            },
                        }}
                    >
                        {sidebarContent}
                    </Drawer>
                </>
            ) : (
                <Box sx={{ width: "350px", height: "100%" }}>{sidebarContent}</Box>
            )}
        </>
    );
};

export default ChatSidebar;
