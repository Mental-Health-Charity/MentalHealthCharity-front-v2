import { Box, Chip } from "@mui/material";
import { formatDate } from "date-fns";
import { isISODate } from "../../isISODate";
import { FieldRendererPlugin } from "../formRenderer";

export const arrayOfIsoDatesPlugin: FieldRendererPlugin = {
    predicate: (value) => Array.isArray(value) && value.every((v) => typeof v === "string" && isISODate(v)),
    render: (value) => (
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {(value as string[]).map((date) => (
                <Chip
                    key={date}
                    color="info"
                    label={formatDate(new Date(date), "dd/MM/yyyy HH:mm")}
                    sx={{ fontSize: "14px" }}
                />
            ))}
        </Box>
    ),
};
