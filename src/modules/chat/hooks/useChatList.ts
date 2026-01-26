import { useMutation } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import handleApiError from "../../shared/helpers/handleApiError";
import { Pagination } from "../../shared/types";
import { ChatSortByOptions } from "../constants";
import getChatsMutation from "../queries/getChatsMutation";
import { Chat } from "../types";

const useChatList = (searchQuery?: string) => {
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
    }, [isLoadingChats, loadChats, chats]);

    const handleRefetch = useCallback(() => {
        if (isLoadingChats) return;
        loadChats(
            {
                page: 1,
                size: 100,
                search: searchQuery || "",
                unread_first: true,
                sort_by: ChatSortByOptions.LATEST_MESSAGE_DATE,
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
    }, [isLoadingChats, loadChats, searchQuery]);

    useEffect(() => {
        handleRefetch();
    }, [searchQuery]);

    return {
        chats,
        isLoadingChats,
        handleLoadChats,
        handleRefetch,
    };
};

export default useChatList;
