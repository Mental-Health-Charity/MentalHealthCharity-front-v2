import { IconButton, IconButtonProps, useTheme } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const CloseButton = (props: IconButtonProps) => {
  const theme = useTheme();
  return (
    <IconButton>
      <IconButton
        {...props}
        sx={{
          backgroundColor: theme.palette.colors.danger,
          color: theme.palette.text.primary,
          padding: "2px",
        }}
      >
        {props.children}
        <CloseIcon />
      </IconButton>
    </IconButton>
  );
};

export default CloseButton;
