import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Loader2, UserCheck, UserX, Users } from "lucide-react";
import toast from "react-hot-toast";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import updateUserAutomationExclusionMutation from "../modules/matching/queries/updateUserAutomationExclusionMutation";
import { volunteerCapacityQueryOptions } from "../modules/matching/queries/volunteerCapacityQueryOptions";
import { VolunteerCapacityItem } from "../modules/matching/types";
import { useUser } from "../modules/auth/components/AuthProvider";
import AdminLayout from "../modules/shared/components/AdminLayout";
import { isApiDateInFuture } from "../modules/shared/helpers/dateTime";
import formatDate from "../modules/shared/helpers/formatDate";
import { Roles } from "../modules/users/constants";

type ViewMode = "available" | "full";

const isBlocked = isApiDateInFuture;

const isAvailableForMatching = ({ availability }: VolunteerCapacityItem) =>
    availability.declared_capacity !== null &&
    availability.free_slots > 0 &&
    !availability.is_full &&
    !isBlocked(availability.blocked_until);

const MatchingVolunteersScreen = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const { user: currentUser } = useUser();
    const [viewMode, setViewMode] = useState<ViewMode>("available");
    const { data, isError, isLoading } = useQuery(volunteerCapacityQueryOptions());
    const canManageAutomationExclusion = currentUser?.user_role === Roles.ADMIN;
    const { mutate: updateAutomationExclusion, isPending: isAutomationExclusionPending } = useMutation({
        mutationFn: updateUserAutomationExclusionMutation,
        onSuccess: (updatedUser) => {
            queryClient.invalidateQueries({ queryKey: ["matching"] });
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

    const volunteers = data ?? [];
    const availableVolunteers = useMemo(() => volunteers.filter(isAvailableForMatching), [volunteers]);
    const fullVolunteers = useMemo(() => volunteers.filter((item) => !isAvailableForMatching(item)), [volunteers]);
    const items = viewMode === "available" ? availableVolunteers : fullVolunteers;

    const getStatus = ({ availability }: VolunteerCapacityItem) => {
        if (isBlocked(availability.blocked_until)) {
            return {
                label: t("matching.volunteer_status.blocked", { defaultValue: "Zablokowany" }),
                className: "bg-orange-500/15 text-orange-700 dark:text-orange-400",
            };
        }

        if (availability.declared_capacity === null) {
            return {
                label: t("matching.volunteer_status.no_declaration", { defaultValue: "Brak deklaracji" }),
                className: "bg-slate-500/15 text-slate-700 dark:text-slate-400",
            };
        }

        if (availability.is_full) {
            return {
                label: t("matching.volunteer_status.full", { defaultValue: "Pelny" }),
                className: "bg-destructive/15 text-destructive",
            };
        }

        return {
            label: t("matching.volunteer_status.available", { defaultValue: "Dyspozycyjny" }),
            className: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
        };
    };

    const renderRows = (rows: VolunteerCapacityItem[]) =>
        rows.map((item) => {
            const { volunteer, availability } = item;
            const status = getStatus(item);
            const isUpdatingAutomationExclusion = isAutomationExclusionPending;

            return (
                <TableRow key={volunteer.id}>
                    <TableCell>
                        <div className="flex min-w-[180px] flex-col">
                            <span className="text-foreground font-medium">
                                {volunteer.full_name || volunteer.email}
                            </span>
                            <span className="text-muted-foreground text-xs">ID: {volunteer.id}</span>
                        </div>
                    </TableCell>
                    <TableCell>{volunteer.email}</TableCell>
                    <TableCell>
                        <Badge className={cn("border-0", status.className)}>{status.label}</Badge>
                    </TableCell>
                    <TableCell>{availability.declared_capacity ?? "-"}</TableCell>
                    <TableCell>{availability.active_chat_count}</TableCell>
                    <TableCell>{availability.free_slots}</TableCell>
                    <TableCell>
                        {availability.blocked_until && isBlocked(availability.blocked_until)
                            ? formatDate(availability.blocked_until)
                            : "-"}
                    </TableCell>
                    <TableCell>
                        <Badge variant={volunteer.excluded_from_automation ? "destructive" : "secondary"}>
                            {volunteer.excluded_from_automation
                                ? t("matching.excluded", { defaultValue: "Wykluczony" })
                                : t("matching.included", { defaultValue: "Aktywny" })}
                        </Badge>
                    </TableCell>
                    <TableCell>
                        <div className="flex flex-wrap items-center gap-2">
                            {canManageAutomationExclusion && (
                                <Button
                                    size="sm"
                                    variant={volunteer.excluded_from_automation ? "outline" : "destructive"}
                                    onClick={() =>
                                        updateAutomationExclusion({
                                            userId: volunteer.id,
                                            excluded_from_automation: !volunteer.excluded_from_automation,
                                        })
                                    }
                                    disabled={isUpdatingAutomationExclusion}
                                >
                                    {isUpdatingAutomationExclusion ? (
                                        <Loader2 className="size-4 animate-spin" />
                                    ) : (
                                        <UserX className="size-4" />
                                    )}
                                    {volunteer.excluded_from_automation
                                        ? t("matching.include_in_automation", { defaultValue: "Przywróć" })
                                        : t("matching.exclude_from_automation", { defaultValue: "Wyklucz" })}
                                </Button>
                            )}
                            <Link
                                to={`/profile/${volunteer.id}`}
                                className="hover:bg-muted inline-flex h-8 items-center gap-1 rounded-md px-3 text-sm font-medium no-underline"
                            >
                                {t("common.go_to_profile", { defaultValue: "Profil" })}
                            </Link>
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
                                {t("matching.volunteers_title", { defaultValue: "Wolontariusze" })}
                            </h1>
                            <p className="text-muted-foreground text-sm">
                                {t("matching.volunteers_subtitle", {
                                    defaultValue: "Dyspozycyjnosc wolontariuszy w automatycznym parowaniu.",
                                })}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant={viewMode === "available" ? "default" : "outline"}
                            onClick={() => setViewMode("available")}
                        >
                            <UserCheck className="size-4" />
                            {t("matching.volunteers_available", { defaultValue: "Dyspozycyjni" })}
                            <Badge variant="secondary" className="ml-1">
                                {availableVolunteers.length}
                            </Badge>
                        </Button>
                        <Button
                            variant={viewMode === "full" ? "default" : "outline"}
                            onClick={() => setViewMode("full")}
                        >
                            <AlertTriangle className="size-4" />
                            {t("matching.volunteers_full", { defaultValue: "Pelni" })}
                            <Badge variant="secondary" className="ml-1">
                                {fullVolunteers.length}
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
                                <TableHead>{t("matching.declared_capacity", { defaultValue: "Deklaracja" })}</TableHead>
                                <TableHead>{t("matching.active_chats", { defaultValue: "Aktywne czaty" })}</TableHead>
                                <TableHead>{t("matching.free_slots", { defaultValue: "Wolne miejsca" })}</TableHead>
                                <TableHead>{t("matching.blocked_until", { defaultValue: "Blokada do" })}</TableHead>
                                <TableHead>{t("matching.automation", { defaultValue: "Automatyzacja" })}</TableHead>
                                <TableHead>{t("common.actions", { defaultValue: "Akcje" })}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={9} className="text-muted-foreground h-24 text-center">
                                        {t("common.loading", { defaultValue: "Ladowanie..." })}
                                    </TableCell>
                                </TableRow>
                            ) : items.length > 0 ? (
                                renderRows(items)
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={9} className="text-muted-foreground h-24 text-center">
                                        {viewMode === "available"
                                            ? t("matching.no_available_volunteers", {
                                                  defaultValue: "Brak dyspozycyjnych wolontariuszy.",
                                              })
                                            : t("matching.no_full_volunteers", {
                                                  defaultValue: "Brak pelnych lub niedostepnych wolontariuszy.",
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

export default MatchingVolunteersScreen;
