import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format, isSameDay, isValid as isValidDate, parseISO, setHours, setMinutes } from "date-fns";
import { pl } from "date-fns/locale";
import { ArrowLeft, CalendarDays, Clock, Trash2 } from "lucide-react";
import React, { useCallback, useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useTranslation } from "react-i18next";

interface DateTimePickerProps {
    values: string[];
    onChange: (values: string[]) => void;
    timeStep?: number;
    workingHours?: [number, number];
}

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
    values,
    onChange,
    timeStep = 30,
    workingHours = [8, 20],
}) => {
    const { t } = useTranslation();

    const [selectedDay, setSelectedDay] = useState<Date | null>(null);
    const [tempHours, setTempHours] = useState<string[]>([]);

    const selectedDates = useMemo(
        () =>
            values
                .map((v) => {
                    try {
                        const d = parseISO(v);
                        return isValidDate(d) ? d : null;
                    } catch {
                        return null;
                    }
                })
                .filter(Boolean) as Date[],
        [values]
    );

    // Group selected slots by day for the summary
    const groupedByDay = useMemo(() => {
        const map = new Map<string, Date[]>();
        for (const d of selectedDates) {
            const key = format(d, "yyyy-MM-dd");
            const arr = map.get(key) || [];
            arr.push(d);
            map.set(key, arr);
        }
        // Sort by date key
        return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
    }, [selectedDates]);

    const hasSlotsForDay = useCallback((day: Date) => selectedDates.some((d) => isSameDay(d, day)), [selectedDates]);

    const toggleTempHour = useCallback((iso: string) => {
        setTempHours((prev) => (prev.includes(iso) ? prev.filter((v) => v !== iso) : [...prev, iso]));
    }, []);

    const saveDaySelection = useCallback(() => {
        if (!selectedDay) return;
        const filtered = values.filter((v) => {
            try {
                const d = parseISO(v);
                return !isSameDay(d, selectedDay);
            } catch {
                return true;
            }
        });

        onChange([...filtered, ...tempHours]);
        setSelectedDay(null);
        setTempHours([]);
    }, [selectedDay, tempHours, values, onChange]);

    const removeDaySlots = useCallback(
        (dayKey: string) => {
            const filtered = values.filter((v) => {
                try {
                    return format(parseISO(v), "yyyy-MM-dd") !== dayKey;
                } catch {
                    return true;
                }
            });
            onChange(filtered);
        },
        [values, onChange]
    );

    const hours: Date[] = useMemo(() => {
        if (!selectedDay) return [];
        const res: Date[] = [];
        for (let h = workingHours[0]; h < workingHours[1]; h++) {
            for (let m = 0; m < 60; m += timeStep) {
                res.push(setMinutes(setHours(selectedDay, h), m));
            }
        }
        return res;
    }, [selectedDay, workingHours, timeStep]);

    return (
        <div className="flex w-full flex-col gap-4">
            {/* Calendar or time picker */}
            {!selectedDay ? (
                <div className="flex flex-col items-center">
                    <DayPicker
                        locale={pl}
                        mode="single"
                        disabled={{ before: new Date() }}
                        selected={selectedDay ?? undefined}
                        onSelect={(day) => {
                            if (day) {
                                const alreadySelected = values.filter((v) => {
                                    try {
                                        return isSameDay(parseISO(v), day);
                                    } catch {
                                        return false;
                                    }
                                });
                                setTempHours(alreadySelected);
                                setSelectedDay(day);
                            }
                        }}
                        modifiers={{
                            hasSlots: (day: Date) => hasSlotsForDay(day),
                        }}
                        modifiersClassNames={{
                            hasSlots: "has-slots",
                        }}
                        captionLayout="dropdown"
                        showOutsideDays
                        className="bg-card max-w-full rounded-xl p-3"
                    />
                </div>
            ) : (
                <div className="flex w-full flex-col gap-4">
                    {/* Back + day header */}
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => {
                                setSelectedDay(null);
                                setTempHours([]);
                            }}
                            className="text-muted-foreground hover:text-foreground hover:bg-muted flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors"
                        >
                            <ArrowLeft className="size-4" />
                        </button>
                        <div>
                            <h3 className="text-foreground text-sm font-semibold">
                                {format(selectedDay, "EEEE, d MMMM", { locale: pl })}
                            </h3>
                            <p className="text-muted-foreground text-xs">
                                {tempHours.length > 0
                                    ? `${tempHours.length} ${tempHours.length === 1 ? "slot" : "slotów"}`
                                    : t("datePicker.noHours", { defaultValue: "Wybierz godziny" })}
                            </p>
                        </div>
                    </div>

                    {/* Time grid - responsive 4 columns */}
                    <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-4">
                        {hours.map((hour) => {
                            const iso = hour.toISOString();
                            const isSelected = tempHours.includes(iso);
                            return (
                                <button
                                    key={iso}
                                    type="button"
                                    aria-pressed={isSelected}
                                    onClick={() => toggleTempHour(iso)}
                                    className={cn(
                                        "flex h-9 items-center justify-center rounded-lg border text-sm font-medium transition-all",
                                        isSelected
                                            ? "border-primary-brand bg-primary-brand text-white"
                                            : "border-border text-foreground hover:border-primary-brand/40 hover:bg-primary-brand/5 bg-transparent"
                                    )}
                                >
                                    {format(hour, "HH:mm")}
                                </button>
                            );
                        })}
                    </div>

                    {/* Save / Cancel */}
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            type="button"
                            className="flex-1"
                            onClick={() => {
                                setSelectedDay(null);
                                setTempHours([]);
                            }}
                        >
                            {t("common.cancel")}
                        </Button>
                        <Button type="button" className="flex-1" onClick={saveDaySelection}>
                            {t("common.save")}
                        </Button>
                    </div>
                </div>
            )}

            {/* Summary of booked slots */}
            {groupedByDay.length > 0 && !selectedDay && (
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <CalendarDays className="text-primary-brand size-4" />
                        <span className="text-foreground text-sm font-medium">
                            {t("datePicker.slotLegend", { defaultValue: "Wybrane terminy" })}
                        </span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        {groupedByDay.map(([dayKey, slots]) => (
                            <div
                                key={dayKey}
                                className="border-border bg-muted/30 flex items-center justify-between gap-3 rounded-xl border px-3 py-2.5"
                            >
                                <div className="min-w-0 flex-1">
                                    <p className="text-foreground text-sm font-medium">
                                        {format(parseISO(dayKey), "EEEE, d MMM", { locale: pl })}
                                    </p>
                                    <div className="text-muted-foreground flex flex-wrap items-center gap-1 text-xs">
                                        <Clock className="size-3 shrink-0" />
                                        {slots
                                            .sort((a, b) => a.getTime() - b.getTime())
                                            .map((s) => format(s, "HH:mm"))
                                            .join(", ")}
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeDaySlots(dayKey)}
                                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex size-7 shrink-0 items-center justify-center rounded-lg transition-colors"
                                >
                                    <Trash2 className="size-3.5" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
