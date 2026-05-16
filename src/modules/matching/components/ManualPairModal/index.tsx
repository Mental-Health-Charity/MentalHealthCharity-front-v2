import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlertTriangle, Loader2, UserCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Modal from "../../../shared/components/Modal";
import formatDate from "../../../shared/helpers/formatDate";
import { MenteeMatchingItem, VolunteerCapacityItem } from "../../types";

interface Props {
    open: boolean;
    onClose: () => void;
    mentee: MenteeMatchingItem;
    volunteers: VolunteerCapacityItem[];
    isPending?: boolean;
    onSubmit: (volunteer: VolunteerCapacityItem, ignoreCapacity: boolean) => void;
}

const isBlocked = (blockedUntil?: string | null) => Boolean(blockedUntil && new Date(blockedUntil) > new Date());

const isFull = ({ availability }: VolunteerCapacityItem) => availability.is_full || availability.free_slots <= 0;

const ManualPairModal = ({ open, onClose, mentee, volunteers, isPending, onSubmit }: Props) => {
    const { t } = useTranslation();
    const [selectedVolunteerId, setSelectedVolunteerId] = useState<number | null>(null);

    const sortedVolunteers = useMemo(
        () =>
            [...volunteers].sort((a, b) => {
                if (a.volunteer.excluded_from_automation !== b.volunteer.excluded_from_automation) {
                    return a.volunteer.excluded_from_automation ? 1 : -1;
                }

                if (isFull(a) !== isFull(b)) {
                    return isFull(a) ? 1 : -1;
                }

                return (b.availability.free_slots ?? 0) - (a.availability.free_slots ?? 0);
            }),
        [volunteers]
    );

    const selectedVolunteer = sortedVolunteers.find((item) => item.volunteer.id === selectedVolunteerId);
    const selectedIsFull = selectedVolunteer ? isFull(selectedVolunteer) : false;
    const selectedIsBlocked = selectedVolunteer ? isBlocked(selectedVolunteer.availability.blocked_until) : false;

    return (
        <Modal
            open={open}
            onClose={onClose}
            title={t("matching.manual_pair_title", { defaultValue: "Sparuj z wolontariuszem" })}
            className="sm:max-w-3xl"
        >
            <div className="flex flex-col gap-4">
                <div className="rounded-lg border p-3">
                    <p className="text-sm font-medium">{mentee.user.full_name || mentee.user.email}</p>
                    <p className="text-muted-foreground text-xs">
                        {t("common.email", { defaultValue: "Email" })}: {mentee.user.email}
                    </p>
                </div>

                <div className="max-h-[360px] overflow-y-auto rounded-lg border">
                    {sortedVolunteers.length > 0 ? (
                        sortedVolunteers.map((item) => {
                            const { volunteer, availability } = item;
                            const disabled = volunteer.excluded_from_automation;
                            const full = isFull(item);
                            const blocked = isBlocked(availability.blocked_until);
                            const selected = selectedVolunteerId === volunteer.id;

                            return (
                                <button
                                    key={volunteer.id}
                                    type="button"
                                    disabled={disabled || isPending}
                                    onClick={() => setSelectedVolunteerId(volunteer.id)}
                                    className={cn(
                                        "hover:bg-muted/50 flex w-full items-start gap-3 border-b p-3 text-left last:border-b-0 disabled:cursor-not-allowed disabled:opacity-55",
                                        selected && "bg-primary-brand/10"
                                    )}
                                >
                                    <UserCheck className="text-primary-brand mt-1 size-4 shrink-0" />
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="text-foreground font-medium">
                                                {volunteer.full_name || volunteer.email}
                                            </span>
                                            <Badge variant={full ? "destructive" : "secondary"}>
                                                {full
                                                    ? t("matching.availability_full", { defaultValue: "Pełny" })
                                                    : t("matching.availability_available", {
                                                          defaultValue: "Dyspozycyjny",
                                                      })}
                                            </Badge>
                                            {blocked && (
                                                <Badge variant="outline">
                                                    {t("matching.volunteer_status.blocked", {
                                                        defaultValue: "Zablokowany",
                                                    })}
                                                </Badge>
                                            )}
                                            {disabled && (
                                                <Badge variant="destructive">
                                                    {t("matching.excluded", { defaultValue: "Wykluczony" })}
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-muted-foreground mt-1 text-xs">
                                            {volunteer.email} ·{" "}
                                            {t("matching.active_chats", { defaultValue: "Aktywne czaty" })}:{" "}
                                            {availability.active_chat_count} ·{" "}
                                            {t("matching.free_slots", { defaultValue: "Wolne miejsca" })}:{" "}
                                            {availability.free_slots}
                                        </p>
                                        {availability.blocked_until && blocked && (
                                            <p className="text-muted-foreground mt-1 text-xs">
                                                {t("matching.blocked_until", { defaultValue: "Blokada do" })}:{" "}
                                                {formatDate(availability.blocked_until)}
                                            </p>
                                        )}
                                    </div>
                                </button>
                            );
                        })
                    ) : (
                        <p className="text-muted-foreground p-4 text-center text-sm">
                            {t("matching.no_volunteers", { defaultValue: "Brak wolontariuszy." })}
                        </p>
                    )}
                </div>

                {(selectedIsFull || selectedIsBlocked) && (
                    <Alert variant={selectedIsFull ? "destructive" : "default"}>
                        <AlertTriangle className="size-4" />
                        <AlertTitle>
                            {selectedIsFull
                                ? t("matching.manual_pair_capacity_warning_title", {
                                      defaultValue: "Wolontariusz ma pełną dyspozycyjność",
                                  })
                                : t("matching.manual_pair_blocked_warning_title", {
                                      defaultValue: "Wolontariusz jest czasowo zablokowany",
                                  })}
                        </AlertTitle>
                        <AlertDescription>
                            {selectedIsFull
                                ? t("matching.manual_pair_capacity_warning", {
                                      defaultValue: "Ręczne sparowanie nadpisze limit dyspozycyjności wolontariusza.",
                                  })
                                : t("matching.manual_pair_blocked_warning", {
                                      defaultValue:
                                          "Automatyzacja nie wybierze go w czasie blokady, ale ręczne parowanie jest nadal możliwe.",
                                  })}
                        </AlertDescription>
                    </Alert>
                )}

                <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
                        {t("common.cancel", { defaultValue: "Anuluj" })}
                    </Button>
                    <Button
                        type="button"
                        disabled={!selectedVolunteer || isPending}
                        onClick={() => selectedVolunteer && onSubmit(selectedVolunteer, selectedIsFull)}
                    >
                        {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
                        {t("matching.manual_pair_submit", { defaultValue: "Sparuj" })}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default ManualPairModal;
