import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { Pagination } from "../../shared/types";
import { getChatsQueryOptions } from "../queries/getChatsQueryOptions";
import { Chat } from "../types";

export default function useChatListLoader(pageSize = 100) {
    const queryClient = useQueryClient();
    const { data, isLoading } = useQuery(getChatsQueryOptions({ size: pageSize, page: 1 }));

    const [aggregatedData, setAggregatedData] = useState<Pagination<Chat> | undefined>(undefined);
    const loadingPagesRef = useRef<Set<number>>(new Set());

    useEffect(() => {
        if (data) setAggregatedData(data);
    }, [data]);

    const loadPage = useCallback(
        async (pageNumber: number) => {
            if (!aggregatedData) return;
            if (pageNumber <= aggregatedData.page) return;
            if (aggregatedData.pages && pageNumber > aggregatedData.pages) return;
            if (loadingPagesRef.current.has(pageNumber)) return;

            loadingPagesRef.current.add(pageNumber);
            try {
                const next = await queryClient.fetchQuery(getChatsQueryOptions({ size: pageSize, page: pageNumber }));

                setAggregatedData((prev) => {
                    if (!prev) return next;
                    const existingIds = new Set(prev.items.map((i) => i.id));
                    const newItems = next.items.filter((i) => !existingIds.has(i.id));
                    return {
                        items: [...prev.items, ...newItems],
                        total: next.total,
                        pages: next.pages,
                        page: next.page,
                        size: next.size ?? prev.size,
                    } as Pagination<Chat>;
                });
            } finally {
                loadingPagesRef.current.delete(pageNumber);
            }
        },
        [aggregatedData, queryClient, pageSize]
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
    } as const;
}
