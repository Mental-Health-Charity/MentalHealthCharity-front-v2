import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RootRouter from "./modules/shared/components/RootRouter";
import Navbar from "./modules/shared/components/Navbar";
import { ThemeProvider } from "@mui/material";
import Layout from "./modules/shared/components/Layout";
import useTheme from "./theme";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./modules/auth/components/AuthProvider";

const queryClient = new QueryClient();

function App() {
  const theme = useTheme();

  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <Layout>
              <Navbar />
              <RootRouter />
            </Layout>
          </ThemeProvider>
        </BrowserRouter>
      </UserProvider>
    </QueryClientProvider>
  );
}

export default App;
