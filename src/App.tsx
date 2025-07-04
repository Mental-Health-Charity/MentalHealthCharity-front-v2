import { ThemeProvider } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import posthog from "posthog-js";
import { Suspense, useEffect } from "react";
import ReactGA from "react-ga";
import { BrowserRouter } from "react-router-dom";
import { posthogKey } from "./api";
import { UserProvider } from "./modules/auth/components/AuthProvider";
import Layout from "./modules/shared/components/Layout";
import Loader from "./modules/shared/components/Loader";
import Navbar from "./modules/shared/components/Navbar";
import RootRouter from "./modules/shared/components/RootRouter";
import useTheme from "./theme";

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

    // GOOGLE ANALYTICS
    const TRACKING_ID = "G-E3RQD3DF0T";
    ReactGA.initialize(TRACKING_ID);

    useEffect(() => {
        ReactGA.pageview(window.location.pathname + window.location.search);
    }, []);

    posthog.init(posthogKey, {
        api_host: "https://eu.i.posthog.com",
        person_profiles: "identified_only", // or "always" to create profiles for anonymous users as well
    });

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
