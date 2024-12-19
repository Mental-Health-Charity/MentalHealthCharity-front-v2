import React, { createContext, useContext, useState, ReactNode } from "react";
import {
    useMutation,
    UseMutationResult,
    useQuery,
    UseQueryResult,
} from "@tanstack/react-query";
import Cookies from "js-cookie";
import { loginMutation } from "../../queries/tokenMutation";
import {
    LoginAccessTokenResponse,
    LoginFormValues,
    RegisterFormValues,
    RegisterResponse,
    User,
} from "../../types";
import fetchUserData from "../../queries/fetchUserDataQuery";
import { registerMutation } from "../../queries/registerMutation";

interface UserContextType {
    user: User | undefined;
    login: UseMutationResult<LoginAccessTokenResponse, Error, LoginFormValues>;
    isLoading: boolean;
    error: Error | null;
    register: UseMutationResult<RegisterResponse, Error, RegisterFormValues>;
    logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface Props {
    children: ReactNode;
}

export const UserProvider: React.FC<Props> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
        !!Cookies.get("token")
    );

    const register = useMutation({
        mutationFn: registerMutation,
        onMutate: () => {
            setIsAuthenticated(true);
        },
        onSuccess: (res, val) => {
            login.mutate({
                email: res.email,
                password: val.password,
            });
        },
        onError: () => {
            setIsAuthenticated(false);
        },
    });

    const login = useMutation({
        mutationFn: loginMutation,
        onMutate: () => {
            setIsAuthenticated(true);
        },
        onSuccess: () => {
            refetch();
        },
        onError: () => {
            setIsAuthenticated(false);
        },
    });

    const {
        data: user,
        refetch,
        isLoading,
        error,
    }: UseQueryResult<User, Error> = useQuery({
        queryKey: ["userData"],
        queryFn: fetchUserData,
        enabled: isAuthenticated,
    });

    const logout = () => {
        Cookies.remove("token");
        setIsAuthenticated(false);
        window.location.reload();
    };

    return (
        <UserContext.Provider
            value={{ user, login, isLoading, error, logout, register }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};
