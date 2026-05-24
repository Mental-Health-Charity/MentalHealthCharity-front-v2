import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CircleOff, Clock, Loader2, MessageCircle, RotateCw, UserCheck, UserPlus, UserX, Users } from "lucide-react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useUser } from "../modules/auth/components/AuthProvider";
import ManualPairModal from "../modules/matching/components/ManualPairModal";
import adminRematchDecisionMutation from "../modules/matching/queries/adminRematchDecisionMutation";
import manualPairMutation from "../modules/matching/queries/manualPairMutation";
import {
    matchedMenteesQueryOptions,
    pausedMenteesQueryOptions,
    waitingMenteesQueryOptions,
} from "../modules/matching/queries/menteeMatchingQueryOptions";
import updateUserAutomationExclusionMutation from "../modules/matching/queries/updateUserAutomationExclusionMutation";
import { volunteerCapacityQueryOptions } from "../modules/matching/queries/volunteerCapacityQueryOptions";
import { MenteeMatchingItem, MenteeMatchingStatus } from "../modules/matching/types";
import AdminLayout from "../modules/shared/components/AdminLayout";
import formatDate from "../modules/shared/helpers/formatDate";
import { Roles } from "../modules/users/constants";

type ViewMode = "waiting" | "matched" | "paused";

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
    const queryClient = useQueryClient();
    const { user: currentUser } = useUser();
    const [viewMode, setViewMode] = useState<ViewMode>("waiting");
    const [selectedMentee, setSelectedMentee] = useState<MenteeMatchingItem | null>(null);
    const canManageAutomationExclusion = currentUser?.user_role === Roles.ADMIN;

    const waitingQuery = useQuery(waitingMenteesQueryOptions());
    const matchedQuery = useQuery(matchedMenteesQueryOptions());
    const pausedQuery = useQuery(pausedMenteesQueryOptions());
    const volunteersQuery = useQuery(volunteerCapacityQueryOptions());

    const { mutate: manualPair, isPending: isManualPairPending } = useMutation({
        mutationFn: manualPairMutation,
        onSuccess: (data) => {
            setSelectedMentee(null);
            queryClient.invalidateQueries({ queryKey: ["matching"] });
            toast.success(
                data.warning
                    ? t("matching.manual_pair_success_with_warning", {
                          defaultValue: "{{warning}} Czat ID: {{chatId}}",
                          warning: data.warning,
                          chatId: data.chat_id,
                      })
                    : t("matching.manual_pair_success", {
                          defaultValue: "Utworzono ręczne sparowanie. Czat ID: {{chatId}}",
                          chatId: data.chat_id,
                      })
            );
        },
    });
    const { mutate: updateAutomationExclusion, isPending: isAutomationExclusionPending } = useMutation({
        mutationFn: updateUserAutomationExclusionMutation,
        onSuccess: (updatedUser) => {
            queryClient.invalidateQueries({ queryKey: ["matching"] });
            queryClient.invalidateQueries({ queryKey: ["forms"] });
            toast.success(
                updatedUser.excluded_from_automation
                    ? t("matching.automation_exclusion_enabled_success", {
                          defaultValue: "Konto zostało wykluczone z automatycznego parowania",
                      })
                    : t("matching.automation_exclusion_disabled_success", {
                          defaultValue: "Konto wróciło do automatycznego parowania",
                      })
            );
        },
    });
    const { mutate: adminRematchDecision, isPending: isAdminRematchDecisionPending } = useMutation({
        mutationFn: adminRematchDecisionMutation,
        onSuccess: (_state, variables) => {
            queryClient.invalidateQueries({ queryKey: ["matching"] });
            toast.success(
                variables.wants_rematch
                    ? t("matching.admin_rematch_restored_success", {
                          defaultValue: "Osoba została przywrócona do kolejki parowania",
                      })
                    : t("matching.admin_rematch_closed_success", {
                          defaultValue: "Obsługa osoby została oznaczona jako zakończona",
                      })
            );
        },
    });

    const activeQuery = viewMode === "waiting" ? waitingQuery : viewMode === "matched" ? matchedQuery : pausedQuery;
    const items = useMemo(() => activeQuery.data ?? [], [activeQuery.data]);

    const emptyStateText =
        viewMode === "waiting"
            ? t("matching.no_waiting_mentees", {
                  defaultValue: "Brak osob oczekujacych na sparowanie.",
              })
            : viewMode === "matched"
              ? t("matching.no_matched_mentees", {
                    defaultValue: "Brak sparowanych osob w kryzysie.",
                })
              : t("matching.no_paused_mentees", {
                    defaultValue: "Brak wstrzymanych osob po zamknieciu czatu.",
                });

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
        mentees.map((item) => {
            const { user, state } = item;
            const canManualPair =
                viewMode === "waiting" &&
                !state.current_chat_id &&
                !state.excluded_from_automation &&
                [MenteeMatchingStatus.WAITING, MenteeMatchingStatus.REMATCH_REQUESTED].includes(state.status);
            const canResolvePaused = viewMode === "paused" && state.status === MenteeMatchingStatus.PAUSED;
            const isUpdatingAutomationExclusion = isAutomationExclusionPending;
            const isResolvingPaused = isAdminRematchDecisionPending;
            const hasVisibleActions = canManualPair || canResolvePaused || canManageAutomationExclusion;
            const isManualRematch =
                state.status === MenteeMatchingStatus.REMATCH_REQUESTED &&
                !state.auto_matching_enabled &&
                !state.excluded_from_automation;
            const automationBadge = state.excluded_from_automation
                ? {
                      variant: "destructive" as const,
                      label: t("matching.excluded", { defaultValue: "Wykluczony" }),
                  }
                : isManualRematch
                  ? {
                        variant: "outline" as const,
                        label: t("matching.manual_rematch", { defaultValue: "Ręczny rematch" }),
                    }
                  : state.status === MenteeMatchingStatus.MATCHED
                    ? {
                          variant: "success" as const,
                          label: t("matching.active_pair", { defaultValue: "Aktywna para" }),
                      }
                    : state.auto_matching_enabled
                      ? {
                            variant: "secondary" as const,
                            label: t("common.enabled", { defaultValue: "Wlaczona" }),
                        }
                      : {
                            variant: "outline" as const,
                            label: t("common.disabled", { defaultValue: "Wylaczona" }),
                        };

            return (
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
                        <Badge variant={automationBadge.variant}>{automationBadge.label}</Badge>
                    </TableCell>
                    <TableCell>
                        <div className="flex flex-wrap items-center gap-2">
                            {canManualPair && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setSelectedMentee(item)}
                                    disabled={volunteersQuery.isLoading}
                                >
                                    <UserPlus className="size-4" />
                                    {isManualRematch
                                        ? t("matching.manual_rematch_pair_submit", { defaultValue: "Sparuj ręcznie" })
                                        : t("matching.manual_pair_submit", { defaultValue: "Sparuj" })}
                                </Button>
                            )}
                            {canResolvePaused && (
                                <>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() =>
                                            adminRematchDecision({
                                                userId: user.id,
                                                wants_rematch: true,
                                            })
                                        }
                                        disabled={isResolvingPaused}
                                    >
                                        {isResolvingPaused ? (
                                            <Loader2 className="size-4 animate-spin" />
                                        ) : (
                                            <RotateCw className="size-4" />
                                        )}
                                        {t("matching.restore_to_queue", { defaultValue: "Przywróć do kolejki" })}
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() =>
                                            adminRematchDecision({
                                                userId: user.id,
                                                wants_rematch: false,
                                            })
                                        }
                                        disabled={isResolvingPaused}
                                    >
                                        {isResolvingPaused ? (
                                            <Loader2 className="size-4 animate-spin" />
                                        ) : (
                                            <CircleOff className="size-4" />
                                        )}
                                        {t("matching.mark_support_closed", { defaultValue: "Zakończ obsługę" })}
                                    </Button>
                                </>
                            )}
                            {canManageAutomationExclusion && (
                                <Button
                                    size="sm"
                                    variant={state.excluded_from_automation ? "outline" : "destructive"}
                                    onClick={() =>
                                        updateAutomationExclusion({
                                            userId: user.id,
                                            excluded_from_automation: !state.excluded_from_automation,
                                        })
                                    }
                                    disabled={isUpdatingAutomationExclusion}
                                >
                                    {isUpdatingAutomationExclusion ? (
                                        <Loader2 className="size-4 animate-spin" />
                                    ) : (
                                        <UserX className="size-4" />
                                    )}
                                    {state.excluded_from_automation
                                        ? t("matching.include_in_automation", { defaultValue: "Przywróć" })
                                        : t("matching.exclude_from_automation", { defaultValue: "Wyklucz" })}
                                </Button>
                            )}
                            {!hasVisibleActions && <span className="text-muted-foreground">-</span>}
                        </div>
                    </TableCell>
                </TableRow>
            );
        });

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
                        <Button
                            variant={viewMode === "paused" ? "default" : "outline"}
                            onClick={() => setViewMode("paused")}
                        >
                            <CircleOff className="size-4" />
                            {t("matching.mentees_paused", { defaultValue: "Wstrzymane" })}
                            <Badge variant="secondary" className="ml-1">
                                {pausedQuery.data?.length ?? 0}
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
                                <TableHead>{t("common.actions", { defaultValue: "Akcje" })}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {activeQuery.isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-muted-foreground h-24 text-center">
                                        {t("common.loading", { defaultValue: "Ladowanie..." })}
                                    </TableCell>
                                </TableRow>
                            ) : items.length > 0 ? (
                                renderRows(items)
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-muted-foreground h-24 text-center">
                                        {emptyStateText}
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

            {selectedMentee && (
                <ManualPairModal
                    open={!!selectedMentee}
                    onClose={() => setSelectedMentee(null)}
                    mentee={selectedMentee}
                    volunteers={volunteersQuery.data ?? []}
                    isPending={isManualPairPending}
                    onSubmit={(volunteer, ignoreCapacity) =>
                        manualPair({
                            user_id: selectedMentee.user.id,
                            volunteer_id: volunteer.volunteer.id,
                            ignore_capacity: ignoreCapacity,
                        })
                    }
                />
            )}
        </AdminLayout>
    );
};

export default MatchingMenteesScreen;
