import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import useDebounce from "../../shared/hooks/useDebounce";
import { Pagination } from "../../shared/types";
import { ChatSortByOptions } from "../constants";
import { getChatsQueryOptions } from "../queries/getChatsQueryOptions";
import { Chat } from "../types";

interface AggregatedChatData {
    key: string;
    data: Pagination<Chat>;
}

export default function useChatListLoader(pageSize = 100, status: "active" | "closed" = "active") {
    const queryClient = useQueryClient();
    const [searchQuery, setSearchQuery] = useState("");
    const debouncedSearch = useDebounce(searchQuery, 400);
    const aggregationKey = JSON.stringify([status, debouncedSearch, pageSize]);

    const { data, isLoading, isFetching } = useQuery(
        getChatsQueryOptions({
            size: pageSize,
            page: 1,
            unread_first: true,
            sort_by: ChatSortByOptions.LATEST_MESSAGE_DATE,
            status,
            ...(debouncedSearch ? { search: debouncedSearch } : {}),
        })
    );

    const [aggregatedState, setAggregatedState] = useState<AggregatedChatData | undefined>(undefined);
    const activeAggregationKeyRef = useRef(aggregationKey);
    activeAggregationKeyRef.current = aggregationKey;
    const loadingPagesRef = useRef<Set<string>>(new Set());
    const aggregatedData = aggregatedState?.key === aggregationKey ? aggregatedState.data : undefined;

    useEffect(() => {
        if (data) setAggregatedState({ key: aggregationKey, data });
    }, [aggregationKey, data]);

    const loadPage = useCallback(
        async (pageNumber: number) => {
            if (!aggregatedData) return;
            if (pageNumber <= aggregatedData.page) return;
            if (aggregatedData.pages && pageNumber > aggregatedData.pages) return;
            const requestKey = aggregationKey;
            const loadingKey = `${requestKey}:${pageNumber}`;
            if (loadingPagesRef.current.has(loadingKey)) return;

            loadingPagesRef.current.add(loadingKey);
            try {
                const next = await queryClient.fetchQuery(
                    getChatsQueryOptions({
                        size: pageSize,
                        page: pageNumber,
                        unread_first: true,
                        sort_by: ChatSortByOptions.LATEST_MESSAGE_DATE,
                        status,
                        ...(debouncedSearch ? { search: debouncedSearch } : {}),
                    })
                );

                setAggregatedState((prev) => {
                    if (activeAggregationKeyRef.current !== requestKey) return prev;
                    const previousData = prev?.key === requestKey ? prev.data : undefined;
                    if (!previousData) return { key: requestKey, data: next };
                    const existingIds = new Set(previousData.items.map((i) => i.id));
                    const newItems = next.items.filter((i) => !existingIds.has(i.id));
                    return {
                        key: requestKey,
                        data: {
                            items: [...previousData.items, ...newItems],
                            total: next.total,
                            pages: next.pages,
                            page: next.page,
                            size: next.size ?? previousData.size,
                        } as Pagination<Chat>,
                    };
                });
            } finally {
                loadingPagesRef.current.delete(loadingKey);
            }
        },
        [aggregatedData, aggregationKey, queryClient, pageSize, debouncedSearch, status]
    );

    const loadNextPage = useCallback(async () => {
        if (!aggregatedData) return;
        const nextPage = (aggregatedData?.page || 1) + 1;
        if (aggregatedData.pages && nextPage > aggregatedData.pages) return;
        return loadPage(nextPage);
    }, [aggregatedData, loadPage]);

    return {
        data,
        isLoading,
        aggregatedData,
        loadPage,
        loadNextPage,
        searchQuery,
        setSearchQuery,
        isSearching: searchQuery !== debouncedSearch,
        isFetching,
    } as const;
}
