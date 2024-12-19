import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RootRouter from "./modules/shared/components/RootRouter";
import Navbar from "./modules/shared/components/Navbar";
import { ThemeProvider } from "@mui/material";
import Layout from "./modules/shared/components/Layout";
import useTheme from "./theme";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./modules/auth/components/AuthProvider";
import { Suspense } from "react";
import Loader from "./modules/shared/components/Loader";

const queryClient = new QueryClient({
    // defaultOptions: {
    //     mutations: {
    //         onError: (error) => {
    //             handleApiError(error);
    //         },
    //     },
    // },
});

function App() {
    const theme = useTheme();

    return (
        <Suspense fallback={<Loader variant="fullscreen" />}>
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
        </Suspense>
    );
}

export default App;
