import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Play, Settings, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { matchingSettingsQueryOptions } from "../modules/matching/queries/matchingSettingsQueryOptions";
import runMatchingMutation from "../modules/matching/queries/runMatchingMutation";
import updateMatchingSettingsMutation from "../modules/matching/queries/updateMatchingSettingsMutation";
import AdminLayout from "../modules/shared/components/AdminLayout";
import formatDate from "../modules/shared/helpers/formatDate";

const AdminSettingsScreen = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const settingsQuery = useQuery(matchingSettingsQueryOptions());
    const isAutomaticMatchingEnabled = settingsQuery.data?.automatic_matching_enabled === true;

    const updateSettings = useMutation({
        mutationFn: updateMatchingSettingsMutation,
        onSuccess: (settings) => {
            queryClient.invalidateQueries({ queryKey: ["matching"] });
            toast.success(
                settings.automatic_matching_enabled
                    ? t("matching.settings_auto_enabled", {
                          defaultValue: "Automatyczne przydzielanie zostało włączone",
                      })
                    : t("matching.settings_auto_disabled", {
                          defaultValue: "Automatyczne przydzielanie zostało wyłączone",
                      })
            );
        },
    });

    const runMatching = useMutation({
        mutationFn: runMatchingMutation,
        onSuccess: (result) => {
            queryClient.invalidateQueries({ queryKey: ["matching"] });
            toast.success(
                t("matching.settings_run_success", {
                    defaultValue: "Utworzono pary: {{count}}",
                    count: result.matched_count,
                })
            );
        },
    });

    const isSaving = updateSettings.isPending || settingsQuery.isFetching;
    const isRunning = runMatching.isPending;

    return (
        <AdminLayout>
            <div className="bg-card border-border/50 rounded-xl border p-6 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary-brand/10 flex size-11 items-center justify-center rounded-lg">
                            <Settings className="text-primary-brand size-5" />
                        </div>
                        <div>
                            <h1 className="text-foreground text-xl font-bold">
                                {t("admin.sidebar.settings", { defaultValue: "Ustawienia" })}
                            </h1>
                            <p className="text-muted-foreground text-sm">
                                {t("matching.settings_subtitle", {
                                    defaultValue: "Konfiguracja procesów i ustawień administracyjnych.",
                                })}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <section className="bg-card border-border/50 mt-5 rounded-xl border p-6 shadow-sm">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                        <div className="flex items-center gap-3">
                            <div className="bg-muted flex size-10 items-center justify-center rounded-lg">
                                <ShieldCheck className="text-muted-foreground size-5" />
                            </div>
                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <h2 className="text-foreground text-lg font-semibold">
                                        {t("matching.settings_auto_title", {
                                            defaultValue: "Automatyczne przydzielanie",
                                        })}
                                    </h2>
                                    <Badge variant={isAutomaticMatchingEnabled ? "success" : "outline"}>
                                        {isAutomaticMatchingEnabled
                                            ? t("common.enabled", { defaultValue: "Włączone" })
                                            : t("common.disabled", { defaultValue: "Wyłączone" })}
                                    </Badge>
                                </div>
                                <p className="text-muted-foreground text-sm">
                                    {isAutomaticMatchingEnabled
                                        ? t("matching.settings_auto_on_description", {
                                              defaultValue:
                                                  "System może automatycznie przydzielać najstarsze oczekujące osoby do dostępnych wolontariuszy.",
                                          })
                                        : t("matching.settings_auto_off_description", {
                                              defaultValue: "Dostępne jest tylko ręczne parowanie.",
                                          })}
                                </p>
                            </div>
                        </div>

                        {settingsQuery.data?.updated_at && (
                            <p className="text-muted-foreground mt-4 text-xs">
                                {t("matching.settings_updated_at", {
                                    defaultValue: "Ostatnia zmiana: {{date}}",
                                    date: formatDate(settingsQuery.data.updated_at),
                                })}
                            </p>
                        )}

                        {settingsQuery.isError && (
                            <p className="text-destructive mt-4 text-sm">
                                {t("common.no_data", { defaultValue: "Nie udało się pobrać danych." })}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                        <button
                            type="button"
                            role="switch"
                            aria-checked={isAutomaticMatchingEnabled}
                            disabled={isSaving}
                            onClick={() =>
                                updateSettings.mutate({
                                    automatic_matching_enabled: !isAutomaticMatchingEnabled,
                                })
                            }
                            className={cn(
                                "focus-visible:ring-ring/40 inline-flex h-10 w-[76px] shrink-0 items-center rounded-full border p-1 transition-colors outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50",
                                isAutomaticMatchingEnabled ? "border-primary bg-primary" : "border-border bg-muted"
                            )}
                        >
                            <span
                                className={cn(
                                    "bg-background block size-8 rounded-full shadow-sm transition-transform",
                                    isAutomaticMatchingEnabled ? "translate-x-8" : "translate-x-0"
                                )}
                            />
                        </button>

                        <Button
                            onClick={() => runMatching.mutate()}
                            disabled={!isAutomaticMatchingEnabled || isRunning}
                            variant="outline"
                        >
                            <Play className={isRunning ? "size-4 animate-pulse" : "size-4"} />
                            {t("matching.settings_run_now", { defaultValue: "Uruchom parowanie teraz" })}
                        </Button>
                    </div>
                </div>
            </section>
        </AdminLayout>
    );
};

export default AdminSettingsScreen;
