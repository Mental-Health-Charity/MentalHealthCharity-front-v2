import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import useTheme from "../../../../theme";

interface DataSet {
    [key: string]: string | number | boolean | null;
}

interface Props {
    dataA: DataSet;
    dataB: DataSet;
}

const DataComparison = ({ dataA, dataB }: Props) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const differences = Object.keys(dataA).reduce(
        (acc, key) => {
            if (dataA[key] !== dataB[key]) {
                acc[key] = {
                    oldValue: dataA[key],
                    newValue: dataB[key],
                };
            }
            return acc;
        },
        {} as Record<string, { oldValue: unknown; newValue: unknown }>
    );

    return (
        <Box>
            {Object.keys(differences).length === 0 ? (
                <Typography
                    sx={{
                        color: theme.palette.text.secondary,
                    }}
                    variant="body1"
                >
                    {t("common.compare_changes.no_changes")}
                </Typography>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell
                                    sx={{
                                        color: theme.palette.text.secondary,
                                    }}
                                >
                                    {t("common.compare_changes.field")}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        color: theme.palette.text.secondary,
                                    }}
                                >
                                    {t("common.compare_changes.old_value")}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        color: theme.palette.text.secondary,
                                    }}
                                >
                                    {t("common.compare_changes.new_value")}
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody
                            sx={{
                                color: theme.palette.text.secondary,
                            }}
                        >
                            {Object.entries(differences).map(([field, { oldValue, newValue }]) => (
                                <TableRow key={field}>
                                    <TableCell
                                        sx={{
                                            color: theme.palette.text.secondary,
                                        }}
                                    >
                                        {field}
                                    </TableCell>
                                    <TableCell style={{ color: "red" }}>{String(oldValue) || "—"}</TableCell>
                                    <TableCell style={{ color: "green" }}>{String(newValue) || "—"}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
};

export default DataComparison;
