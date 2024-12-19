import { User } from "../auth/types";

export interface FormOptions {
    id: string;
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
    tos: boolean;
    source: string;
    themes: string[];
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
    formType: {
        form_type: string;
        id: number;
        is_active: boolean;
        max_step: number;
    };
    id: number;
    message: string | null;
}

export enum formTypes {
    VOLUNTEER = 2,
    MENTEE = 1,
}
