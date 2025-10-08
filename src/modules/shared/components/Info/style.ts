import { styled, Typography } from "@mui/material";

export const Wrapper = styled(Typography)(({ theme }) => ({
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1),
    backgroundColor: `${theme.palette.colors.info}1b`,
    border: `2px solid ${theme.palette.colors.info}1b`,
    color: theme.palette.colors.info,
    fontWeight: 600,
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing(1),
    fontSize: "16px",

    // on mobile text left and smaller
    [theme.breakpoints.down("sm")]: {
        fontSize: "14px",
        textAlign: "left",
    },
}));
