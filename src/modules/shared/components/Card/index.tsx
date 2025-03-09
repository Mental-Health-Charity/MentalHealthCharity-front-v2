import { Box, BoxProps, Typography, useMediaQuery } from "@mui/material";
import useTheme from "../../../../theme";
import { StyledCard } from "./style";

interface Props extends BoxProps {
    title?: string;
    subtitle?: string;
    variant?: "default" | "secondary";
}

const Card = ({ title, subtitle, variant = "default", ...props }: Props) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    return (
        <StyledCard {...props} variant={variant}>
            {title && (
                <Typography
                    style={{
                        fontWeight: 500,
                    }}
                    variant={isMobile ? "h5" : "h4"}
                >
                    {title}
                </Typography>
            )}
            {subtitle && <Typography variant={isMobile ? "h6" : "h5"}>{subtitle}</Typography>}
            <Box>{props.children}</Box>
        </StyledCard>
    );
};

export default Card;
