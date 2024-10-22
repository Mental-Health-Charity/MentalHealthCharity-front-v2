import {
  Box,
  IconButton,
  List,
  TextField,
  Tooltip,
  useTheme,
} from "@mui/material";
import Logo from "../../../../assets/static/logo_small.webp";
import ChatItem from "../ChatItem";
import Chat from "../Chat";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getChatsQueryOptions } from "../../queries/getChatsQueryOptions";
import ReportIcon from "@mui/icons-material/Report";
import EventNoteIcon from "@mui/icons-material/EventNote";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import { useTranslation } from "react-i18next";
import useChat from "../../hooks/useChat";
import { useEffect, useState } from "react";
import ChatDetails from "../ChatDetails";
import Note from "../Note";
import ReportModal from "../../../report/components/ReportModal";

const ChatWindow = () => {
  const theme = useTheme();
  const { id } = useParams<{ id: string }>();
  const { data } = useQuery(getChatsQueryOptions({ size: 50, page: 1 }));
  const [showDetails, setShowDetails] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const { t } = useTranslation();
  const [chatId, setChatId] = useState(id || (data && data.items[0].id) || "");

  const { messages, connectionStatus, send, selectedChat } = useChat(
    Number(chatId)
  );

  const handleChangeChat = (id: string) => {
    setShowNote(false);
    setChatId(id);
  };

  useEffect(() => {
    if (!chatId && data) {
      setChatId(data.items[0].id);
    }
  }, [data, chatId]);

  return (
    <>
      {" "}
      {showNote && selectedChat && (
        <Note
          key={selectedChat.id}
          onClose={() => setShowNote(false)}
          chat={selectedChat}
        />
      )}
      <Box
        sx={{
          backgroundColor: theme.palette.colors.dark,
          display: "flex",
          gap: "15px",
          padding: "15px",
          borderRadius: "10px",
        }}
      >
        {/* sidebar dark */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
          }}
        >
          <Box
            sx={{
              backgroundColor: theme.palette.background.default,
              borderRadius: "8px",
              boxShadow: `0 0 10px 5px ${theme.palette.shadows.box}`,
              width: "55px",
              height: "55px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img src={Logo} alt="logo" width={45} height={41} />
          </Box>

          <Tooltip title={t("chat.notes")}>
            <IconButton
              onClick={() => setShowNote(!showNote)}
              sx={{
                color: theme.palette.text.primary,
              }}
            >
              <EventNoteIcon fontSize="large" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t("chat.contract")}>
            <IconButton
              sx={{
                color: theme.palette.text.primary,
              }}
            >
              <HistoryEduIcon fontSize="large" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t("chat.report")}>
            <IconButton
              sx={{
                color: theme.palette.text.primary,
              }}
              onClick={() => setShowReportModal(!showReportModal)}
            >
              <ReportIcon fontSize="large" />
            </IconButton>
          </Tooltip>
        </Box>
        <Box
          sx={{
            backgroundColor: theme.palette.background.default,
            borderRadius: "8px",
          }}
        >
          {/* sidebar light */}
          <Box
            sx={{
              width: "350px",
              padding: "10px",
            }}
          >
            <Box
              sx={{
                paddingBottom: "15px",
              }}
            >
              <TextField
                fullWidth
                label={t("common.search")}
                variant="filled"
                sx={{
                  color: theme.palette.text.primary,
                }}
              />
            </Box>
            <List
              style={{
                maxHeight: "75vh",
                minHeight: "500px",
                overflow: "auto",
              }}
            >
              {data &&
                data.items.map((chat) => (
                  <ChatItem
                    onChange={(id) => handleChangeChat(id)}
                    selected={!!selectedChat && chat.id === selectedChat.id}
                    chat={chat}
                    key={chat.id}
                  />
                ))}
            </List>
          </Box>
        </Box>
        <Box
          sx={{
            width: "100%",
          }}
        >
          <Chat
            status={connectionStatus}
            messages={messages}
            onSendMessage={send}
            chat={selectedChat}
            onShowDetails={() => setShowDetails(true)}
          />
        </Box>
        {showDetails && selectedChat && (
          <ChatDetails
            onClose={() => setShowDetails(false)}
            chat={selectedChat}
          />
        )}
        {showReportModal && (
          <ReportModal
            open={showReportModal}
            onClose={() => setShowReportModal(false)}
          />
        )}
      </Box>
    </>
  );
};

export default ChatWindow;
