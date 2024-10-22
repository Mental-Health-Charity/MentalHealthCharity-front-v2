export interface Report {
  report_type: ReportType;
  subject: string;
  description: string;
}

export interface ChangeReportStatusPayload {
  id: number;
}

export enum ReportType {
  CHANGE_VOLUNTEER = "CHANGE_VOLUNTEER",
  CHANGE_MENTEE = "CHANGE_MENTEE",
  ABUSE = "ABUSE",
  OTHER = "OTHER",
  CRISIS_SITUATION = "CRISIS_SITUATION",
}
