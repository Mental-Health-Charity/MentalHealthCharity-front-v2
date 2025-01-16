import bgImage from '../assets/static/admin_panel_bg.svg';
import ChatWindow from '../modules/chat/components/ChatWindow';
import Container from '../modules/shared/components/Container';

const ChatScreen = () => {
    return (
        <Container
            sx={{
                backgroundImage: `url(${bgImage})`,
                backgroundPosition: 'center',
                backgroundSize: '100%',
            }}
        >
            <ChatWindow />
        </Container>
    );
};

export default ChatScreen;
