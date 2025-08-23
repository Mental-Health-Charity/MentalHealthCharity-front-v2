import React from "react";
import ChangePasswordCompleteScreen from "../../screens/ChangePasswordCompleteScreen";
import ChangePasswordScreen from "../../screens/ChangePasswordScreen";
import ConfirmEmailCompleteScreen from "../../screens/ConfirmEmailCompleteScreen";
import ConfirmEmailScreen from "../../screens/ConfirmEmailScreen";
import SupportUsScreen from "../../screens/SupportUsScreen";
import { Permissions } from "./constants";
import { RouteType } from "./types";

const AboutChatScreen = React.lazy(() => import("../../screens/AboutChatScreen"));
const ArticleDashboardScreen = React.lazy(() => import("../../screens/ArticlesDashboardScreen"));
const CreateArticleScreen = React.lazy(() => import("../../screens/CreateArticleScreen"));
const EditArticleScreen = React.lazy(() => import("../../screens/EditArticleScreen"));
const ForgetPasswordScreen = React.lazy(() => import("../../screens/ForgetPasswordScreen"));
const ManageArticlesScreen = React.lazy(() => import("../../screens/ManageArticlesScreen"));
const ManageMenteeFormsScreen = React.lazy(() => import("../../screens/ManageMenteeFormsScreen"));
const ManageVolunteerFormsScreen = React.lazy(() => import("../../screens/ManageVolunteerFormsScreen"));
const MenteeFormScreen = React.lazy(() => import("../../screens/MenteeFormScreen"));
const NotFoundScreen = React.lazy(() => import("../../screens/NotFoundScreen"));
const RegisterScreen = React.lazy(() => import("../../screens/RegisterScreen"));
const TosScreen = React.lazy(() => import("../../screens/TosScreen"));
const VolunteerFormScreen = React.lazy(() => import("../../screens/VolunteerFormScreen"));
const ManageChatsScreen = React.lazy(() => import("../../screens/ManageChatsScreen"));
const AdminScreen = React.lazy(() => import("../../screens/AdminScreen"));
const ArticleScreen = React.lazy(() => import("../../screens/ArticleScreen"));
const ArticlesScreen = React.lazy(() => import("../../screens/ArticlesScreen"));
const ChatScreen = React.lazy(() => import("../../screens/ChatScreen"));
const HomepageScreen = React.lazy(() => import("../../screens/HomepageScreen"));
const LoginScreen = React.lazy(() => import("../../screens/LoginScreen"));
const ProfileScreen = React.lazy(() => import("../../screens/ProfileScreen"));
const ReportsScreen = React.lazy(() => import("../../screens/ReportsScreen"));
const UserEditorScreen = React.lazy(() => import("../../screens/UserEditorScreen"));

const routes: RouteType[] = [
    {
        url: "/",
        onRender: <HomepageScreen />,
        requiresAuth: false,
    },
    {
        url: "/form/mentee",
        onRender: <MenteeFormScreen />,
        requiresAuth: false,
    },
    {
        url: "/about-chat",
        onRender: <AboutChatScreen />,
        requiresAuth: false,
    },
    {
        url: "/form/volunteer",
        onRender: <VolunteerFormScreen />,
        requiresAuth: true,
    },
    {
        url: "/auth/forget-password-classic",
        onRender: <ForgetPasswordScreen />,
        requiresAuth: false,
    },
    {
        url: "/reset-password",
        onRender: <ChangePasswordCompleteScreen />,
        requiresAuth: false,
    },
    {
        url: "/auth/forget-password",
        onRender: <ChangePasswordScreen />,
        requiresAuth: false,
    },
    {
        url: "/login",
        onRender: <LoginScreen />,
        requiresAuth: false,
    },
    {
        url: "/auth/register",
        onRender: <RegisterScreen />,
        requiresAuth: false,
    },
    {
        url: "/tos",
        onRender: <TosScreen />,
        requiresAuth: false,
    },
    {
        url: "/register",
        onRender: <div>Register</div>,
        requiresAuth: false,
    },
    {
        url: "/auth/confirm-email-begin",
        onRender: <ConfirmEmailScreen />,
        requiresAuth: false,
    },
    {
        url: "/confirm",
        onRender: <ConfirmEmailCompleteScreen />,
        requiresAuth: false,
    },
    {
        url: "/support",
        onRender: <SupportUsScreen />,
        requiresAuth: false,
    },
    {
        url: "/admin",
        onRender: <AdminScreen />,
        requiresAuth: true,
        permission: Permissions.ADMIN_DASHBOARD,
    },
    {
        url: "/admin/reports",
        onRender: <ReportsScreen />,
        requiresAuth: true,
        permission: Permissions.MANAGE_REPORTS,
    },
    {
        url: "/admin/users",
        onRender: <UserEditorScreen />,
        requiresAuth: true,
        permission: Permissions.MANAGE_USERS,
    },
    {
        url: "/admin/articles",
        onRender: <ManageArticlesScreen />,
        requiresAuth: true,
        permission: Permissions.MANAGE_ARTICLES,
    },
    {
        url: "/admin/forms/mentee",
        onRender: <ManageMenteeFormsScreen />,
        requiresAuth: true,
        permission: Permissions.MANAGE_MENTEE_FORMS,
    },
    {
        url: "/admin/forms/volunteer",
        onRender: <ManageVolunteerFormsScreen />,
        requiresAuth: true,
        permission: Permissions.MANAGE_VOLUNTEER_FORMS,
    },
    {
        url: "/admin/chats",
        onRender: <ManageChatsScreen />,
        requiresAuth: true,
        permission: Permissions.MANAGE_CHATS,
    },
    {
        url: "/profile/:userId",
        onRender: <ProfileScreen />,
        requiresAuth: true,
    },
    {
        url: "/articles",
        onRender: <ArticlesScreen />,
        requiresAuth: false,
    },
    {
        url: "/articles/create",
        onRender: <CreateArticleScreen />,
        requiresAuth: true,
        permission: Permissions.CREATE_ARTICLE,
    },
    {
        url: "/articles/edit/:id",
        onRender: <EditArticleScreen />,
        requiresAuth: true,
        permission: Permissions.CREATE_ARTICLE,
    },
    {
        url: "/articles/dashboard",
        onRender: <ArticleDashboardScreen />,
        requiresAuth: true,
        permission: Permissions.CREATE_ARTICLE,
    },
    {
        url: "/article/:id",
        onRender: <ArticleScreen />,
        requiresAuth: false,
    },
    {
        url: "/chat/:id",
        onRender: <ChatScreen />,
        requiresAuth: true,
        permission: Permissions.READ_OWN_CHATS,
    },
    {
        url: "/chat",
        onRender: <ChatScreen />,
        requiresAuth: true,
        permission: Permissions.READ_OWN_CHATS,
    },

    {
        url: "/users",
        onRender: <div>Users</div>,
        requiresAuth: true,
        permission: Permissions.MANAGE_USERS,
    },
    {
        url: "/users/:id",
        onRender: <div>User</div>,
        requiresAuth: true,
    },
    {
        url: "/404",
        onRender: <NotFoundScreen />,
        requiresAuth: false,
    },
    {
        url: "*",
        onRender: <NotFoundScreen />,
        requiresAuth: false,
    },
];

export default routes;
