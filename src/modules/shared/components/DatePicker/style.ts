import { Box, Button, keyframes, Paper, styled } from "@mui/material";
import { DayPicker } from "react-day-picker";

/**
 * Style notes:
 * - Używam hexów bez polegania na palette (możesz potem zamienić na theme.palette).
 * - Drobne animacje, focus outlines, i przyjazne touch targets.
 * - Eksportuję komponenty styled, tak jak prosiłeś.
 */

/* Colors (hex) */
const MUTED = "#6b7280";
const RING = "rgba(11,118,255,0.18)";
const SHADOW = "0 6px 18px rgba(2,6,23,0.12)";

/* Animations */
const popIn = keyframes`
  from { transform: translateY(6px) scale(0.98); opacity: 0; }
  to { transform: translateY(0) scale(1); opacity: 1; }
`;

export const Container = styled(Box)(() => ({
    width: "100%",
    maxWidth: 560,
    margin: "auto",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: '"Inter", "Segoe UI", Roboto, "Helvetica Neue", Arial',
}));

export const StyledDayPicker = styled(DayPicker)(({ theme }) => ({
    "--rdp-cell-size": "46px",
    "--rdp-accent-color": theme.palette.primary.main,
    borderRadius: 12,
    boxShadow: SHADOW,
    maxWidth: "fit-content",
    padding: 14,
    background: theme.palette.background.paper,
    animation: `${popIn} 220ms ease`,
    ".rdp-caption": {
        marginBottom: 8,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        ".rdp-caption_label": {
            fontWeight: 600,
            fontSize: 16,
            color: "#0f1724",
        },
    },
    ".rdp-day": {
        borderRadius: 8,
        transition: "transform 140ms, box-shadow 140ms",
        ":hover": {
            transform: "translateY(-3px)",
            boxShadow: "0 6px 14px rgba(15,23,36,0.06)",
        },
    },
    ".rdp-day_selected:not([disabled])": {
        backgroundColor: theme.palette.primary.main,
        boxShadow: `0 8px 22px rgba(11,118,255,0.14)`,
    },
    ".rdp-day_outside": {
        opacity: 0.45,
    },
    ".rdp-day_today": {
        fontWeight: 700,
        boxShadow: "inset 0 0 0 1px rgba(11,118,255,0.08)",
    },
    ".has-slots::after": {
        content: '""',
        display: "block",
        width: 8,
        height: 8,
        borderRadius: "50%",
        backgroundColor: theme.palette.primary.main,
        margin: "6px auto 0",
        boxShadow: `0 3px 8px rgba(11,118,255,0.12)`,
    },
    ".rdp-nav": {
        button: {
            minWidth: 38,
            height: 38,
            borderRadius: 10,
        },
    },
}));

export const PaperView = styled(Paper)(({ theme }) => ({
    padding: 20,
    width: "100%",
    textAlign: "center",
    borderRadius: 12,
    background: theme.palette.background.paper,
    boxShadow: SHADOW,
    animation: `${popIn} 220ms ease`,
}));

export const HeaderRow = styled("div")(() => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 30,
    marginBottom: 12,
}));

export const Legend = styled("div")(() => ({
    display: "flex",
    alignItems: "center",
    gap: 8,
}));

export const LegendDot = styled("div")(({ theme }) => ({
    width: 10,
    height: 10,
    borderRadius: "50%",
    background: theme.palette.primary.main,
    boxShadow: `0 4px 10px rgba(11,118,255,0.12)`,
}));

export const EmptyState = styled("div")(() => ({
    padding: "24px 8px",
    color: MUTED,
    borderRadius: 8,
    background: "#fbfdff",
    marginTop: 6,
}));

export const TimeGrid = styled("div")(() => ({
    display: "grid",
    gap: 8,
    alignItems: "stretch",
    marginTop: 8,
}));

/**
 * TimeButton:
 * - uses Button as base to keep keyboard/focus behavior
 * - $selected prop allows style switching
 */
export const TimeButton = styled(Button, {
    shouldForwardProp: (prop) => prop !== "$selected",
})<{ $selected?: boolean }>(({ $selected, theme }) => ({
    textTransform: "none",
    color: $selected ? "#ffffff" : "#0f1724",
    fontSize: 13,
    padding: "8px 10px",
    borderRadius: 10,
    minWidth: 64,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    boxShadow: $selected ? `0 6px 18px rgba(11,118,255,0.16)` : "none",
    background: $selected ? theme.palette.primary.main : "#fbfdff",
    border: $selected ? `1px solid ${theme.palette.primary.main}` : `1px solid rgba(15,23,36,0.06)`,
    transition: "transform 140ms ease, box-shadow 140ms ease, background 140ms",
    ":hover": {
        transform: "translateY(-3px)",
        background: $selected ? theme.palette.primary.dark : "#f6f9ff",
    },
    ":focus": {
        outline: "none",
        boxShadow: `0 0 0 6px ${RING}`,
    },
}));

export const FooterActions = styled("div")(() => ({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "nowrap",
    marginTop: 20,
    gap: 8,

    "& button": {
        padding: "6px 16px",
        width: "100%",
        fontSize: 16,
    },
}));
