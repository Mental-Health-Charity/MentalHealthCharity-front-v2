import { ReadyState } from 'react-use-websocket';
import { User } from '../auth/types';
import { DefaultPaginationOptions } from '../shared/types';

export interface ReadChatOptions {
    id: number | string;
}

export interface ChatNoteOptions {
    id: number | string;
}

export interface EditChatOptions {
    id: number;
}

export interface ChatContractOptions {
    id: number | string;
}

export interface CreateChatPayload {
    name: string;
    flags: Record<string, string[]>;
}

export interface CreateChatFormValues {
    name: string;
    flags: string[];
    role: string;
}

export interface ParticipantOptions {
    chat_id: number;
    participant_id: number;
}

export interface GetChatMessagesOptions extends DefaultPaginationOptions {
    chatId: string | number;
}

export interface ConnectOptions {
    token: string;
    chat_id: string;
}

export interface ConnectUnreadMessagesOptions {
    token: string;
}

export interface Message {
    content: string;
    id: number;
    sender: User;
    creation_date: string;
}

export interface Note {
    content: string;
    id: number;
}

export interface SocketMessage {
    id: number;
    content: string;
    creation_date: string;
    sender_id: number;
    is_read: boolean;
}

export interface Chat {
    name: string;
    id: number;
    participants: User[];
    is_active: boolean;
    creation_date: string;
    last_message?: string;
    is_supervisor_chat: boolean;
}

export interface SearchChatQueryOptions extends DefaultPaginationOptions {
    search?: string;
}

export interface ConnectionStatus {
    text: string;
    isError: boolean;
    isLoading: boolean;
    state: ReadyState;
}

export interface EditNotePayload {
    content: string;
    id: number;
}

export interface AddParticipantPayload {
    participant_id: number;
    chat_id: number;
}

export interface EditChatPayload {
    id: number;
    name: string;
    is_active: boolean;
}
