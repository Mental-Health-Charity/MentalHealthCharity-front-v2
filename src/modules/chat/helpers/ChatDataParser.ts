import { ChatDeleteEvent, SocketMessage } from "../types";
import { isChatDeleteEvent, isSocketMessage } from "./typeguards";

export class ChatDataParser {
    private onMessageHandler: ((data: SocketMessage) => void) | null = null;
    private onDeleteHandler: ((data: ChatDeleteEvent) => void) | null = null;

    onNewMessage(handler: (data: SocketMessage) => void): this {
        this.onMessageHandler = handler;
        return this;
    }

    onDelete(handler: (data: ChatDeleteEvent) => void): this {
        this.onDeleteHandler = handler;
        return this;
    }

    parse(raw: string) {
        try {
            const obj = JSON.parse(raw);

            console.log("Parsed object:", obj);

            switch (true) {
                case isChatDeleteEvent(obj):
                    this.onDeleteHandler?.(obj);
                    break;
                case isSocketMessage(obj):
                    this.onMessageHandler?.(obj);
                    break;
                default:
                    console.warn("Unknown payload structure:", obj);
                    return;
            }
        } catch (err) {
            console.error("Invalid JSON:", err);
        }
    }
}
