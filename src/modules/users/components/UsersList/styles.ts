import { createStyles, makeStyles } from "@mui/styles";
import { Theme } from "@mui/material/styles";

const useUserListStyles = makeStyles((theme: Theme) =>
    createStyles({
        cell: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: `1px solid ${theme.palette.divider}`,
            textAlign: "start",
            wordBreak: "break-all",
        },
    })
);

export default useUserListStyles;
