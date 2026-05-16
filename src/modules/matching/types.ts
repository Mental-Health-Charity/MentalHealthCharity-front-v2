import { User } from "../auth/types";

export enum MenteeMatchingStatus {
    WAITING = "WAITING",
    MATCHED = "MATCHED",
    PAUSED = "PAUSED",
    DECLINED = "DECLINED",
    REMATCH_REQUESTED = "REMATCH_REQUESTED",
    CLOSED = "CLOSED",
}

export interface VolunteerAvailabilityStatus {
    volunteer_id: number;
    declared_capacity: number | null;
    active_chat_count: number;
    free_slots: number;
    is_full: boolean;
    must_prompt: boolean;
    first_time_declaration: boolean;
    below_current_assignments: boolean;
    warning?: string | null;
    blocked_until?: string | null;
}

export interface VolunteerAvailabilityUpdate {
    declared_capacity: number;
}

export interface ManualPairRequest {
    user_id: number;
    volunteer_id: number;
    ignore_capacity: boolean;
}

export interface ManualPairResponse {
    chat_id: number;
    warning?: string | null;
}

export interface MatchingRunResult {
    matched_count: number;
    waiting_count: number;
    no_capacity_count: number;
    created_chat_ids: number[];
}

export interface MatchingAutomationSettings {
    automatic_matching_enabled: boolean;
    updated_at?: string | null;
    updated_by_id?: number | null;
}

export interface MatchingAutomationSettingsUpdate {
    automatic_matching_enabled: boolean;
}

export interface RematchDecisionRequest {
    wants_rematch: boolean;
}

export interface AdminAlertMetadata {
    waiting_user_ids?: number[];
    notified_user_ids?: number[];
    [key: string]: unknown;
}

export interface AdminAlert {
    message: string;
    metadata: AdminAlertMetadata | null;
    created_at: string;
}

export interface MenteeMatchingState {
    user_id: number;
    help_form_id: number | null;
    status: MenteeMatchingStatus;
    auto_matching_enabled: boolean;
    excluded_from_automation: boolean;
    queued_at: string;
    matched_at: string | null;
    current_chat_id: number | null;
}

export interface MenteeMatchingItem {
    user: User;
    state: MenteeMatchingState;
}

export interface VolunteerCapacityItem {
    volunteer: User;
    availability: VolunteerAvailabilityStatus;
}
