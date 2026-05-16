import { useMutation } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import handleApiError from "../../shared/helpers/handleApiError";
import { Pagination } from "../../shared/types";
import { ChatSortByOptions } from "../constants";
import getChatsMutation from "../queries/getChatsMutation";
import { Chat, ChatListFilter, SearchChatQueryOptions } from "../types";

const getFilterOptions = (filter: ChatListFilter): Pick<SearchChatQueryOptions, "status" | "supervisor_chat"> => {
    if (filter === "active") return { status: "active" };
    if (filter === "closed") return { status: "closed" };
    if (filter === "supervisor") return { supervisor_chat: true };
    return {};
};

const useChatList = (searchQuery?: string, filter: ChatListFilter = "all") => {
    const { mutate: loadChats, isPending: isLoadingChats } = useMutation({
        mutationFn: getChatsMutation,
    });
    const [chats, setChats] = useState<Pagination<Chat> | null>(null);

    const handleLoadChats = useCallback(() => {
        if (isLoadingChats) return;

        loadChats(
            {
                page: chats ? chats.page + 1 : 1,
                size: 100,
                search: searchQuery || "",
                unread_first: true,
                sort_by: ChatSortByOptions.LATEST_MESSAGE_DATE,
                ...getFilterOptions(filter),
            },
            {
                onSuccess: (data) => {
                    setChats((prev) => {
                        if (!prev) return data;
                        return {
                            ...data,
                            items: [...prev.items, ...data.items],
                            total: data.total,
                            page: data.page,
                            size: prev.size + data.size,
                        };
                    });
                },
                onError: (error) => {
                    handleApiError(error);
                },
            }
        );
    }, [isLoadingChats, loadChats, chats, searchQuery, filter]);

    const handleRefetch = useCallback(() => {
        if (isLoadingChats) return;
        loadChats(
            {
                page: 1,
                size: 100,
                search: searchQuery || "",
                unread_first: true,
                sort_by: ChatSortByOptions.LATEST_MESSAGE_DATE,
                ...getFilterOptions(filter),
            },
            {
                onSuccess: (data) => {
                    setChats(data);
                },
                onError: (error) => {
                    handleApiError(error);
                },
            }
        );
    }, [isLoadingChats, loadChats, searchQuery, filter]);

    useEffect(() => {
        handleRefetch();
    }, [searchQuery, filter]);

    return {
        chats,
        isLoadingChats,
        handleLoadChats,
        handleRefetch,
    };
};

export default useChatList;
