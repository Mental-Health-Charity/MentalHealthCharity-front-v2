import { styled } from "@mui/material";
import { Theme } from "@mui/material/styles";

type Variant = "danger" | "warning" | "info";

interface StyledAlertProps {
    variant?: Variant;
}

export const StyledAlert = styled("div", {
    shouldForwardProp: (prop) => prop !== "variant",
})<StyledAlertProps>(({ theme, variant = "info" }) => {
    const getVariantStyles = (variant: Variant, theme: Theme) => {
        switch (variant) {
            case "danger":
                return {
                    backgroundColor: theme.palette.error.light,
                    color: theme.palette.error.contrastText,
                };
            case "warning":
                return {
                    backgroundColor: theme.palette.warning.light,
                    color: theme.palette.warning.contrastText,
                };
            case "info":
            default:
                return {
                    backgroundColor: theme.palette.info.light,
                    color: theme.palette.info.contrastText,
                };
        }
    };

    return {
        padding: "10px",
        borderRadius: "0 0 8px 8px",
        position: "absolute",
        bottom: "-60px",
        boxShadow: `0 0 0px -1px ${theme.palette.shadows.box}`,
        width: "100%",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "10px",
        fontSize: "16px",
        fontWeight: 500,
        ...getVariantStyles(variant, theme),

        "@media (max-width: 1100px)": {
            bottom: "-80px",
        },
    };
});
