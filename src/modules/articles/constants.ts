import i18n from "../../locales/i18n";
import { Roles } from "../users/constants";

export enum ArticleStatus {
    DRAFT = "DRAFT",
    SENT = "SENT",
    REJECTED = "REJECTED",
    CORRECTED = "CORRECTED",
    PUBLISHED = "PUBLISHED",
    DELETED = "DELETED",
}

export enum ArticleRequiredRoles {
    ANYONE = "ANYONE",
    ADMIN = Roles.ADMIN,
    VOLUNTEER = Roles.VOLUNTEER,
    SUPERVISOR = Roles.VOLUNTEERSUPERVISOR,
}

export const translatedArticleStatus = {
    [ArticleStatus.DRAFT]: i18n.t("articles.status.draft"),
    [ArticleStatus.SENT]: i18n.t("articles.status.sent"),
    [ArticleStatus.REJECTED]: i18n.t("articles.status.rejected"),
    [ArticleStatus.CORRECTED]: i18n.t("articles.status.corrected"),
    [ArticleStatus.PUBLISHED]: i18n.t("articles.status.published"),
    [ArticleStatus.DELETED]: i18n.t("articles.status.deleted"),
};

export const translatedAdminArticleStatus = {
    [ArticleStatus.DRAFT]: i18n.t("articles.status.draft"),
    [ArticleStatus.SENT]: i18n.t("articles.status.waiting_for_approval"),
    [ArticleStatus.REJECTED]: i18n.t("articles.status.rejected"),
    [ArticleStatus.CORRECTED]: i18n.t("articles.status.corrected"),
    [ArticleStatus.PUBLISHED]: i18n.t("articles.status.published"),
    [ArticleStatus.DELETED]: i18n.t("articles.status.deleted"),
};

export const translatedArticleRequiredRoles = {
    [ArticleRequiredRoles.ANYONE]: i18n.t("articles.required_roles.anyone"),
    [ArticleRequiredRoles.ADMIN]: i18n.t("articles.required_roles.admin"),
    [ArticleRequiredRoles.VOLUNTEER]: i18n.t("articles.required_roles.volunteer"),
    [ArticleRequiredRoles.SUPERVISOR]: i18n.t("articles.required_roles.supervisor"),
};
