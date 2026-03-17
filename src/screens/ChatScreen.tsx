import ChatInfoModal from "@/modules/chat/components/ChatInfoModal";
import ChatWindow from "../modules/chat/components/ChatWindow";

const ChatScreen = () => {
    return (
        <div className="flex h-full min-h-0 flex-1 flex-col">
            <ChatInfoModal />
            <ChatWindow />
        </div>
    );
};

export default ChatScreen;
