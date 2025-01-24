import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import { url } from '../../../api';

const useUnreadMessages = () => {
    const [unreadChats, setUnreadChats] = useState<Record<number, number>>({});
    const token = Cookies.get('token');

    const { lastMessage: unreadMessages } = useWebSocket(token ? url.chat.connectUnreadMessages({ token }) : null);

    useEffect(() => {
        if (unreadMessages !== null) {
            const parsedMessage = JSON.parse(unreadMessages.data);
            setUnreadChats(parsedMessage.unread_chats);
        }
    }, [unreadMessages]);

    return { unreadChats };
};

export default useUnreadMessages;
