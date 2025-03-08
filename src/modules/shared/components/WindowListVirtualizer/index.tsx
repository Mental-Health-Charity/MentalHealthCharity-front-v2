import { useRef } from "react";
import { AutoSizer, CellMeasurerCache, List, ListRowProps, WindowScroller } from "react-virtualized";

export interface CachedListRowProps extends ListRowProps {
    cache: CellMeasurerCache;
}

interface Props {
    rowCount: number;
    onRender: (params: CachedListRowProps) => React.ReactNode;
}

const WindowListVirtualizer = ({ rowCount, onRender }: Props) => {
    const ref = useRef<WindowScroller>(null);

    const cache = new CellMeasurerCache({
        fixedWidth: true,
        defaultHeight: 300,
    });

    return (
        <div style={{ overflow: "scroll" }}>
            <div>
                <WindowScroller ref={ref} scrollElement={window}>
                    {({
                        height,
                        isScrolling,

                        onChildScroll,
                        scrollTop,
                    }) => (
                        <div>
                            <AutoSizer disableHeight>
                                {({ width }) => (
                                    <div>
                                        <List
                                            autoHeight
                                            height={height}
                                            isScrolling={isScrolling}
                                            onScroll={onChildScroll}
                                            overscanRowCount={4}
                                            deferredMeasurementCache={cache}
                                            rowCount={rowCount}
                                            rowHeight={cache.rowHeight}
                                            rowRenderer={(props) => onRender({ ...props, cache })}
                                            scrollTop={scrollTop}
                                            width={width}
                                        />
                                    </div>
                                )}
                            </AutoSizer>
                        </div>
                    )}
                </WindowScroller>
            </div>
        </div>
    );
};

export default WindowListVirtualizer;
