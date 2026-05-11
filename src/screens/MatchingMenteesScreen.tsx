import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Clock, MessageCircle, UserCheck, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
    matchedMenteesQueryOptions,
    waitingMenteesQueryOptions,
} from "../modules/matching/queries/menteeMatchingQueryOptions";
import { MenteeMatchingItem, MenteeMatchingStatus } from "../modules/matching/types";
import AdminLayout from "../modules/shared/components/AdminLayout";
import formatDate from "../modules/shared/helpers/formatDate";

type ViewMode = "waiting" | "matched";

const statusClassName: Record<MenteeMatchingStatus, string> = {
    [MenteeMatchingStatus.WAITING]: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
    [MenteeMatchingStatus.REMATCH_REQUESTED]: "bg-orange-500/15 text-orange-700 dark:text-orange-400",
    [MenteeMatchingStatus.MATCHED]: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
    [MenteeMatchingStatus.PAUSED]: "bg-slate-500/15 text-slate-700 dark:text-slate-400",
    [MenteeMatchingStatus.DECLINED]: "bg-destructive/15 text-destructive",
    [MenteeMatchingStatus.CLOSED]: "bg-muted text-muted-foreground",
};

const MatchingMenteesScreen = () => {
    const { t } = useTranslation();
    const [viewMode, setViewMode] = useState<ViewMode>("waiting");

    const waitingQuery = useQuery(waitingMenteesQueryOptions());
    const matchedQuery = useQuery(matchedMenteesQueryOptions());

    const activeQuery = viewMode === "waiting" ? waitingQuery : matchedQuery;
    const items = useMemo(() => activeQuery.data ?? [], [activeQuery.data]);

    const statusLabels: Record<MenteeMatchingStatus, string> = {
        [MenteeMatchingStatus.WAITING]: t("matching.mentee_status.waiting", { defaultValue: "Do sparowania" }),
        [MenteeMatchingStatus.REMATCH_REQUESTED]: t("matching.mentee_status.rematch_requested", {
            defaultValue: "Do ponownego sparowania",
        }),
        [MenteeMatchingStatus.MATCHED]: t("matching.mentee_status.matched", { defaultValue: "Sparowany" }),
        [MenteeMatchingStatus.PAUSED]: t("matching.mentee_status.paused", { defaultValue: "Wstrzymany" }),
        [MenteeMatchingStatus.DECLINED]: t("matching.mentee_status.declined", { defaultValue: "Zrezygnowal" }),
        [MenteeMatchingStatus.CLOSED]: t("matching.mentee_status.closed", { defaultValue: "Zamkniety" }),
    };

    const renderRows = (mentees: MenteeMatchingItem[]) =>
        mentees.map(({ user, state }) => (
            <TableRow key={`${state.user_id}-${state.status}`}>
                <TableCell>
                    <div className="flex min-w-[180px] flex-col">
                        <span className="text-foreground font-medium">{user.full_name || user.email}</span>
                        <span className="text-muted-foreground text-xs">ID: {user.id}</span>
                    </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                    <Badge className={cn("border-0", statusClassName[state.status])}>
                        {statusLabels[state.status]}
                    </Badge>
                </TableCell>
                <TableCell>{formatDate(state.queued_at)}</TableCell>
                <TableCell>{state.matched_at ? formatDate(state.matched_at) : "-"}</TableCell>
                <TableCell>
                    {state.current_chat_id ? (
                        <Link
                            to={`/chat/${state.current_chat_id}`}
                            className="hover:bg-muted inline-flex h-8 items-center gap-1 rounded-md px-3 text-sm font-medium no-underline"
                        >
                            <MessageCircle className="size-4" />
                            {t("chat.go_to_chat")}
                        </Link>
                    ) : (
                        <span className="text-muted-foreground">-</span>
                    )}
                </TableCell>
                <TableCell>
                    <Badge variant={state.auto_matching_enabled ? "secondary" : "outline"}>
                        {state.auto_matching_enabled
                            ? t("common.enabled", { defaultValue: "Wlaczona" })
                            : t("common.disabled", { defaultValue: "Wylaczona" })}
                    </Badge>
                </TableCell>
            </TableRow>
        ));

    return (
        <AdminLayout>
            <div className="bg-card border-border/50 rounded-xl border p-6 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary-brand/10 flex size-11 items-center justify-center rounded-lg">
                            <Users className="text-primary-brand size-5" />
                        </div>
                        <div>
                            <h1 className="text-foreground text-xl font-bold">
                                {t("matching.mentees_title", { defaultValue: "Osoby w kryzysie" })}
                            </h1>
                            <p className="text-muted-foreground text-sm">
                                {t("matching.mentees_subtitle", {
                                    defaultValue: "Status osob w kryzysie w automatycznym parowaniu.",
                                })}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant={viewMode === "waiting" ? "default" : "outline"}
                            onClick={() => setViewMode("waiting")}
                        >
                            <Clock className="size-4" />
                            {t("matching.mentees_waiting", { defaultValue: "Do sparowania" })}
                            <Badge variant="secondary" className="ml-1">
                                {waitingQuery.data?.length ?? 0}
                            </Badge>
                        </Button>
                        <Button
                            variant={viewMode === "matched" ? "default" : "outline"}
                            onClick={() => setViewMode("matched")}
                        >
                            <UserCheck className="size-4" />
                            {t("matching.mentees_matched", { defaultValue: "Sparowani" })}
                            <Badge variant="secondary" className="ml-1">
                                {matchedQuery.data?.length ?? 0}
                            </Badge>
                        </Button>
                    </div>
                </div>
            </div>

            <div className="mt-5 w-full min-w-0">
                <div className="border-border/50 bg-card overflow-hidden rounded-xl border shadow-sm">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t("common.name", { defaultValue: "Imie" })}</TableHead>
                                <TableHead>{t("common.email", { defaultValue: "Email" })}</TableHead>
                                <TableHead>{t("common.status", { defaultValue: "Status" })}</TableHead>
                                <TableHead>{t("matching.queued_at", { defaultValue: "W kolejce od" })}</TableHead>
                                <TableHead>{t("matching.matched_at", { defaultValue: "Sparowany od" })}</TableHead>
                                <TableHead>{t("chat.chat", { defaultValue: "Czat" })}</TableHead>
                                <TableHead>{t("matching.automation", { defaultValue: "Automatyzacja" })}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {activeQuery.isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-muted-foreground h-24 text-center">
                                        {t("common.loading", { defaultValue: "Ladowanie..." })}
                                    </TableCell>
                                </TableRow>
                            ) : items.length > 0 ? (
                                renderRows(items)
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-muted-foreground h-24 text-center">
                                        {viewMode === "waiting"
                                            ? t("matching.no_waiting_mentees", {
                                                  defaultValue: "Brak osob oczekujacych na sparowanie.",
                                              })
                                            : t("matching.no_matched_mentees", {
                                                  defaultValue: "Brak sparowanych osob w kryzysie.",
                                              })}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {activeQuery.isError && (
                <p className="text-destructive mt-3">
                    {t("common.no_data", { defaultValue: "Nie udalo sie pobrac danych." })}
                </p>
            )}
        </AdminLayout>
    );
};

export default MatchingMenteesScreen;
