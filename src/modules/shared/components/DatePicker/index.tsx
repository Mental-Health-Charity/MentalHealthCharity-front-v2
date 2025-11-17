import { Box, Button, Typography } from "@mui/material";
import { format, isSameDay, isValid as isValidDate, parseISO, setHours, setMinutes } from "date-fns";
import { pl } from "date-fns/locale";
import React, { useCallback, useMemo, useState } from "react";
import "react-day-picker/dist/style.css";

import {
    EmptyState,
    FooterActions,
    HeaderRow,
    Legend,
    LegendDot,
    PaperView,
    StyledDayPicker,
    TimeButton,
    TimeGrid,
} from "./style";

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
        <Box>
            {!selectedDay ? (
                <StyledDayPicker
                    locale={pl}
                    mode="single"
                    disabled={{ before: new Date() }}
                    selected={selectedDay ?? undefined}
                    onSelect={(day) => {
                        if (day) {
                            const alreadySelected = values
                                .filter((v) => {
                                    try {
                                        return isSameDay(parseISO(v), day);
                                    } catch {
                                        return false;
                                    }
                                })
                                .map((v) => v);

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
                />
            ) : (
                <PaperView elevation={3}>
                    <HeaderRow>
                        <Typography color="#153243" variant="h6">
                            {format(selectedDay, "EEEE, d MMMM yyyy", { locale: pl })}
                        </Typography>

                        <Legend>
                            <LegendDot />
                            <Typography color="primary.main" variant="caption">
                                {t("datePicker.slotLegend")}
                            </Typography>
                        </Legend>
                    </HeaderRow>

                    {hours.length === 0 ? (
                        <EmptyState>
                            <Typography>{t("datePicker.noHours")}</Typography>
                        </EmptyState>
                    ) : (
                        <TimeGrid style={{ gridTemplateColumns: `repeat(${maxColumns}, 1fr)` }}>
                            {hours.map((hour) => {
                                const iso = hour.toISOString();
                                const isSelected = tempHours.includes(iso);
                                return (
                                    <TimeButton
                                        key={iso}
                                        variant={isSelected ? "contained" : "outlined"}
                                        aria-pressed={isSelected}
                                        onClick={() => toggleTempHour(iso)}
                                        $selected={isSelected}
                                    >
                                        {format(hour, "HH:mm")}
                                    </TimeButton>
                                );
                            })}
                        </TimeGrid>
                    )}

                    <FooterActions>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() => {
                                setSelectedDay(null);
                                setTempHours([]);
                            }}
                        >
                            {t("common.cancel")}
                        </Button>

                        <Button variant="contained" size="small" onClick={saveDaySelection}>
                            {t("common.save")}
                        </Button>
                    </FooterActions>
                </PaperView>
            )}
        </Box>
    );
};
