import { Box, BoxProps, useTheme } from "@mui/material";
import wave_icon from "../../../../assets/static/wave.svg";

interface Props extends BoxProps {
  waves?: boolean;
  parentProps?: BoxProps;
}

const Container = ({ waves, parentProps, ...props }: Props) => {
  const theme = useTheme();

  return (
    <Box
      {...parentProps}
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        background: waves ? `${theme.palette.primary.main}1A` : "inherit",

        "&:before": {
          display: waves ? "block" : "none",
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 0,
          width: "100%",
          height: "500px",
          backgroundImage: `url(${wave_icon})`,
          rotate: "180deg",
          backgroundSize: "cover",
          backgroundPosition: "center",
        },
        "&:after": {
          display: waves ? "block" : "none",
          content: '""',
          position: "absolute",
          top: 200,
          left: 0,
          zIndex: 0,
          width: "100%",
          height: "500px",
          opacity: 0.5,
          backgroundImage: `url(${wave_icon})`,
          rotate: "180deg",
          backgroundSize: "cover",
          backgroundPosition: "center",
        },
        ...(parentProps?.sx || {}),
      }}
    >
      <Box
        {...props}
        sx={{
          ...props.sx,
          display: "flex",
          marginTop: "100px",
          width: "100%",
          maxWidth: "1650px",
          zIndex: 10,
          flexDirection: "column",
        }}
      >
        {props.children}
      </Box>
    </Box>
  );
};

export default Container;