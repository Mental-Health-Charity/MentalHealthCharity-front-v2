import { User } from "../auth/types";

export interface FormOptions {
    id: number;
}

export enum formStatus {
    WAITED = "WAITED",
    ACCEPTED = "ACCEPTED",
    REJECTED = "REJECTED",
}

export interface FormOption {
    name: string;
    value: string;
}

export interface ReadAllFormOptions {
    form_status: formStatus;
    form_type_id: formTypes;
    page: number;
    size: number;
    // Sorting options: 'min_stage' (ascending order by current_step), 'max_stage' (descending order by current_step), 'newest' (descending order by creation_date), 'oldest' (ascending order by creation_date)
    sort?: "min_stage" | "max_stage" | "newest" | "oldest";
}

export interface VolunteerFormValues {
    age: string;
    phone: string;
    tos: boolean;
    education: string;
    description: string;
    source: string;
    reason: string;
    contacts: string[];
    did_help: string;
    themes: string[];
}

export interface VolunteerForm {
    age: string;
    phone: string;
    tos: boolean;
    education: string;
    description: string;
    reason: string;
    source: string;
    did_help: string;
    contacts: FormOption[];
    themes: FormOption[];
}

export interface MenteeFormValues {
    age: string;
    name: string;
    contacts: string[];
    description: string;
    phone?: string;
    email: string;
    tos: boolean;
    source: string;
    themes: string[];
    password: string;
    confirmPassword: string;
}

export interface MenteeForm {
    age: string;
    name: string;
    contacts: FormOption[];
    description: string;
    phone?: string;
    tos: boolean;
    source: string;
    themes: FormOption[];
}

export interface Form<T> {
    fields: T;
    message?: string;
    form_type_id: formTypes;
}

export interface FormResponse<T> {
    created_by: User;
    creation_date: string;
    current_step: number;
    fields: T;
    form_status: formStatus;
    notes: FormNote;
    form_type: {
        form_type: formTypes;
        id: number;
        is_active: boolean;
        max_step: number;
    };
    id: number;
    message: string | null;
}

export enum formNoteFields {
    INTERVIEW_DESCRIPTION = "interview_description",
    WORK_AREA = "work_area",
    AVAILABILITY = "availability",
}

export type FormNote =
    | {
          [key in formNoteFields]?: string;
      }
    | null;

export interface FormNotePayload {
    notes: FormNote;
    id: number;
}

export enum formTypes {
    VOLUNTEER = 2,
    MENTEE = 1,
}
