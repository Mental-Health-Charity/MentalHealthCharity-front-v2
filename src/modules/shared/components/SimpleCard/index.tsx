import { Box, BoxProps, Typography, TypographyProps } from "@mui/material";
import useTheme from "../../../../theme";

interface Props extends BoxProps {
  subtitle?: string;
  title?: string;
  text?: string;
  titleProps?: TypographyProps;
  textProps?: TypographyProps;
  subtitleProps?: TypographyProps;
}

const SimpleCard = ({
  text,
  title,
  subtitle,
  titleProps,
  textProps,
  subtitleProps,
  ...props
}: Props) => {
  const theme = useTheme();

  return (
    <Box
      {...props}
      sx={{
        padding: "30px 50px",
        boxShadow: `0px 0px 4px ${theme.palette.shadows.box}`,
        backgroundColor: theme.palette.background.paper,
        borderRadius: "8px",
        ...props.sx,
      }}
      component="article"
    >
      <Box
        width="100%"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {subtitle && (
          <Typography
            fontWeight={650}
            fontSize={20}
            color="primary.main"
            {...subtitleProps}
          >
            {subtitle}
          </Typography>
        )}
        {title && (
          <Typography
            fontWeight={650}
            fontSize={24}
            color="text.secondary"
            {...titleProps}
          >
            {title}
          </Typography>
        )}
        {text && (
          <Typography
            fontWeight={500}
            fontSize={18}
            color="text.secondary"
            {...textProps}
          >
            {text}
          </Typography>
        )}
      </Box>
      {props.children}
    </Box>
  );
};

export default SimpleCard;