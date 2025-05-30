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
    onLoadMore: () => Promise<any> | void;
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

    // Total number of rows equals total items in the database
    const rowCount = data?.total ?? 1000;
    // Number of items already loaded
    const loadedCount = data?.items.length ?? 0;

    // Tells InfiniteLoader which rows have already been loaded
    const isRowLoaded: InfiniteLoaderProps["isRowLoaded"] = ({ index }) => {
        return index < loadedCount;
    };

    // Called when more rows need to load
    const loadMoreRows: InfiniteLoaderProps["loadMoreRows"] = () => {
        // Delegate actual loading to parent
        console.log("trigger load more");
        return Promise.resolve(onLoadMore());
    };

    console.log("rowCount", rowCount);

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
