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
