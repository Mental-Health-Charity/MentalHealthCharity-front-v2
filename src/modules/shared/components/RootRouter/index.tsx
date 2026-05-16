import { Navigate, Route, Routes } from "react-router-dom";
import LoginScreen from "../../../../screens/LoginScreen";
import NotFoundScreen from "../../../../screens/NotFoundScreen";
import { useUser } from "../../../auth/components/AuthProvider";
import usePermissions from "../../hooks/usePermissions";
import routes from "../../routes";

const RootRouter = () => {
    const { user, isLoading, isFetchingUser } = useUser();
    const { hasPermissions } = usePermissions();

    return (
        <Routes>
            {routes.map((route) => {
                const isAuthenticated = !!user;
                const isAuthStatePending = route.requiresAuth && !isAuthenticated && (isLoading || isFetchingUser);
                const hasAllowedRole = !route.roles || (!!user && route.roles.includes(user.user_role));
                const canAccess =
                    (!route.requiresAuth || isAuthenticated) &&
                    (!route.permission || hasPermissions(route.permission)) &&
                    hasAllowedRole;

                return (
                    <Route
                        key={route.url}
                        path={route.url}
                        element={
                            isAuthStatePending ? null : canAccess ? (
                                route.onRender
                            ) : route.requiresAuth && !isAuthenticated ? (
                                route.unauthenticatedRedirect ? (
                                    <Navigate to={route.unauthenticatedRedirect} replace />
                                ) : (
                                    <LoginScreen />
                                )
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
