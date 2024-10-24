import buildQuery from "./helpers/buildQuery";
import {
  ArticleCategoryOptions,
  ReadArticleOptions,
  ReadArticlesOptions,
  ReadPublicArticlesOptions,
  SearchPublicArticlesOptions,
  UpdateArticleOptions,
} from "./modules/articles/types";
import {
  ChatContractOptions,
  ChatNoteOptions,
  ConnectOptions,
  GetChatMessagesOptions,
  ParticipantOptions,
  ReadChatOptions,
} from "./modules/chat/types";
import { FormOptions } from "./modules/forms/types";
import { ChangeReportStatusPayload } from "./modules/report/types";
import { DefaultPaginationOptions } from "./modules/shared/types";
import {
  PublicProfileOptions,
  ReadSearchUsersOptions,
  ReadUserByIdOptions,
} from "./modules/users/types";

export const baseUrl = import.meta.env.VITE_BASE_URL as string;
export const websocketUrl = import.meta.env.VITE_BASE_WS_URL as string;

export const url = {
  login: {
    loginAccessToken: `${baseUrl}/api/v1/login/access-token`,
    testToken: `${baseUrl}/api/v1/login/test-token`,
  },
  reports: {
    changeStatus({ id }: ChangeReportStatusPayload) {
      return `${baseUrl}/api/v1/user-report/${id}/change-status`;
    },
    create: `${baseUrl}/api/v1/user-report/`,
    get: `${baseUrl}/api/v1/user-report/`,
  },
  users: {
    searchUser(options: ReadSearchUsersOptions) {
      const query = buildQuery(options);
      console.log(query);
      return `${baseUrl}/api/v1/users/?${query}`;
    },
    readUserById({ id }: ReadUserByIdOptions) {
      return `${baseUrl}/api/v1/users/${id}`;
    },
    updateUser({ id }: ReadUserByIdOptions) {
      return `${baseUrl}/api/v1/users/${id}`;
    },
    updateUserByAdmin({ id }: ReadUserByIdOptions) {
      return `${baseUrl}/api/v1/users/${id}/edit-as-admin`;
    },
    createUser: `${baseUrl}/api/v1/users/`,
    readUsersMe: `${baseUrl}/api/v1/users/me`,
    updateUserMe: `${baseUrl}/api/v1/users/me`,
    createUserOpen: `${baseUrl}/api/v1/users/open`,
    changePassword: `${baseUrl}/api/v1/users/change-password`,
    resetPassword: `${baseUrl}/api/v1/users/reset-password`,
  },
  chat: {
    readChats(options: DefaultPaginationOptions) {
      const query = buildQuery(options);
      return `${baseUrl}/api/v1/chat/?${query}`;
    },
    readChat({ id }: ReadChatOptions) {
      return `${baseUrl}/api/v1/chat/${id}`;
    },
    readChatUsers({ id }: ReadChatOptions) {
      return `${baseUrl}/api/v1/chat/${id}/user/`;
    },
    getNoteForChat({ id }: ChatNoteOptions) {
      return `${baseUrl}/api/v1/chat-note/chat/${id}`;
    },
    editNote({ id }: ChatNoteOptions) {
      return `${baseUrl}/api/v1/chat-note/chat/${id}`;
    },
    getContractForChat({ id }: ChatContractOptions) {
      return `${baseUrl}/api/v1/contract/chat/${id}`;
    },
    editContract({ id }: ChatContractOptions) {
      return `${baseUrl}/api/v1/contract/chat/${id}`;
    },
    confirmContract({ id }: ChatContractOptions) {
      return `${baseUrl}/api/v1/contract/chat/${id}/confirm`;
    },
    addParticipant({ chatId, userId }: ParticipantOptions) {
      return `${baseUrl}/api/v1/chat/${chatId}/participant/${userId}`;
    },
    removeParticipant({ chatId, userId }: ParticipantOptions) {
      return `${baseUrl}/api/v1/chat/${chatId}/participant/${userId}`;
    },
    readMessages({ chatId, ...options }: GetChatMessagesOptions) {
      const query = buildQuery(options);
      return `${baseUrl}/api/v1/message/${chatId}?${query}`;
    },

    connect(options: ConnectOptions) {
      const query = buildQuery(options);
      return `${websocketUrl}/ws-chat?${query}`;
    },
    createChat: `${baseUrl}/api/v1/chat`,
  },
  articles: {
    readArticles(options: ReadArticlesOptions) {
      const query = buildQuery(options);
      return `${baseUrl}/api/v1/article?${query}`;
    },
    readPublicArticles(options: ReadPublicArticlesOptions) {
      const query = buildQuery(options);
      return `${baseUrl}/api/v1/article/public?${query}`;
    },
    readById({ id }: ReadArticleOptions) {
      return `${baseUrl}/api/v1/article/${id}/detail`;
    },
    searchPublicArticles(options: SearchPublicArticlesOptions) {
      const query = buildQuery(options);
      return `${baseUrl}/api/v1/article/public/search?${query}`;
    },
    readByUser({ author, ...props }: ReadPublicArticlesOptions) {
      const query = buildQuery(props);
      return `${baseUrl}/api/v1/article/public/user/${author}?${query}`;
    },
    update({ id }: UpdateArticleOptions) {
      return `${baseUrl}/api/v1/article/${id}`;
    },
    delete({ id }: UpdateArticleOptions) {
      return `${baseUrl}/api/v1/article/${id}`;
    },
    changeStatus({ id }: UpdateArticleOptions) {
      return `${baseUrl}/api/v1/article/${id}/change-status`;
    },
  },
  articleCategories: {
    update({ id }: ArticleCategoryOptions) {
      return `${baseUrl}/api/v1/article-category/${id}`;
    },
    delete({ id }: ArticleCategoryOptions) {
      return `${baseUrl}/api/v1/article-category/${id}`;
    },
    changeStatus({ id }: ArticleCategoryOptions) {
      return `${baseUrl}/api/v1/article-category/${id}/change-status`;
    },
    read: `${baseUrl}/api/v1/article-category`,
    create: `${baseUrl}/api/v1/article-category`,
  },
  publicProfiles: {
    read({ id }: PublicProfileOptions) {
      return `${baseUrl}/api/v1/user-public-profile/${id}`;
    },
    update({ id }: PublicProfileOptions) {
      return `${baseUrl}/api/v1/user-public-profile/${id}`;
    },
  },
  form: {
    readById({ id }: FormOptions) {
      return `${baseUrl}/api/v1/form/${id}`;
    },
    update({ id }: FormOptions) {
      return `${baseUrl}/api/v1/form/${id}`;
    },
    delete({ id }: FormOptions) {
      return `${baseUrl}/api/v1/form/${id}`;
    },
    accept({ id }: FormOptions) {
      return `${baseUrl}/api/v1/form/${id}/accept`;
    },
    reject({ id }: FormOptions) {
      return `${baseUrl}/api/v1/form/${id}/reject`;
    },
    read: `${baseUrl}/api/v1/form`,
    create: `${baseUrl}/api/v1/form`,
    canUserSendForm: `${baseUrl}/api/v1/form/can-send-form`,
  },
};
