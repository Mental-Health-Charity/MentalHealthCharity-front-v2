import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format, isSameDay, isValid as isValidDate, parseISO, setHours, setMinutes } from "date-fns";
import { pl } from "date-fns/locale";
import React, { useCallback, useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useTranslation } from "react-i18next";

interface DateTimePickerProps {
    values: string[];
    onChange: (values: string[]) => void;
    timeStep?: number;
    workingHours?: [number, number];
    maxColumns?: number;
}

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
    values,
    onChange,
    timeStep = 30,
    workingHours = [8, 20],
    maxColumns = 5,
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
        <div>
            {!selectedDay ? (
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
                    className="animate-in fade-in bg-card max-w-fit rounded-xl p-3.5 shadow-[0_6px_18px_rgba(2,6,23,0.12)]"
                />
            ) : (
                <div className="animate-in fade-in bg-card w-full rounded-xl p-5 text-center shadow-[0_6px_18px_rgba(2,6,23,0.12)]">
                    {/* Header */}
                    <div className="mb-3 flex items-center justify-between gap-7">
                        <h3 className="text-foreground text-lg font-semibold">
                            {format(selectedDay, "EEEE, d MMMM yyyy", { locale: pl })}
                        </h3>
                        <div className="flex items-center gap-2">
                            <div className="bg-primary-brand h-2.5 w-2.5 rounded-full shadow-[0_4px_10px_rgba(11,118,255,0.12)]" />
                            <span className="text-primary-brand text-xs">{t("datePicker.slotLegend")}</span>
                        </div>
                    </div>

                    {/* Time grid */}
                    {hours.length === 0 ? (
                        <div className="text-muted-foreground mt-1.5 rounded-lg bg-[#fbfdff] px-2 py-6">
                            <p>{t("datePicker.noHours")}</p>
                        </div>
                    ) : (
                        <div className="mt-2 grid gap-2" style={{ gridTemplateColumns: `repeat(${maxColumns}, 1fr)` }}>
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
                                            "flex h-10 min-w-16 items-center justify-center rounded-[10px] border text-sm transition-all hover:-translate-y-0.5",
                                            isSelected
                                                ? "border-primary-brand bg-primary-brand text-white shadow-[0_6px_18px_rgba(11,118,255,0.16)]"
                                                : "text-foreground border-[rgba(15,23,36,0.06)] bg-[#fbfdff] hover:bg-[#f6f9ff]"
                                        )}
                                    >
                                        {format(hour, "HH:mm")}
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {/* Footer actions */}
                    <div className="mt-5 flex flex-nowrap items-center justify-center gap-2">
                        <Button
                            variant="outline"
                            className="w-full text-base"
                            onClick={() => {
                                setSelectedDay(null);
                                setTempHours([]);
                            }}
                        >
                            {t("common.cancel")}
                        </Button>
                        <Button className="w-full text-base" onClick={saveDaySelection}>
                            {t("common.save")}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};
