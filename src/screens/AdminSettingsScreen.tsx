import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Clock3, Play, Save, Settings, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { chatInactivitySettingsQueryOptions } from "../modules/chat/queries/chatInactivitySettingsQueryOptions";
import updateChatInactivitySettingsMutation from "../modules/chat/queries/updateChatInactivitySettingsMutation";
import { ChatInactivitySettingsUpdate } from "../modules/chat/types";
import { matchingSettingsQueryOptions } from "../modules/matching/queries/matchingSettingsQueryOptions";
import runMatchingMutation from "../modules/matching/queries/runMatchingMutation";
import updateMatchingSettingsMutation from "../modules/matching/queries/updateMatchingSettingsMutation";
import AdminLayout from "../modules/shared/components/AdminLayout";
import formatDate from "../modules/shared/helpers/formatDate";

const AdminSettingsScreen = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const settingsQuery = useQuery(matchingSettingsQueryOptions());
    const inactivitySettingsQuery = useQuery(chatInactivitySettingsQueryOptions());
    const [inactivitySettings, setInactivitySettings] = useState<ChatInactivitySettingsUpdate>({
        empty_or_starter_timeout_days: 7,
        conversation_timeout_days: 14,
        snooze_extension_days: 7,
    });
    const isAutomaticMatchingEnabled = settingsQuery.data?.automatic_matching_enabled === true;

    useEffect(() => {
        if (!inactivitySettingsQuery.data) return;

        setInactivitySettings({
            empty_or_starter_timeout_days: inactivitySettingsQuery.data.empty_or_starter_timeout_days,
            conversation_timeout_days: inactivitySettingsQuery.data.conversation_timeout_days,
            snooze_extension_days: inactivitySettingsQuery.data.snooze_extension_days,
        });
    }, [inactivitySettingsQuery.data]);

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

    const updateInactivitySettings = useMutation({
        mutationFn: updateChatInactivitySettingsMutation,
        onSuccess: (settings) => {
            queryClient.setQueryData(["chat", "inactivity-settings"], settings);
            setInactivitySettings({
                empty_or_starter_timeout_days: settings.empty_or_starter_timeout_days,
                conversation_timeout_days: settings.conversation_timeout_days,
                snooze_extension_days: settings.snooze_extension_days,
            });
            toast.success(
                t("chat.inactivity_settings.saved", {
                    defaultValue: "Ustawienia automatycznego zamykania zostały zapisane",
                })
            );
        },
    });

    const isSaving = updateSettings.isPending || settingsQuery.isFetching;
    const isRunning = runMatching.isPending;
    const inactivityValuesAreValid = Object.values(inactivitySettings).every(
        (value) => Number.isInteger(value) && value >= 1 && value <= 365
    );

    const setInactivitySetting = (field: keyof ChatInactivitySettingsUpdate, value: string) => {
        setInactivitySettings((current) => ({
            ...current,
            [field]: Number(value),
        }));
    };

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

            <section className="bg-card border-border/50 mt-5 rounded-xl border p-6 shadow-sm">
                <div className="flex items-start gap-3">
                    <div className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-lg">
                        <Clock3 className="text-muted-foreground size-5" />
                    </div>
                    <div>
                        <h2 className="text-foreground text-lg font-semibold">
                            {t("chat.inactivity_settings.title", {
                                defaultValue: "Automatyczne zamykanie chatów",
                            })}
                        </h2>
                        <p className="text-muted-foreground text-sm">
                            {t("chat.inactivity_settings.description", {
                                defaultValue:
                                    "Terminy są stosowane do nowych chatów oraz przy kolejnej wiadomości lub drzemce. Nie zmieniają już wyznaczonych terminów.",
                            })}
                        </p>
                    </div>
                </div>

                <div className="mt-6 grid gap-5 md:grid-cols-3">
                    <div className="space-y-2">
                        <Label htmlFor="empty-or-starter-timeout">
                            {t("chat.inactivity_settings.empty_or_starter_label", {
                                defaultValue: "Pusty lub tylko startowy",
                            })}
                        </Label>
                        <Input
                            id="empty-or-starter-timeout"
                            type="number"
                            min={1}
                            max={365}
                            value={inactivitySettings.empty_or_starter_timeout_days}
                            disabled={inactivitySettingsQuery.isLoading || updateInactivitySettings.isPending}
                            onChange={(event) =>
                                setInactivitySetting("empty_or_starter_timeout_days", event.target.value)
                            }
                        />
                        <p className="text-muted-foreground text-xs">
                            {t("chat.inactivity_settings.days_after_inactivity", {
                                defaultValue: "Dni bez aktywności",
                            })}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="conversation-timeout">
                            {t("chat.inactivity_settings.conversation_label", {
                                defaultValue: "Chat z rozmową",
                            })}
                        </Label>
                        <Input
                            id="conversation-timeout"
                            type="number"
                            min={1}
                            max={365}
                            value={inactivitySettings.conversation_timeout_days}
                            disabled={inactivitySettingsQuery.isLoading || updateInactivitySettings.isPending}
                            onChange={(event) => setInactivitySetting("conversation_timeout_days", event.target.value)}
                        />
                        <p className="text-muted-foreground text-xs">
                            {t("chat.inactivity_settings.days_after_inactivity", {
                                defaultValue: "Dni bez aktywności",
                            })}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="snooze-extension">
                            {t("chat.inactivity_settings.snooze_label", {
                                defaultValue: "Jedna drzemka",
                            })}
                        </Label>
                        <Input
                            id="snooze-extension"
                            type="number"
                            min={1}
                            max={365}
                            value={inactivitySettings.snooze_extension_days}
                            disabled={inactivitySettingsQuery.isLoading || updateInactivitySettings.isPending}
                            onChange={(event) => setInactivitySetting("snooze_extension_days", event.target.value)}
                        />
                        <p className="text-muted-foreground text-xs">
                            {t("chat.inactivity_settings.extension_days", {
                                defaultValue: "Dodawane dni",
                            })}
                        </p>
                    </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        {inactivitySettingsQuery.data?.updated_at && (
                            <p className="text-muted-foreground text-xs">
                                {t("matching.settings_updated_at", {
                                    defaultValue: "Ostatnia zmiana: {{date}}",
                                    date: formatDate(inactivitySettingsQuery.data.updated_at),
                                })}
                            </p>
                        )}
                        {inactivitySettingsQuery.isError && (
                            <p className="text-destructive text-sm">
                                {t("common.no_data", { defaultValue: "Nie udało się pobrać danych." })}
                            </p>
                        )}
                    </div>

                    <Button
                        type="button"
                        disabled={
                            inactivitySettingsQuery.isLoading ||
                            updateInactivitySettings.isPending ||
                            !inactivityValuesAreValid
                        }
                        onClick={() => updateInactivitySettings.mutate(inactivitySettings)}
                    >
                        <Save className="size-4" />
                        {updateInactivitySettings.isPending
                            ? t("chat.inactivity_settings.saving", { defaultValue: "Zapisywanie..." })
                            : t("common.save", { defaultValue: "Zapisz" })}
                    </Button>
                </div>
            </section>
        </AdminLayout>
    );
};

export default AdminSettingsScreen;
