import React, { useRef } from "react";
import {
    AutoSizer,
    Index,
    List,
    ListRowRenderer,
    WindowScroller,
} from "react-virtualized";

interface Props {
    rowCount: number;
    onRender: ListRowRenderer;
    rowHeight?: number | ((params: Index) => number);
}

const WindowListVirtualizer = ({
    rowCount,
    onRender,
    rowHeight = 30,
}: Props) => {
    const ref = useRef<WindowScroller>(null);

    return (
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
                                    overscanRowCount={2}
                                    rowCount={rowCount}
                                    rowHeight={rowHeight}
                                    rowRenderer={onRender}
                                    scrollTop={scrollTop}
                                    width={width}
                                />
                            </div>
                        )}
                    </AutoSizer>
                </div>
            )}
        </WindowScroller>
    );
};

export default WindowListVirtualizer;
