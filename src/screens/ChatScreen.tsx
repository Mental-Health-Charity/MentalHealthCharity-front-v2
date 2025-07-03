import { useState } from "react";
import bgImage from "../assets/static/admin_panel_bg.svg";
import ChatWindow from "../modules/chat/components/ChatWindow";
import Container from "../modules/shared/components/Container";

const ChatScreen = () => {
    const [bg, setBg] = useState(bgImage);

    const handleChangeBackground = (newBg: string) => {
        setBg(newBg);
        localStorage.setItem("chatBg", newBg);
    };

    return (
        <Container
            parentProps={{
                sx: {
                    backgroundImage: `url(${bg})`,
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                },
            }}
        >
            <ChatWindow onChangeWallpaper={handleChangeBackground} />
        </Container>
    );
};

export default ChatScreen;
