import { User } from "../auth/types";
import { DefaultPaginationOptions } from "../shared/types";
import { Roles } from "../users/constants";
import { ArticleRequiredRoles, ArticleStatus } from "./constants";

export interface ReadArticlesOptions extends DefaultPaginationOptions {
    status: ArticleStatus;
}

export interface SearchPublicArticlesOptions extends DefaultPaginationOptions {
    q: string;
}

export interface ReadPublicArticlesOptions extends ReadArticlesOptions {
    author?: number;
}

export interface ReadArticleOptions {
    id: number;
}

export interface UpdateArticleOptions {
    id: number;
}

export interface UpdateArticleBannerOptions {
    banner: string;
    article_id: number;
}

export interface CreateArticlePayload {
    title: string;
    content: string;
    banner_url: string;
    video_url: string;
    article_category_id: number;
    required_role: ArticleRequiredRoles;
    status: ArticleStatus;
}

export interface UpdateArticlePayload
    extends Omit<CreateArticlePayload, "banner_url"> {
    article_id: number;
}
export interface ArticleCategoryOptions {
    id: number;
}

export interface CreateArticleCategoryPayload {
    name: string;
}
export interface UpdateArticleCategoryOptions {
    name: string;
    id: number;
}

export interface ChangeArticleStatusPayload {
    status: ArticleStatus;
    reject_message: string;
    id: number;
}

export interface ArticleCategory {
    name: string;
    id: number;
    is_active: boolean;
}

export interface CreateArticleValues {
    title: string;
    content: string;
    banner_url?: File | string;
    video_url: string;
    article_category_id: number | null;
    required_role: ArticleRequiredRoles;
    status: ArticleStatus;
}

export interface UpdateStatusFormValues {
    status: ArticleStatus;
    reject_message: string;
}

export interface Article {
    title: string;
    content: string;
    banner_url: string;
    video_url: string;
    id: number;
    article_category: ArticleCategory;
    required_role: ArticleRequiredRoles;
    status: ArticleStatus;
    reject_message: string;
    created_by: User;
    creation_date: string;
}
