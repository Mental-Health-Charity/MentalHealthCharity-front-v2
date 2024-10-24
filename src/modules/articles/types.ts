import { User } from "../auth/types";
import { DefaultPaginationOptions } from "../shared/types";
import { Roles } from "../users/constants";
import { ArticleStatus } from "./constants";

export interface ReadArticlesOptions extends DefaultPaginationOptions {
  status: ArticleStatus;
}

export interface SearchPublicArticlesOptions extends DefaultPaginationOptions {
  q: string;
}

export interface ReadPublicArticlesOptions extends ReadArticlesOptions {
  author?: string;
}

export interface ReadArticleOptions {
  id: string;
}

export interface UpdateArticleOptions {
  id: string;
}

export interface ArticleCategoryOptions {
  id: string;
}

export interface ArticleCategory {
  name: string;
  id: number;
  is_active: boolean;
}

export interface Article {
  title: string;
  content: string;
  banner_url: string;
  video_url: string;
  id: number;
  article_category: ArticleCategory;
  required_role: Roles;
  status: ArticleStatus;
  reject_message: string;
  created_by: User;
  creation_date: string;
}
