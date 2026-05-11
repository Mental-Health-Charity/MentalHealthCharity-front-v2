import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Loader2, RefreshCw, Save } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import Container from "../modules/shared/components/Container";
import updateVolunteerAvailabilityMutation from "../modules/matching/queries/updateVolunteerAvailabilityMutation";
import { volunteerAvailabilityQueryOptions } from "../modules/matching/queries/volunteerAvailabilityQueryOptions";

const MIN_CAPACITY = 1;
const MAX_CAPACITY = 10;
const CAPACITY_OPTIONS = Array.from({ length: MAX_CAPACITY }, (_, index) => String(index + MIN_CAPACITY));

const formatDateTime = (value?: string | null) => {
    if (!value) return null;

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;

    return new Intl.DateTimeFormat("pl-PL", {
        dateStyle: "short",
        timeStyle: "short",
    }).format(date);
};

const VolunteerAvailabilityScreen = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const [capacity, setCapacity] = useState("2");

    const { data, isLoading, isFetching, isError, refetch } = useQuery(
        volunteerAvailabilityQueryOptions({
            refetchOnWindowFocus: true,
        })
    );

    const { mutate, isPending } = useMutation({
        mutationFn: updateVolunteerAvailabilityMutation,
        onSuccess: (updatedAvailability) => {
            queryClient.setQueryData(["volunteerAvailability"], updatedAvailability);
            setCapacity(String(updatedAvailability.declared_capacity ?? MIN_CAPACITY));
            toast.success(t("matching.availability_saved", { defaultValue: "Dyspozycyjność została zapisana" }));
        },
    });

    useEffect(() => {
        if (!data) return;

        setCapacity(String(data.declared_capacity ?? MIN_CAPACITY));
    }, [data]);

    const activeChatCount = data?.active_chat_count ?? 0;
    const declaredCapacity = data?.declared_capacity ?? null;
    const freeSlots = data?.free_slots ?? 0;
    const selectedCapacity = Number(capacity);
    const selectedBelowCurrentAssignments = selectedCapacity < activeChatCount;
    const blockedUntil = formatDateTime(data?.blocked_until);

    const statusBadge = useMemo(() => {
        if (!data || declaredCapacity === null) {
            return (
                <Badge variant="warning">
                    {t("matching.availability_not_declared", { defaultValue: "Brak deklaracji" })}
                </Badge>
            );
        }

        if (data.is_full) {
            return <Badge variant="warning">{t("matching.availability_full", { defaultValue: "Pełny" })}</Badge>;
        }

        return (
            <Badge variant="success">{t("matching.availability_available", { defaultValue: "Dyspozycyjny" })}</Badge>
        );
    }, [data, declaredCapacity, t]);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!Number.isInteger(selectedCapacity) || isPending) return;

        mutate({ declared_capacity: selectedCapacity });
    };

    if (isLoading) {
        return (
            <Container className="min-h-[50vh] items-center justify-center">
                <Loader2 className="text-muted-foreground size-6 animate-spin" />
            </Container>
        );
    }

    return (
        <Container className="gap-6 pb-12">
            <header className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-foreground text-3xl font-semibold">
                        {t("matching.availability_page_title", { defaultValue: "Dyspozycyjność" })}
                    </h1>
                    {statusBadge}
                </div>
                <p className="text-muted-foreground max-w-3xl text-sm">
                    {t("matching.availability_page_description", {
                        defaultValue:
                            "Zmieniaj na bieżąco liczbę osób w kryzysie, które możesz aktualnie przyjąć do rozmowy.",
                    })}
                </p>
            </header>

            {isError && (
                <Alert variant="destructive">
                    <AlertTriangle />
                    <AlertTitle>{t("common.error", { defaultValue: "Błąd" })}</AlertTitle>
                    <AlertDescription>
                        {t("matching.availability_fetch_error", {
                            defaultValue: "Nie udało się pobrać Twojej dyspozycyjności.",
                        })}
                    </AlertDescription>
                </Alert>
            )}

            <section className="grid gap-3 md:grid-cols-3">
                <div className="border-border bg-card flex flex-col gap-1 rounded-lg border p-4">
                    <span className="text-muted-foreground text-sm">
                        {t("matching.availability_declared_capacity", { defaultValue: "Zadeklarowana liczba" })}
                    </span>
                    <strong className="text-foreground text-2xl">{declaredCapacity ?? "-"}</strong>
                </div>
                <div className="border-border bg-card flex flex-col gap-1 rounded-lg border p-4">
                    <span className="text-muted-foreground text-sm">
                        {t("matching.availability_active_chats", { defaultValue: "Aktywne rozmowy" })}
                    </span>
                    <strong className="text-foreground text-2xl">{activeChatCount}</strong>
                </div>
                <div className="border-border bg-card flex flex-col gap-1 rounded-lg border p-4">
                    <span className="text-muted-foreground text-sm">
                        {t("matching.availability_free_slots", { defaultValue: "Wolne miejsca" })}
                    </span>
                    <strong className="text-foreground text-2xl">{Math.max(freeSlots, 0)}</strong>
                </div>
            </section>

            <section className="border-border bg-card rounded-lg border p-5">
                <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                    <div className="grid gap-4 md:grid-cols-[minmax(240px,320px)_1fr] md:items-end">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="availability-capacity">
                                {t("matching.availability_capacity", { defaultValue: "Liczba osób" })}
                            </Label>
                            <Select
                                value={capacity}
                                onValueChange={(value) => {
                                    if (value) setCapacity(value);
                                }}
                                disabled={isPending}
                            >
                                <SelectTrigger id="availability-capacity" className="h-10 w-full bg-transparent">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {CAPACITY_OPTIONS.map((option) => (
                                        <SelectItem key={option} value={option}>
                                            {option}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-wrap gap-2 md:justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => refetch()}
                                disabled={isFetching || isPending}
                            >
                                <RefreshCw className={isFetching ? "animate-spin" : undefined} />
                                {t("common.refresh", { defaultValue: "Odśwież" })}
                            </Button>
                            <Button type="submit" disabled={isPending}>
                                {isPending ? <Loader2 className="animate-spin" /> : <Save />}
                                {t("common.save")}
                            </Button>
                        </div>
                    </div>

                    <p className="text-muted-foreground text-sm">
                        {t("matching.availability_weekly_time_hint", {
                            defaultValue:
                                "Na jedną osobę w kryzysie przypada co najmniej 1 godzina tygodniowo. Uwzględnij to przy podawaniu swojej dyspozycyjności.",
                        })}
                    </p>
                </form>
            </section>

            {(data?.below_current_assignments || selectedBelowCurrentAssignments) && (
                <Alert variant="destructive">
                    <AlertTriangle />
                    <AlertTitle>{t("matching.availability_warning_title", { defaultValue: "Uwaga" })}</AlertTitle>
                    <AlertDescription>
                        {data?.warning ??
                            t("matching.availability_below_assignments_warning", {
                                defaultValue:
                                    "Liczba obecnych sparowań jest wyższa niż deklarowana dyspozycyjność. Skontaktuj się z koordynatorem, jeśli musisz zrezygnować z któregoś z prowadzonych czatów.",
                            })}
                    </AlertDescription>
                </Alert>
            )}

            {blockedUntil && (
                <Alert>
                    <AlertTitle>
                        {t("matching.availability_blocked_title", {
                            defaultValue: "Automatyzacja chwilowo wstrzymana",
                        })}
                    </AlertTitle>
                    <AlertDescription>
                        {t("matching.availability_blocked_description", {
                            defaultValue: "Nowe automatyczne przypisanie będzie możliwe po: {{date}}.",
                            date: blockedUntil,
                        })}
                    </AlertDescription>
                </Alert>
            )}
        </Container>
    );
};

export default VolunteerAvailabilityScreen;
