import { Box } from "@mui/material";
import React from "react";
import useTheme from "../../../../theme";
import { Toaster } from "react-hot-toast";

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Toaster position="top-center" reverseOrder={false} />
      {children}
    </Box>
  );
};

export default Layout;
