import { createStyles, makeStyles } from "@mui/styles";
import { Theme } from "@mui/material/styles";

const useWindowGridVirtualizerStyles = makeStyles((theme: Theme) =>
    createStyles({
        gridTable: {
            borderRadius: "0 0 12px 12px",
            marginTop: "10px",
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.secondary,
            boxShadow: `0px 0px 5px ${theme.palette.shadows.box}`,
        },
    })
);

export default useWindowGridVirtualizerStyles;
