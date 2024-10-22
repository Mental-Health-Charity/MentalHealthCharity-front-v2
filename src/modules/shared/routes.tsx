import ArticleScreen from "../../screens/ArticleScreen";
import ArticlesScreen from "../../screens/ArticlesScreen";
import ChatScreen from "../../screens/ChatScreen";
import HomepageScreen from "../../screens/HomepageScreen";
import LoginScreen from "../../screens/LoginScreen";
import ProfileScreen from "../../screens/ProfileScreen";
import { RouteType } from "./types";

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
    url: "/dashboard",
    onRender: <div>Dashboard</div>,
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
