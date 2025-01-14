import * as Yup from 'yup';
import i18n from '../../locales/i18n';
import { Roles } from '../users/constants';
import { ErrorMessage } from './types';

const Errors = {
    [ErrorMessage.FAILED_TO_FETCH_CHAT]: i18n.t('errors.failed_to_fetch_chat'),
    [ErrorMessage.FAILED_TO_FETCH_CHAT_NOTE]: i18n.t('errors.failed_to_fetch_chat_note'),
    [ErrorMessage.FAILED_TO_SAVE_NOTE]: i18n.t('errors.failed_to_save_note'),
    [ErrorMessage.FAILED_TO_CREATE_REPORT]: i18n.t('errors.failed_to_create_report'),
    [ErrorMessage.FAILED_TO_FETCH_PUBLIC_PROFILE]: i18n.t('errors.failed_to_fetch_public_profile'),
    [ErrorMessage.FAILED_TO_UPDATE_PUBLIC_PROFILE]: i18n.t('errors.failed_to_update_public_profile'),
    [ErrorMessage.FAILED_TO_FETCH_USER]: i18n.t('errors.failed_to_fetch_user'),
    [ErrorMessage.UNKNOWN]: i18n.t('errors.unknown'),
    [ErrorMessage.FAILED_TO_CREATE_CHAT]: i18n.t('errors.failed_to_create_chat'),
    [ErrorMessage.INCORRECT_EMAIL_OR_PASSWORD]: i18n.t('errors.incorrect_email_or_password'),
    [ErrorMessage.ARTICLE_CATEGORY_IS_USED]: i18n.t('errors.article_category_in_use'),
    [ErrorMessage.ARTICLE_CATEGORY_WITH_THAT_NAME_ALREADY_EXISTS]: i18n.t(
        'errors.article_category_with_that_name_already_exists'
    ),
    [ErrorMessage.FAILED_TO_EDIT_CHAT]: i18n.t('errors.failed_to_edit_chat'),
    [ErrorMessage.FAILED_TO_FETCH_REPORTS]: i18n.t('errors.failed_to_fetch_reports'),
};

export default Errors;

export enum Permissions {
    AlL = '*',
    CREATE_ARTICLE = 'CREATE_ARTICLE',
    EDIT_ARTICLE = 'EDIT_ARTICLE',
    DELETE_ARTICLE = 'DELETE_ARTICLE',
    PUBLISH_ARTICLE_AS_ADMIN = 'PUBLISH_ARTICLE_AS_ADMIN',
    ADMIN_DASHBOARD = 'ADMIN_DASHBOARD',
    SEARCH_USERS = 'SEARCH_USERS',
    MANAGE_USERS = 'MANAGE_USERS',
    MANAGE_ARTICLES = 'MANAGE_ARTICLES',
    MANAGE_REPORTS = 'MANAGE_REPORTS',
    MANAGE_CHATS = 'MANAGE_CHATS',
    READ_OWN_CHATS = 'READ_OWN_CHATS',
    MANAGE_MENTEE_FORMS = 'MANAGE_MENTEE_FORMS',
    MANAGE_VOLUNTEER_FORMS = 'MANAGE_VOLUNTEER_FORMS',
}

export const groupedPermissions = {
    [Roles.ADMIN]: [Permissions.AlL],
    [Roles.VOLUNTEERSUPERVISOR]: [
        Permissions.CREATE_ARTICLE,
        Permissions.EDIT_ARTICLE,
        Permissions.DELETE_ARTICLE,
        Permissions.MANAGE_MENTEE_FORMS,
        Permissions.MANAGE_VOLUNTEER_FORMS,
        Permissions.PUBLISH_ARTICLE_AS_ADMIN,
        Permissions.MANAGE_USERS,
        Permissions.MANAGE_ARTICLES,
        Permissions.MANAGE_REPORTS,
        Permissions.MANAGE_CHATS,
        Permissions.ADMIN_DASHBOARD,
        Permissions.SEARCH_USERS,
        Permissions.READ_OWN_CHATS,
    ],
    [Roles.VOLUNTEER]: [
        Permissions.CREATE_ARTICLE,
        Permissions.EDIT_ARTICLE,
        Permissions.DELETE_ARTICLE,
        Permissions.READ_OWN_CHATS,
    ],
    [Roles.REDACTOR]: [
        Permissions.CREATE_ARTICLE,
        Permissions.EDIT_ARTICLE,
        Permissions.DELETE_ARTICLE,
        Permissions.READ_OWN_CHATS,
        Permissions.MANAGE_ARTICLES,
        Permissions.ADMIN_DASHBOARD,
    ],
    [Roles.USER]: [Permissions.READ_OWN_CHATS],
};

export const validation = {
    password: Yup.string()
        .min(8, i18n.t('validation.incorrect_password_format'))
        .matches(/[A-Z]/, i18n.t('validation.min_one_uppercase'))
        .matches(/\d/, i18n.t('validation.min_one_number'))
        .required(i18n.t('validation.required')),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), undefined], i18n.t('validation.passwords_must_match'))
        .required(i18n.t('validation.required')),
    email: Yup.string().email(i18n.t('validation.invalid_email')).required(i18n.t('validation.required')),
};
