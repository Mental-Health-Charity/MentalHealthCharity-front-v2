import React from "react";
import { RouteType } from "./types";

const ManageChatsScreen = React.lazy(
    () => import("../../screens/ManageChatsScreen")
);
const AdminScreen = React.lazy(() => import("../../screens/AdminScreen"));
const ArticleScreen = React.lazy(() => import("../../screens/ArticleScreen"));
const ArticlesScreen = React.lazy(() => import("../../screens/ArticlesScreen"));
const ChatScreen = React.lazy(() => import("../../screens/ChatScreen"));
const HomepageScreen = React.lazy(() => import("../../screens/HomepageScreen"));
const LoginScreen = React.lazy(() => import("../../screens/LoginScreen"));
const ProfileScreen = React.lazy(() => import("../../screens/ProfileScreen"));
const ReportsScreen = React.lazy(() => import("../../screens/ReportsScreen"));
const UserEditorScreen = React.lazy(
    () => import("../../screens/UserEditorScreen")
);

const routes: RouteType[] = [
    {
        url: "/",
        onRender: <HomepageScreen />,
        requiresAuth: false,
    },
    {
        url: "/login",
        onRender: <LoginScreen />,
        requiresAuth: false,
    },
    {
        url: "/register",
        onRender: <div>Register</div>,
        requiresAuth: false,
    },
    {
        url: "/admin",
        onRender: <AdminScreen />,
        requiresAuth: true,
    },
    {
        url: "/admin/reports",
        onRender: <ReportsScreen />,
        requiresAuth: true,
    },
    {
        url: "/admin/users",
        onRender: <UserEditorScreen />,
        requiresAuth: true,
    },
    {
        url: "/admin/chats",
        onRender: <ManageChatsScreen />,
        requiresAuth: true,
    },
    {
        url: "/profile/:userId",
        onRender: <ProfileScreen />,
        requiresAuth: true,
    },
    {
        url: "/articles",
        onRender: <ArticlesScreen />,
        requiresAuth: true,
    },
    {
        url: "/article/:id",
        onRender: <ArticleScreen />,
        requiresAuth: true,
    },
    {
        url: "/chat/:id",
        onRender: <ChatScreen />,
        requiresAuth: true,
    },
    {
        url: "/chat",
        onRender: <ChatScreen />,
        requiresAuth: true,
    },

    {
        url: "/users",
        onRender: <div>Users</div>,
        requiresAuth: true,
    },
    {
        url: "/users/:id",
        onRender: <div>User</div>,
        requiresAuth: true,
    },
    {
        url: "/404",
        onRender: <div>Not Found</div>,
        requiresAuth: false,
    },
];

export default routes;
