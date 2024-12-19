import { Route, Routes } from "react-router-dom";
import routes from "../../routes";
import { useUser } from "../../../auth/components/AuthProvider";
import usePermissions from "../../hooks/usePermissions";
import NotFoundScreen from "../../../../screens/NotFoundScreen";
import LoginScreen from "../../../../screens/LoginScreen";

const RootRouter = () => {
    const { user } = useUser();
    const { hasPermissions } = usePermissions(user);

    return (
        <Routes>
            {routes.map((route) => {
                const isAuthenticated = !!user;
                const canAccess =
                    (!route.requiresAuth || isAuthenticated) &&
                    (!route.permission || hasPermissions(route.permission));

                return (
                    <Route
                        key={route.url}
                        path={route.url}
                        element={
                            canAccess ? (
                                route.onRender
                            ) : route.requiresAuth && !isAuthenticated ? (
                                <LoginScreen />
                            ) : (
                                <NotFoundScreen />
                            )
                        }
                    />
                );
            })}
        </Routes>
    );
};

export default RootRouter;
