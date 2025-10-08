import { styled } from "@mui/material";

interface StyledMessageWrapperProps {
    senderIsUser: boolean;
}

export const StyledMessageWrapper = styled("div")<StyledMessageWrapperProps>(({ senderIsUser }) => ({
    display: "flex",
    gap: "10px",
    width: "100%",
    flexDirection: senderIsUser ? "row-reverse" : "row",
    alignItems: "center",

    ".message-actions": {
        visibility: "hidden",
    },

    // on hover show message-actions
    "&:hover .message-actions": {
        visibility: "visible",
    },
}));
