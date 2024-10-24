import { Button, styled } from "@mui/material";

export const ChangeAvatarButton = styled(Button)({
  position: "absolute",
  width: "100%",
  height: "100%",
  bottom: "0",
  left: "0",
  opacity: "0",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",

  "&:hover": {
    opacity: "1",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});
