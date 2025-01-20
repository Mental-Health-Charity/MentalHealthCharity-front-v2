import React from 'react';
import ArticleDashboardScreen from '../../screens/ArticlesDashboardScreen';
import CreateArticleScreen from '../../screens/CreateArticleScreen';
import EditArticleScreen from '../../screens/EditArticleScreen';
import ManageArticlesScreen from '../../screens/ManageArticlesScreen';
import ManageMenteeFormsScreen from '../../screens/ManageMenteeFormsScreen';
import ManageVolunteerFormsScreen from '../../screens/ManageVolunteerFormsScreen';
import MenteeFormScreen from '../../screens/MenteeFormScreen';
import NotFoundScreen from '../../screens/NotFoundScreen';
import RegisterScreen from '../../screens/RegisterScreen';
import VolunteerFormScreen from '../../screens/VolunteerFormScreen';
import { Permissions } from './constants';
import { RouteType } from './types';

const ManageChatsScreen = React.lazy(() => import('../../screens/ManageChatsScreen'));
const AdminScreen = React.lazy(() => import('../../screens/AdminScreen'));
const ArticleScreen = React.lazy(() => import('../../screens/ArticleScreen'));
const ArticlesScreen = React.lazy(() => import('../../screens/ArticlesScreen'));
const ChatScreen = React.lazy(() => import('../../screens/ChatScreen'));
const HomepageScreen = React.lazy(() => import('../../screens/HomepageScreen'));
const LoginScreen = React.lazy(() => import('../../screens/LoginScreen'));
const ProfileScreen = React.lazy(() => import('../../screens/ProfileScreen'));
const ReportsScreen = React.lazy(() => import('../../screens/ReportsScreen'));
const UserEditorScreen = React.lazy(() => import('../../screens/UserEditorScreen'));

const routes: RouteType[] = [
    {
        url: '/',
        onRender: <HomepageScreen />,
        requiresAuth: false,
    },
    {
        url: '/form/mentee',
        onRender: <MenteeFormScreen />,
        requiresAuth: false,
    },
    {
        url: '/form/volunteer',
        onRender: <VolunteerFormScreen />,
        requiresAuth: true,
    },
    {
        url: '/login',
        onRender: <LoginScreen />,
        requiresAuth: false,
    },
    {
        url: '/auth/register',
        onRender: <RegisterScreen />,
        requiresAuth: false,
    },
    {
        url: '/register',
        onRender: <div>Register</div>,
        requiresAuth: false,
    },
    {
        url: '/admin',
        onRender: <AdminScreen />,
        requiresAuth: true,
        permission: Permissions.ADMIN_DASHBOARD,
    },
    {
        url: '/admin/reports',
        onRender: <ReportsScreen />,
        requiresAuth: true,
        permission: Permissions.MANAGE_REPORTS,
    },
    {
        url: '/admin/users',
        onRender: <UserEditorScreen />,
        requiresAuth: true,
        permission: Permissions.MANAGE_USERS,
    },
    {
        url: '/admin/articles',
        onRender: <ManageArticlesScreen />,
        requiresAuth: true,
        permission: Permissions.MANAGE_ARTICLES,
    },
    {
        url: '/admin/forms/mentee',
        onRender: <ManageMenteeFormsScreen />,
        requiresAuth: true,
        permission: Permissions.MANAGE_MENTEE_FORMS,
    },
    {
        url: '/admin/forms/volunteer',
        onRender: <ManageVolunteerFormsScreen />,
        requiresAuth: true,
        permission: Permissions.MANAGE_VOLUNTEER_FORMS,
    },
    {
        url: '/admin/chats',
        onRender: <ManageChatsScreen />,
        requiresAuth: true,
        permission: Permissions.MANAGE_CHATS,
    },
    {
        url: '/profile/:userId',
        onRender: <ProfileScreen />,
        requiresAuth: true,
    },
    {
        url: '/articles',
        onRender: <ArticlesScreen />,
        requiresAuth: false,
    },
    {
        url: '/articles/create',
        onRender: <CreateArticleScreen />,
        requiresAuth: true,
        permission: Permissions.CREATE_ARTICLE,
    },
    {
        url: '/articles/edit/:id',
        onRender: <EditArticleScreen />,
        requiresAuth: true,
        permission: Permissions.CREATE_ARTICLE,
    },
    {
        url: '/articles/dashboard',
        onRender: <ArticleDashboardScreen />,
        requiresAuth: true,
        permission: Permissions.CREATE_ARTICLE,
    },
    {
        url: '/article/:id',
        onRender: <ArticleScreen />,
        requiresAuth: true,
    },
    {
        url: '/chat/:id',
        onRender: <ChatScreen />,
        requiresAuth: true,
        permission: Permissions.READ_OWN_CHATS,
    },
    {
        url: '/chat',
        onRender: <ChatScreen />,
        requiresAuth: true,
        permission: Permissions.READ_OWN_CHATS,
    },

    {
        url: '/users',
        onRender: <div>Users</div>,
        requiresAuth: true,
        permission: Permissions.MANAGE_USERS,
    },
    {
        url: '/users/:id',
        onRender: <div>User</div>,
        requiresAuth: true,
    },
    {
        url: '/404',
        onRender: <NotFoundScreen />,
        requiresAuth: false,
    },
    {
        url: '*',
        onRender: <NotFoundScreen />,
        requiresAuth: false,
    },
];

export default routes;
