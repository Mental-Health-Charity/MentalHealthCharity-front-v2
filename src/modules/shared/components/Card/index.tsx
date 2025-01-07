import { Box, BoxProps, Typography } from "@mui/material";
import { StyledCard } from "./style";

interface Props extends BoxProps {
    title?: string;
    subtitle?: string;
}

const Card = ({ title, subtitle, ...props }: Props) => {
    return (
        <StyledCard {...props}>
            {title && <Typography variant="h4">{title}</Typography>}
            {subtitle && <Typography variant="h5">{subtitle}</Typography>}
            <Box>{props.children}</Box>
        </StyledCard>
    );
};

export default Card;
