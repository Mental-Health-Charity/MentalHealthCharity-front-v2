import { Skeleton } from "@/components/ui/skeleton";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { AutoSizer, InfiniteLoader, List, type ListRowRenderer, WindowScroller } from "react-virtualized";
import { translatedRoles } from "../../../users/constants";
import { formNoteFields, FormResponse, MenteeForm, VolunteerForm } from "../../types";
import RecruitmentManagerModal from "../RecruitmentManagerModal";

const ROW_HEIGHT = 50;
const GRID_TEMPLATE_COLUMNS =
    "minmax(140px,1fr) minmax(200px,1.2fr) minmax(110px,0.8fr) minmax(110px,0.8fr) minmax(240px,1.4fr)";
const SKELETON_COLUMN_COUNT = 5;

interface Props {
    data: FormResponse<MenteeForm | VolunteerForm>[];
    total: number;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    isInitialLoading?: boolean;
    loadMore: () => Promise<unknown>;
    renderStepAddnotation: (step: number) => string;
    onRefetch?: () => void | Promise<unknown>;
    formNoteKeys: formNoteFields[];
}

const FormsTable = ({
    data,
    total,
    hasNextPage,
    isFetchingNextPage,
    isInitialLoading,
    loadMore,
    renderStepAddnotation,
    onRefetch,
    formNoteKeys,
}: Props) => {
    const { t } = useTranslation();
    const [selectedForm, setSelectedForm] = useState<FormResponse<MenteeForm | VolunteerForm> | null>(null);

    const minTableWidth = useMemo(() => 860, []);
    const rowCount = hasNextPage ? data.length + 1 : data.length;

    const isRowLoaded = useCallback(({ index }: { index: number }) => index < data.length, [data.length]);

    const loadMoreRows = useCallback(
        async (_range: { startIndex: number; stopIndex: number }) => {
            if (!hasNextPage || isFetchingNextPage) {
                return;
            }

            await loadMore();
        },
        [hasNextPage, isFetchingNextPage, loadMore]
    );

    const rowRenderer: ListRowRenderer = ({ index, key, style }) => {
        if (index >= data.length) {
            return (
                <div key={key} style={style} className="px-2 py-1">
                    <div
                        className="bg-card border-border/50 grid gap-2 rounded-lg border p-2"
                        style={{ gridTemplateColumns: GRID_TEMPLATE_COLUMNS }}
                    >
                        {Array.from({ length: SKELETON_COLUMN_COUNT }, (_, skeletonIdx) => (
                            <Skeleton key={skeletonIdx} className="h-7 w-full" />
                        ))}
                    </div>
                </div>
            );
        }

        const form = data[index];

        return (
            <div key={key} style={style} className="px-2 py-1">
                <div
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedForm(form)}
                    onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            setSelectedForm(form);
                        }
                    }}
                    className="bg-card border-border/50 hover:border-primary-brand/40 hover:bg-muted/20 grid cursor-pointer items-center gap-2 rounded-lg border p-2.5 text-left shadow-sm transition-colors"
                    style={{ gridTemplateColumns: GRID_TEMPLATE_COLUMNS }}
                >
                    <div className="min-w-0">
                        <p className="text-foreground truncate text-sm font-medium">
                            {form.created_by.full_name || t("forms_fields.unknown_name", { defaultValue: "Unknown" })}
                        </p>
                    </div>
                    <div className="min-w-0">
                        <p className="text-foreground truncate text-xs">{form.created_by.email}</p>
                    </div>
                    <div className="min-w-0">
                        <p className="text-foreground truncate text-xs">{translatedRoles[form.created_by.user_role]}</p>
                    </div>
                    <div className="min-w-0">
                        <p className="text-foreground truncate text-xs">
                            {new Date(form.creation_date).toLocaleDateString()}
                        </p>
                    </div>
                    <div className="min-w-0">
                        <p className="text-primary-brand truncate text-xs font-medium">
                            {`${renderStepAddnotation(form.current_step)} (${form.current_step}/${form.form_type.max_step})`}
                        </p>
                    </div>
                </div>
            </div>
        );
    };

    if (isInitialLoading && data.length === 0) {
        return (
            <div className="flex flex-col gap-3 p-2">
                {Array.from({ length: 6 }, (_, idx) => (
                    <div key={idx} className="bg-card border-border/50 rounded-xl border p-4">
                        <Skeleton className="h-8 w-full" />
                    </div>
                ))}
            </div>
        );
    }

    if (!isInitialLoading && data.length === 0) {
        return (
            <div className="flex min-h-40 items-center justify-center rounded-xl border border-dashed">
                <p className="text-muted-foreground text-sm">{t("common.no_data", { defaultValue: "No data" })}</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="border-border/50 overflow-x-auto rounded-xl border">
                <div style={{ minWidth: minTableWidth }}>
                    <div className="bg-muted/60 border-border/60 supports-[backdrop-filter]:bg-background/80 sticky top-0 z-20 border-b px-2 py-2 backdrop-blur">
                        <div className="grid items-center gap-2" style={{ gridTemplateColumns: GRID_TEMPLATE_COLUMNS }}>
                            <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                                {t("forms_fields.name")}
                            </p>
                            <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                                {t("forms_fields.email")}
                            </p>
                            <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                                {t("forms_fields.role")}
                            </p>
                            <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                                {t("forms_fields.creation_date")}
                            </p>
                            <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                                {t("forms_fields.progress")}
                            </p>
                        </div>
                    </div>

                    <InfiniteLoader
                        isRowLoaded={isRowLoaded}
                        loadMoreRows={loadMoreRows}
                        rowCount={Math.max(rowCount, 1)}
                        threshold={4}
                        minimumBatchSize={10}
                    >
                        {({ onRowsRendered, registerChild }) => (
                            <WindowScroller>
                                {({ height, isScrolling, onChildScroll, scrollTop }) => (
                                    <div>
                                        <AutoSizer disableHeight>
                                            {({ width }) => (
                                                <List
                                                    autoHeight
                                                    height={height}
                                                    width={Math.max(width, minTableWidth)}
                                                    isScrolling={isScrolling}
                                                    onScroll={onChildScroll}
                                                    onRowsRendered={onRowsRendered}
                                                    rowCount={rowCount}
                                                    rowHeight={ROW_HEIGHT}
                                                    rowRenderer={rowRenderer}
                                                    overscanRowCount={5}
                                                    scrollTop={scrollTop}
                                                    ref={(ref) => {
                                                        registerChild(ref);
                                                    }}
                                                />
                                            )}
                                        </AutoSizer>
                                    </div>
                                )}
                            </WindowScroller>
                        )}
                    </InfiniteLoader>
                </div>
            </div>

            <RecruitmentManagerModal
                open={Boolean(selectedForm)}
                form={selectedForm}
                onClose={() => setSelectedForm(null)}
                renderStepAddnotation={renderStepAddnotation}
                onRefetch={onRefetch}
                formNoteKeys={formNoteKeys}
            />

            {total > 0 && <p className="text-muted-foreground mt-3 px-1 text-xs">Total: {total}</p>}
        </div>
    );
};

export default FormsTable;
