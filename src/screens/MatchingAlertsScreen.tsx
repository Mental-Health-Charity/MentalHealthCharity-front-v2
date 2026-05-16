import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, RefreshCw, UserCheck, Users } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { adminAlertsQueryOptions } from "../modules/matching/queries/adminAlertsQueryOptions";
import { AdminAlert } from "../modules/matching/types";
import AdminLayout from "../modules/shared/components/AdminLayout";
import formatDate from "../modules/shared/helpers/formatDate";

const getIds = (alert: AdminAlert, key: "waiting_user_ids" | "notified_user_ids") => {
    const value = alert.metadata?.[key];

    return Array.isArray(value) ? value.filter((id): id is number => typeof id === "number") : [];
};

const MatchingAlertsScreen = () => {
    const { t } = useTranslation();
    const { data, isError, isFetching, isLoading, refetch } = useQuery(adminAlertsQueryOptions());
    const alerts = data ?? [];

    const latestAlertAt = useMemo(() => {
        if (!alerts.length) return null;

        return alerts[0].created_at;
    }, [alerts]);

    const renderRows = (rows: AdminAlert[]) =>
        rows.map((alert, index) => {
            const waitingUserIds = getIds(alert, "waiting_user_ids");
            const notifiedUserIds = getIds(alert, "notified_user_ids");

            return (
                <TableRow key={`${alert.created_at}-${index}`}>
                    <TableCell>
                        <div className="flex min-w-[190px] flex-col">
                            <span className="text-foreground font-medium">
                                {t("matching.alert_no_capacity_title", {
                                    defaultValue: "Brak wolnych wolontariuszy",
                                })}
                            </span>
                            <span className="text-muted-foreground text-xs">{alert.message}</span>
                        </div>
                    </TableCell>
                    <TableCell>{formatDate(alert.created_at)}</TableCell>
                    <TableCell>
                        <Badge variant="warning">
                            {t("matching.alert_waiting_count", {
                                defaultValue: "{{count}} oczekuje",
                                count: waitingUserIds.length,
                            })}
                        </Badge>
                    </TableCell>
                    <TableCell>
                        <Badge variant={notifiedUserIds.length ? "info" : "outline"}>
                            {t("matching.alert_notified_count", {
                                defaultValue: "{{count}} powiadomionych",
                                count: notifiedUserIds.length,
                            })}
                        </Badge>
                    </TableCell>
                    <TableCell>
                        {waitingUserIds.length ? (
                            <span className="text-muted-foreground text-xs break-words">
                                {waitingUserIds.join(", ")}
                            </span>
                        ) : (
                            <span className="text-muted-foreground">-</span>
                        )}
                    </TableCell>
                </TableRow>
            );
        });

    return (
        <AdminLayout>
            <div className="bg-card border-border/50 rounded-xl border p-6 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-warning-brand/10 flex size-11 items-center justify-center rounded-lg">
                            <AlertTriangle className="text-warning-brand size-5" />
                        </div>
                        <div>
                            <h1 className="text-foreground text-xl font-bold">
                                {t("matching.alerts_title", { defaultValue: "Alerty parowania" })}
                            </h1>
                            <p className="text-muted-foreground text-sm">
                                {t("matching.alerts_subtitle", {
                                    defaultValue:
                                        "Ostatnie alerty automatyzacji, gdy osoby czekaja na sparowanie, ale brakuje wolnych wolontariuszy.",
                                })}
                            </p>
                            {latestAlertAt && (
                                <p className="text-muted-foreground mt-1 text-xs">
                                    {t("matching.alerts_latest", {
                                        defaultValue: "Ostatni alert: {{date}}",
                                        date: formatDate(latestAlertAt),
                                    })}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Link
                            to="/admin/matching/mentees"
                            className="border-border bg-background hover:bg-muted inline-flex h-10 items-center gap-1.5 rounded-lg border px-4 text-sm font-medium no-underline"
                        >
                            <UserCheck className="size-4" />
                            {t("matching.mentees_title", { defaultValue: "Osoby w kryzysie" })}
                        </Link>
                        <Link
                            to="/admin/matching/volunteers"
                            className="border-border bg-background hover:bg-muted inline-flex h-10 items-center gap-1.5 rounded-lg border px-4 text-sm font-medium no-underline"
                        >
                            <Users className="size-4" />
                            {t("matching.volunteers_title", { defaultValue: "Wolontariusze" })}
                        </Link>
                        <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
                            <RefreshCw className={isFetching ? "size-4 animate-spin" : "size-4"} />
                            {t("common.refresh", { defaultValue: "Odśwież" })}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="mt-5 w-full min-w-0">
                <div className="border-border/50 bg-card overflow-hidden rounded-xl border shadow-sm">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t("common.type", { defaultValue: "Typ" })}</TableHead>
                                <TableHead>{t("common.date", { defaultValue: "Data" })}</TableHead>
                                <TableHead>{t("matching.waiting_mentees", { defaultValue: "Oczekujacy" })}</TableHead>
                                <TableHead>
                                    {t("matching.notified_mentees", { defaultValue: "Powiadomieni" })}
                                </TableHead>
                                <TableHead>{t("matching.waiting_user_ids", { defaultValue: "ID osob" })}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-muted-foreground h-24 text-center">
                                        {t("common.loading", { defaultValue: "Ladowanie..." })}
                                    </TableCell>
                                </TableRow>
                            ) : alerts.length > 0 ? (
                                renderRows(alerts)
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-muted-foreground h-24 text-center">
                                        {t("matching.no_alerts", {
                                            defaultValue: "Brak alertow parowania.",
                                        })}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {isError && (
                <p className="text-destructive mt-3">
                    {t("common.no_data", { defaultValue: "Nie udalo sie pobrac danych." })}
                </p>
            )}
        </AdminLayout>
    );
};

export default MatchingAlertsScreen;
