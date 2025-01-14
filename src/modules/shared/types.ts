import { MenuItemProps } from '@mui/material';
import React from 'react';
import { Permissions } from './constants';

export interface Pagination<T> {
    page: number;
    size: number;
    total: number;
    pages: number;
    items: T[];
}

export interface DefaultPaginationOptions {
    page?: number;
    size?: number;
}

export interface ApiError {
    detail: string;
}

export interface RouteType {
    url: string;
    onRender: React.ReactNode;
    requiresAuth?: boolean;
    permission?: Permissions;
}

export interface Pagination<T> {
    page: number;
    size: number;
    total: number;
    pages: number;
    items: T[];
}

export interface ApiError {
    code: string;
    details: string;
}

export interface ComponentAction extends MenuItemProps {
    id: string;
    label: React.ReactNode;
    icon?: React.ReactNode;
    variant?: 'default' | 'divider';
    href?: string;
}

export enum ErrorMessage {
    FAILED_TO_FETCH_CHAT = 'failed_to_fetch_chat',
    ARTICLE_CATEGORY_IS_USED = 'article_category_is_used',
    ARTICLE_CATEGORY_WITH_THAT_NAME_ALREADY_EXISTS = 'article_category_with_that_name_already_exists',
    FAILED_TO_FETCH_CHAT_NOTE = 'failed_to_fetch_chat_note',
    FAILED_TO_SAVE_NOTE = 'failed_to_save_note',
    INCORRECT_EMAIL_OR_PASSWORD = 'incorrect_email_or_password',
    FAILED_TO_CREATE_REPORT = 'failed_to_create_report',
    FAILED_TO_FETCH_PUBLIC_PROFILE = 'failed_to_fetch_public_profile',
    FAILED_TO_UPDATE_PUBLIC_PROFILE = 'failed_to_update_public_profile',
    FAILED_TO_FETCH_REPORTS = 'failed_to_fetch_reports',
    FAILED_TO_FETCH_USER = 'failed_to_fetch_user',
    FAILED_TO_CREATE_CHAT = 'failed_to_create_chat',
    FAILED_TO_EDIT_CHAT = 'failed_to_edit_chat',
    UNKNOWN = 'unknown',
}
