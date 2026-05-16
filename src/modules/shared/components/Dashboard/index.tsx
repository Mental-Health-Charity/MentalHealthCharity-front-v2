import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import {
    AlertTriangle,
    ArrowRight,
    ClipboardList,
    Clock,
    FileText,
    HeartHandshake,
    Inbox,
    UserCheck,
    Users,
} from "lucide-react";
import { ReactNode, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { getFormsQueryOptions } from "../../../forms/queries/getFormsQueryOptions";
import { formStatus, formTypes } from "../../../forms/types";
import { adminAlertsQueryOptions } from "../../../matching/queries/adminAlertsQueryOptions";
import {
    matchedMenteesQueryOptions,
    waitingMenteesQueryOptions,
} from "../../../matching/queries/menteeMatchingQueryOptions";
import { volunteerCapacityQueryOptions } from "../../../matching/queries/volunteerCapacityQueryOptions";
import { MenteeMatchingItem, MenteeMatchingStatus, VolunteerCapacityItem } from "../../../matching/types";
import { getReportsQueryOptions } from "../../../report/queries/getReportsQueryOptions";
import { Report } from "../../../report/types";
import { isApiDateInFuture, parseApiDate } from "../../helpers/dateTime";
import formatDate from "../../helpers/formatDate";

type DashboardAction = {
    id: string;
    title: string;
    description: string;
    meta: string;
    to: string;
    action: string;
    icon: ReactNode;
    tone: "warning" | "danger" | "info";
    sortTime: number;
    priority: number;
};

type MetricProps = {
    label: string;
    value: string | number;
    detail: string;
    to: string;
    icon: ReactNode;
    tone?: "primary" | "warning" | "danger" | "success";
    isLoading?: boolean;
};

const toneClassName = {
    primary: "bg-primary-brand/10 text-primary-brand",
    warning: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
    danger: "bg-destructive/15 text-destructive",
    success: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
};

const actionToneClassName = {
    warning: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
    danger: "bg-destructive/15 text-destructive",
    info: "bg-primary-brand/10 text-primary-brand",
};

const safeTime = (value?: string | null) => {
    if (!value) {
        return 0;
    }

    const date = parseApiDate(value);
    const time = date.getTime();

    return Number.isNaN(time) ? 0 : time;
};

const getWaitingDuration = (queuedAt?: string | null) => {
    const queuedTime = safeTime(queuedAt);

    if (!queuedTime) {
        return "-";
    }

    const diffMinutes = Math.max(0, Math.floor((Date.now() - queuedTime) / 60000));

    if (diffMinutes < 60) {
        return `${diffMinutes} min`;
    }

    const diffHours = Math.floor(diffMinutes / 60);

    if (diffHours < 24) {
        return `${diffHours} h`;
    }

    return `${Math.floor(diffHours / 24)} d`;
};

const getOldestWaitingItem = (items: MenteeMatchingItem[]) =>
    items.reduce<MenteeMatchingItem | null>((oldestItem, item) => {
        if (!oldestItem) {
            return item;
        }

        return safeTime(item.state.queued_at) < safeTime(oldestItem.state.queued_at) ? item : oldestItem;
    }, null);

const sortByOldestQueue = (items: MenteeMatchingItem[]) =>
    [...items].sort((first, second) => safeTime(first.state.queued_at) - safeTime(second.state.queued_at));

const getVolunteerSummary = (items: VolunteerCapacityItem[]) =>
    items.reduce(
        (summary, item) => {
            const { availability, volunteer } = item;
            const isBlocked = isApiDateInFuture(availability.blocked_until);
            const isAvailable =
                availability.declared_capacity !== null &&
                availability.free_slots > 0 &&
                !availability.is_full &&
                !isBlocked &&
                !volunteer.excluded_from_automation;

            return {
                activeCount: summary.activeCount + availability.active_chat_count,
                availableCount: summary.availableCount + (isAvailable ? 1 : 0),
                blockedCount: summary.blockedCount + (isBlocked ? 1 : 0),
                declaredCapacity: summary.declaredCapacity + (availability.declared_capacity ?? 0),
                excludedCount: summary.excludedCount + (volunteer.excluded_from_automation ? 1 : 0),
                freeSlots: summary.freeSlots + (isAvailable ? Math.max(0, availability.free_slots) : 0),
                fullCount: summary.fullCount + (availability.is_full ? 1 : 0),
            };
        },
        {
            activeCount: 0,
            availableCount: 0,
            blockedCount: 0,
            declaredCapacity: 0,
            excludedCount: 0,
            freeSlots: 0,
            fullCount: 0,
        }
    );

const Metric = ({ label, value, detail, to, icon, tone = "primary", isLoading }: MetricProps) => (
    <Link
        to={to}
        className="bg-card border-border/50 hover:border-primary-brand/40 flex min-h-[146px] flex-col justify-between rounded-lg border p-4 text-left no-underline shadow-sm transition-colors"
    >
        <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
                <p className="text-muted-foreground text-sm font-medium">{label}</p>
                {isLoading ? (
                    <Skeleton className="mt-3 h-9 w-20" />
                ) : (
                    <p className="text-foreground mt-2 text-3xl font-bold tracking-normal">{value}</p>
                )}
            </div>
            <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-lg", toneClassName[tone])}>
                {icon}
            </span>
        </div>
        <p className="text-muted-foreground mt-4 text-sm">{detail}</p>
    </Link>
);

const Section = ({
    title,
    subtitle,
    actionLabel,
    actionTo,
    children,
}: {
    title: string;
    subtitle?: string;
    actionLabel?: string;
    actionTo?: string;
    children: ReactNode;
}) => (
    <section className="bg-card border-border/50 rounded-xl border p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
                <h2 className="text-foreground text-lg font-semibold">{title}</h2>
                {subtitle && <p className="text-muted-foreground mt-1 text-sm">{subtitle}</p>}
            </div>
            {actionLabel && actionTo && (
                <Link
                    to={actionTo}
                    className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-2 no-underline")}
                >
                    {actionLabel}
                    <ArrowRight className="size-4" />
                </Link>
            )}
        </div>
        <div className="mt-5">{children}</div>
    </section>
);

const EmptyState = ({ children }: { children: ReactNode }) => (
    <div className="border-border/50 bg-muted/20 text-muted-foreground rounded-lg border border-dashed p-5 text-sm">
        {children}
    </div>
);

const Dashboard = () => {
    const { t } = useTranslation();
    const waitingQuery = useQuery(waitingMenteesQueryOptions());
    const matchedQuery = useQuery(matchedMenteesQueryOptions());
    const volunteersQuery = useQuery(volunteerCapacityQueryOptions());
    const alertsQuery = useQuery(adminAlertsQueryOptions());
    const reportsQuery = useQuery(
        getReportsQueryOptions({
            page: 1,
            size: 5,
            is_considered: false,
        })
    );
    const menteeFormsQuery = useQuery(
        getFormsQueryOptions({
            page: 1,
            size: 3,
            form_status: formStatus.WAITED,
            form_type: formTypes.MENTEE,
            sort: "oldest",
        })
    );
    const volunteerFormsQuery = useQuery(
        getFormsQueryOptions({
            page: 1,
            size: 3,
            form_status: formStatus.WAITED,
            form_type: formTypes.VOLUNTEER,
            sort: "oldest",
        })
    );

    const waitingItems = waitingQuery.data ?? [];
    const matchedItems = matchedQuery.data ?? [];
    const volunteers = volunteersQuery.data ?? [];
    const alerts = alertsQuery.data ?? [];
    const reports = reportsQuery.data?.items ?? [];
    const menteeForms = menteeFormsQuery.data?.items ?? [];
    const volunteerForms = volunteerFormsQuery.data?.items ?? [];
    const openReportsCount = reportsQuery.data?.total ?? 0;
    const menteeFormsCount = menteeFormsQuery.data?.total ?? 0;
    const volunteerFormsCount = volunteerFormsQuery.data?.total ?? 0;

    const isLoading =
        waitingQuery.isLoading ||
        matchedQuery.isLoading ||
        volunteersQuery.isLoading ||
        alertsQuery.isLoading ||
        reportsQuery.isLoading ||
        menteeFormsQuery.isLoading ||
        volunteerFormsQuery.isLoading;

    const oldestWaitingItem = useMemo(() => getOldestWaitingItem(waitingItems), [waitingItems]);
    const oldestWaitingDuration = getWaitingDuration(oldestWaitingItem?.state.queued_at);
    const rematchCount = waitingItems.filter(
        (item) => item.state.status === MenteeMatchingStatus.REMATCH_REQUESTED
    ).length;
    const volunteerSummary = useMemo(() => getVolunteerSummary(volunteers), [volunteers]);
    const updatedAt = Math.max(
        waitingQuery.dataUpdatedAt,
        matchedQuery.dataUpdatedAt,
        volunteersQuery.dataUpdatedAt,
        alertsQuery.dataUpdatedAt,
        reportsQuery.dataUpdatedAt,
        menteeFormsQuery.dataUpdatedAt,
        volunteerFormsQuery.dataUpdatedAt
    );

    const actionItems = useMemo<DashboardAction[]>(() => {
        const waitingActions = sortByOldestQueue(waitingItems)
            .slice(0, 4)
            .map((item) => ({
                id: `waiting-${item.state.user_id}`,
                title:
                    item.state.status === MenteeMatchingStatus.REMATCH_REQUESTED
                        ? t("admin.dashboard.actions.rematch_title", { defaultValue: "Prośba o ponowne parowanie" })
                        : t("admin.dashboard.actions.waiting_title", { defaultValue: "Osoba czeka na wsparcie" }),
                description: item.user.full_name || item.user.email,
                meta: t("admin.dashboard.waiting_for", {
                    defaultValue: "Czeka {{duration}}",
                    duration: getWaitingDuration(item.state.queued_at),
                }),
                to: "/admin/matching/mentees",
                action: t("matching.manual_pair_submit", { defaultValue: "Sparuj" }),
                icon: <HeartHandshake className="size-4" />,
                tone:
                    item.state.status === MenteeMatchingStatus.REMATCH_REQUESTED
                        ? ("danger" as const)
                        : ("warning" as const),
                sortTime: safeTime(item.state.queued_at),
                priority: item.state.status === MenteeMatchingStatus.REMATCH_REQUESTED ? 0 : 1,
            }));

        const noCapacityAction =
            waitingItems.length > 0 && volunteerSummary.availableCount === 0
                ? [
                      {
                          id: "current-no-capacity",
                          title: t("admin.dashboard.actions.no_capacity_title", {
                              defaultValue: "Brak dostępnych wolontariuszy",
                          }),
                          description: t("admin.dashboard.actions.no_capacity_description", {
                              defaultValue:
                                  "W kolejce są osoby oczekujące, ale żaden wolontariusz nie ma teraz dostępnej pojemności.",
                          }),
                          meta: t("matching.alert_waiting_count", {
                              defaultValue: "{{count}} oczekuje",
                              count: waitingItems.length,
                          }),
                          to: "/admin/matching/volunteers",
                          action: t("admin.dashboard.actions.view_volunteers", {
                              defaultValue: "Zobacz wolontariuszy",
                          }),
                          icon: <AlertTriangle className="size-4" />,
                          tone: "danger" as const,
                          sortTime: 0,
                          priority: 0,
                      },
                  ]
                : [];

        const reportActions = reports.slice(0, 2).map((report: Report) => ({
            id: `report-${report.id}`,
            title: t("admin.dashboard.actions.report_title", { defaultValue: "Otwarte zgłoszenie" }),
            description: report.subject,
            meta: report.created_by.full_name || report.created_by.email,
            to: "/admin/reports",
            action: t("admin.dashboard.resolve", { defaultValue: "Rozpatrz" }),
            icon: <FileText className="size-4" />,
            tone: "info" as const,
            sortTime: safeTime(report.creation_date),
            priority: 3,
        }));

        return [...noCapacityAction, ...waitingActions, ...reportActions]
            .sort((first, second) => first.priority - second.priority || first.sortTime - second.sortTime)
            .slice(0, 7);
    }, [reports, t, volunteerSummary.availableCount, waitingItems]);

    return (
        <div className="flex w-full flex-col gap-5">
            <header className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <p className="text-primary-brand text-sm font-semibold">
                        {t("admin.dashboard.eyebrow", { defaultValue: "Centrum obsługi" })}
                    </p>
                    <h1 className="text-foreground mt-1 text-2xl font-bold md:text-3xl">
                        {t("admin.dashboard.title", { defaultValue: "Dashboard" })}
                    </h1>
                </div>
                <p className="text-muted-foreground text-sm">
                    {updatedAt
                        ? t("admin.dashboard.last_updated", {
                              defaultValue: "Ostatnia aktualizacja: {{date}}",
                              date: formatDate(new Date(updatedAt)),
                          })
                        : t("admin.dashboard.loading_data", { defaultValue: "Ładowanie danych" })}
                </p>
            </header>

            <div className="grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-3">
                <Metric
                    label={t("admin.dashboard.metrics.waiting", { defaultValue: "Osoby czekające" })}
                    value={waitingItems.length}
                    detail={t("admin.dashboard.metrics.waiting_detail", {
                        defaultValue: "{{count}} próśb o ponowne parowanie",
                        count: rematchCount,
                    })}
                    to="/admin/matching/mentees"
                    icon={<HeartHandshake className="size-5" />}
                    tone={waitingItems.length > 0 ? "warning" : "success"}
                    isLoading={waitingQuery.isLoading}
                />
                <Metric
                    label={t("admin.dashboard.metrics.longest_wait", { defaultValue: "Najdłużej czeka" })}
                    value={oldestWaitingDuration}
                    detail={
                        oldestWaitingItem
                            ? oldestWaitingItem.user.full_name || oldestWaitingItem.user.email
                            : t("admin.dashboard.metrics.no_waiting", { defaultValue: "Brak osób w kolejce" })
                    }
                    to="/admin/matching/mentees"
                    icon={<Clock className="size-5" />}
                    tone={oldestWaitingItem ? "danger" : "success"}
                    isLoading={waitingQuery.isLoading}
                />
                <Metric
                    label={t("admin.dashboard.metrics.free_slots", { defaultValue: "Wolne miejsca" })}
                    value={volunteerSummary.freeSlots}
                    detail={t("admin.dashboard.metrics.free_slots_detail", {
                        defaultValue: "{{count}} dostępnych wolontariuszy",
                        count: volunteerSummary.availableCount,
                    })}
                    to="/admin/matching/volunteers"
                    icon={<UserCheck className="size-5" />}
                    tone={volunteerSummary.freeSlots > 0 ? "success" : "danger"}
                    isLoading={volunteersQuery.isLoading}
                />
                <Metric
                    label={t("admin.dashboard.metrics.alerts", { defaultValue: "Alerty" })}
                    value={alerts.length}
                    detail={t("admin.dashboard.metrics.alerts_detail", {
                        defaultValue: "Najnowsze sygnały z parowania",
                    })}
                    to="/admin/matching/alerts"
                    icon={<AlertTriangle className="size-5" />}
                    tone={alerts.length > 0 ? "danger" : "success"}
                    isLoading={alertsQuery.isLoading}
                />
                <Metric
                    label={t("admin.dashboard.metrics.reports", { defaultValue: "Otwarte zgłoszenia" })}
                    value={openReportsCount}
                    detail={t("admin.dashboard.metrics.reports_detail", { defaultValue: "Zgłoszenia do rozpatrzenia" })}
                    to="/admin/reports"
                    icon={<Inbox className="size-5" />}
                    tone={openReportsCount > 0 ? "warning" : "success"}
                    isLoading={reportsQuery.isLoading}
                />
            </div>

            <div className="grid gap-5 lg:grid-cols-[minmax(0,1.45fr)_minmax(360px,0.75fr)]">
                <Section
                    title={t("admin.dashboard.actions.title", { defaultValue: "Do obsłużenia teraz" })}
                    subtitle={t("admin.dashboard.actions.subtitle", {
                        defaultValue: "Najpilniejsze sprawy ułożone według wpływu na proces wsparcia.",
                    })}
                >
                    {isLoading ? (
                        <div className="space-y-3">
                            <Skeleton className="h-20 w-full" />
                            <Skeleton className="h-20 w-full" />
                            <Skeleton className="h-20 w-full" />
                        </div>
                    ) : actionItems.length > 0 ? (
                        <div className="divide-border divide-y">
                            {actionItems.map((item) => (
                                <div key={item.id} className="flex flex-wrap items-center justify-between gap-4 py-4">
                                    <div className="flex min-w-0 items-start gap-3">
                                        <span
                                            className={cn(
                                                "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg",
                                                actionToneClassName[item.tone]
                                            )}
                                        >
                                            {item.icon}
                                        </span>
                                        <div className="min-w-0">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <p className="text-foreground font-medium">{item.title}</p>
                                                <Badge variant="outline">{item.meta}</Badge>
                                            </div>
                                            <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>
                                    <Link
                                        to={item.to}
                                        className={cn(
                                            buttonVariants({ variant: "outline", size: "sm" }),
                                            "gap-2 no-underline"
                                        )}
                                    >
                                        {item.action}
                                        <ArrowRight className="size-4" />
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <EmptyState>
                            {t("admin.dashboard.actions.empty", {
                                defaultValue: "Brak pilnych spraw do obsłużenia.",
                            })}
                        </EmptyState>
                    )}
                </Section>

                <Section
                    title={t("admin.dashboard.matching.title", { defaultValue: "Parowanie" })}
                    subtitle={t("admin.dashboard.matching.subtitle", {
                        defaultValue: "Szybki obraz kolejki i pojemności wolontariuszy.",
                    })}
                    actionLabel={t("admin.dashboard.check_more", { defaultValue: "Sprawdź więcej" })}
                    actionTo="/admin/matching/mentees"
                >
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-muted/30 rounded-lg p-3">
                            <p className="text-muted-foreground text-sm">
                                {t("admin.dashboard.matching.waiting", { defaultValue: "Czeka" })}
                            </p>
                            <p className="text-foreground mt-1 text-2xl font-bold">{waitingItems.length}</p>
                        </div>
                        <div className="bg-muted/30 rounded-lg p-3">
                            <p className="text-muted-foreground text-sm">
                                {t("admin.dashboard.matching.matched", { defaultValue: "Sparowani" })}
                            </p>
                            <p className="text-foreground mt-1 text-2xl font-bold">{matchedItems.length}</p>
                        </div>
                        <div className="bg-muted/30 rounded-lg p-3">
                            <p className="text-muted-foreground text-sm">
                                {t("admin.dashboard.matching.full", { defaultValue: "Pełni" })}
                            </p>
                            <p className="text-foreground mt-1 text-2xl font-bold">{volunteerSummary.fullCount}</p>
                        </div>
                        <div className="bg-muted/30 rounded-lg p-3">
                            <p className="text-muted-foreground text-sm">
                                {t("admin.dashboard.matching.blocked", { defaultValue: "Zablokowani" })}
                            </p>
                            <p className="text-foreground mt-1 text-2xl font-bold">{volunteerSummary.blockedCount}</p>
                        </div>
                    </div>
                    <div className="border-border/50 mt-4 rounded-lg border p-3">
                        <div className="mb-2 flex justify-between gap-3 text-sm">
                            <span className="text-muted-foreground">
                                {t("admin.dashboard.matching.capacity", { defaultValue: "Wykorzystane miejsca" })}
                            </span>
                            <span className="text-foreground font-medium">
                                {volunteerSummary.activeCount}/{volunteerSummary.declaredCapacity || 0}
                            </span>
                        </div>
                        <div className="bg-muted h-2 overflow-hidden rounded-full">
                            <div
                                className="bg-primary-brand h-full rounded-full"
                                style={{
                                    width: `${Math.min(
                                        100,
                                        volunteerSummary.declaredCapacity
                                            ? (volunteerSummary.activeCount / volunteerSummary.declaredCapacity) * 100
                                            : 0
                                    )}%`,
                                }}
                            />
                        </div>
                    </div>
                </Section>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
                <Section
                    title={t("admin.dashboard.alerts.title", { defaultValue: "Alerty" })}
                    actionLabel={t("admin.dashboard.check_more", { defaultValue: "Sprawdź więcej" })}
                    actionTo="/admin/matching/alerts"
                >
                    {alerts.length > 0 ? (
                        <div className="space-y-3">
                            {alerts.slice(0, 4).map((alert, index) => (
                                <div
                                    key={`${alert.created_at}-${index}`}
                                    className="border-border/50 rounded-lg border p-3"
                                >
                                    <p className="text-foreground line-clamp-2 text-sm font-medium">{alert.message}</p>
                                    <p className="text-muted-foreground mt-2 text-xs">{formatDate(alert.created_at)}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <EmptyState>
                            {t("admin.dashboard.alerts.empty", { defaultValue: "Brak alertów parowania." })}
                        </EmptyState>
                    )}
                </Section>

                <Section
                    title={t("admin.dashboard.reports.title", { defaultValue: "Zgłoszenia" })}
                    actionLabel={t("admin.dashboard.check_more", { defaultValue: "Sprawdź więcej" })}
                    actionTo="/admin/reports"
                >
                    {reports.length > 0 ? (
                        <div className="space-y-3">
                            {reports.slice(0, 3).map((report) => (
                                <Link
                                    key={report.id}
                                    to="/admin/reports"
                                    className="border-border/50 hover:border-primary-brand/40 block rounded-lg border p-3 no-underline transition-colors"
                                >
                                    <p className="text-foreground line-clamp-1 text-sm font-medium">{report.subject}</p>
                                    <p className="text-muted-foreground mt-1 line-clamp-2 text-xs">
                                        {report.description}
                                    </p>
                                    <p className="text-muted-foreground mt-2 text-xs">
                                        {report.created_by.full_name || report.created_by.email}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <EmptyState>
                            {t("admin.dashboard.reports.empty", { defaultValue: "Brak otwartych zgłoszeń." })}
                        </EmptyState>
                    )}
                </Section>

                <Section title={t("admin.dashboard.forms.title", { defaultValue: "Formularze" })}>
                    <div className="space-y-3">
                        <Link
                            to="/admin/forms/mentee"
                            className="border-border/50 hover:border-primary-brand/40 flex items-center justify-between gap-3 rounded-lg border p-3 no-underline transition-colors"
                        >
                            <span className="flex min-w-0 items-center gap-3">
                                <span className="bg-primary-brand/10 text-primary-brand flex size-9 shrink-0 items-center justify-center rounded-lg">
                                    <ClipboardList className="size-4" />
                                </span>
                                <span>
                                    <span className="text-foreground block text-sm font-medium">
                                        {t("admin.dashboard.forms.mentees", {
                                            defaultValue: "Formularze osób w kryzysie",
                                        })}
                                    </span>
                                    <span className="text-muted-foreground text-xs">
                                        {menteeForms.slice(0, 1)[0]?.created_by.email ??
                                            t("admin.dashboard.forms.no_oldest", { defaultValue: "Brak oczekujących" })}
                                    </span>
                                </span>
                            </span>
                            <span className="text-foreground text-2xl font-bold">{menteeFormsCount}</span>
                        </Link>
                        <Link
                            to="/admin/forms/volunteer"
                            className="border-border/50 hover:border-primary-brand/40 flex items-center justify-between gap-3 rounded-lg border p-3 no-underline transition-colors"
                        >
                            <span className="flex min-w-0 items-center gap-3">
                                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
                                    <Users className="size-4" />
                                </span>
                                <span>
                                    <span className="text-foreground block text-sm font-medium">
                                        {t("admin.dashboard.forms.volunteers", {
                                            defaultValue: "Formularze wolontariuszy",
                                        })}
                                    </span>
                                    <span className="text-muted-foreground text-xs">
                                        {volunteerForms.slice(0, 1)[0]?.created_by.email ??
                                            t("admin.dashboard.forms.no_oldest", { defaultValue: "Brak oczekujących" })}
                                    </span>
                                </span>
                            </span>
                            <span className="text-foreground text-2xl font-bold">{volunteerFormsCount}</span>
                        </Link>
                    </div>
                </Section>
            </div>
        </div>
    );
};

export default Dashboard;
