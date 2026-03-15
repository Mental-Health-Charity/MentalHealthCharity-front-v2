import { Chat } from "../../types";

interface Props {
    chat: Chat;
    onChange: (id: string) => void;
    selected: boolean;
    readed?: boolean;
}

const ChatItem = ({ chat, onChange, selected, readed }: Props) => {
    const showUnreadIndicator = chat.unread_count > 0 && !readed;
    const { is_active } = chat;

    return (
        <a
            href={`/chat/${chat.id}`}
            onClick={(e) => {
                e.preventDefault();
                onChange(String(chat.id));
            }}
            className={`flex items-center justify-start gap-4 px-1.5 py-2.5 no-underline transition-colors ${
                is_active ? "opacity-100" : "opacity-80"
            } ${selected ? "bg-muted" : "hover:bg-muted/50"}`}
        >
            <div
                className={`flex size-10 shrink-0 items-center justify-center rounded-md ${
                    is_active ? "bg-accent-brand" : "bg-border-brand"
                }`}
            />
            <div className="min-h-[40px]">
                <p
                    className={`inline-flex max-w-[200px] items-center gap-1.5 truncate text-base leading-tight font-bold ${
                        is_active ? "text-text-body" : "text-muted-foreground"
                    }`}
                >
                    {chat.name}{" "}
                    {showUnreadIndicator && (
                        <span className="bg-primary rounded-full px-1.5 py-0.5 text-xs text-white">
                            {chat.unread_count}
                        </span>
                    )}
                </p>
                {chat.last_message && (
                    <p
                        className={`max-w-[200px] truncate ${
                            is_active ? "text-text-body/70" : "text-muted-foreground/70"
                        }`}
                    >
                        {chat.last_message.sender.full_name}: {chat.last_message.content}
                    </p>
                )}
            </div>
        </a>
    );
};

export default ChatItem;
