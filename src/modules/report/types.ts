import { User } from "../auth/types";

export interface ReportPayload {
  report_type: ReportType;
  subject: string;
  description: string;
}

export interface ChangeReportStatusPayload {
  id: number;
}

export interface Report {
  report_type: ReportType;
  subject: string;
  description: string;
  chat_id: number;
  id: number;
  created_by: User;
  creation_date: string;
}

export enum ReportType {
  CHANGE_VOLUNTEER = "CHANGE_VOLUNTEER",
  ABUSE = "CHAT_ABUSE",
  BUG = "BUG",
}
