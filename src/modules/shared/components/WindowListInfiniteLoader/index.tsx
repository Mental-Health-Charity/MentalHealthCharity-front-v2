import { useRef } from "react";
import {
    AutoSizer,
    CellMeasurerCache,
    InfiniteLoader,
    InfiniteLoaderProps,
    List,
    ListRowProps,
    WindowScroller,
} from "react-virtualized";
import { Pagination } from "../../types";

export interface CachedListRowProps extends ListRowProps {
    cache: CellMeasurerCache;
}

interface Props<T> {
    data?: Pagination<T>;
    onRender: (params: CachedListRowProps) => React.ReactNode;

    onLoadMore: () => Promise<Pagination<T>> | void;
}

/**
 * A window-scrolling list with infinite loading support.
 */
function WindowListInfiniteLoader<T>({ data, onRender, onLoadMore }: Props<T>) {
    const ref = useRef<WindowScroller>(null);

    const cache = new CellMeasurerCache({
        fixedWidth: true,
        defaultHeight: 300,
    });

    const rowCount = data?.total ?? 1000;

    const loadedCount = data?.items.length ?? 0;

    const isRowLoaded: InfiniteLoaderProps["isRowLoaded"] = ({ index }) => {
        return index < loadedCount;
    };

    const loadMoreRows: InfiniteLoaderProps["loadMoreRows"] = () => {
        return Promise.resolve(onLoadMore());
    };

    return (
        <div style={{ overflow: "auto" }}>
            <WindowScroller ref={ref} scrollElement={window}>
                {({ height, isScrolling, onChildScroll, scrollTop }) => (
                    <InfiniteLoader
                        isRowLoaded={isRowLoaded}
                        loadMoreRows={loadMoreRows}
                        rowCount={rowCount}
                        threshold={5}
                    >
                        {({ onRowsRendered, registerChild }) => (
                            <AutoSizer disableHeight>
                                {({ width }) => (
                                    <List
                                        ref={registerChild}
                                        autoHeight
                                        height={height}
                                        isScrolling={isScrolling}
                                        onScroll={onChildScroll}
                                        overscanRowCount={4}
                                        deferredMeasurementCache={cache}
                                        rowCount={rowCount}
                                        rowHeight={cache.rowHeight}
                                        rowRenderer={(props) => onRender({ ...props, cache })}
                                        onRowsRendered={onRowsRendered}
                                        scrollTop={scrollTop}
                                        width={width}
                                    />
                                )}
                            </AutoSizer>
                        )}
                    </InfiniteLoader>
                )}
            </WindowScroller>
        </div>
    );
}

export default WindowListInfiniteLoader;
