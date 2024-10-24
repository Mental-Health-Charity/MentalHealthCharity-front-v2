import React from "react";
import { Roles } from "../users/constants";

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

export interface RouteType {
  url: string;
  onRender: React.ReactNode;
  requiresAuth?: boolean;
  permissions?: Roles[];
}

export interface Pagination<T> {
  page: number;
  size: number;
  total: number;
  pages: number;
  items: T[];
}

export enum ErrorMessage {
  FAILED_TO_FETCH_CHAT = "failed_to_fetch_chat",
  FAILED_TO_FETCH_CHAT_NOTE = "failed_to_fetch_chat_note",
  FAILED_TO_SAVE_NOTE = "failed_to_save_note",
  FAILED_TO_CREATE_REPORT = "failed_to_create_report",
  FAILED_TO_FETCH_PUBLIC_PROFILE = "failed_to_fetch_public_profile",
  FAILED_TO_UPDATE_PUBLIC_PROFILE = "failed_to_update_public_profile",
  FAILED_TO_FETCH_REPORTS = "failed_to_fetch_reports",
  FAILED_TO_FETCH_USER = "failed_to_fetch_user",
  UNKNOWN = "unknown",
}
