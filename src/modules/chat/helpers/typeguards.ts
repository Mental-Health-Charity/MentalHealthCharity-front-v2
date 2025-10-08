/* eslint-disable */
import { ChatDeleteEvent, SocketMessage } from "../types";

export const isSocketMessage = (obj: any): obj is SocketMessage => {
    return (
        obj &&
        typeof obj === "object" &&
        typeof obj.id === "number" &&
        typeof obj.content === "string" &&
        typeof obj.creation_date === "string" &&
        typeof obj.sender_id === "number" &&
        typeof obj.is_read === "boolean"
    );
};

export const isChatDeleteEvent = (obj: any): obj is ChatDeleteEvent => {
    return obj && typeof obj === "object" && "id" in obj && obj.event === "deleted";
};
