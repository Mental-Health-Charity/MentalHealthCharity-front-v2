import { Box, Avatar, Typography } from "@mui/material";
import { User } from "../../../auth/types";
import ActionMenu from "../../../shared/components/ActionMenu";
import { useTranslation } from "react-i18next";
import Person2Icon from "@mui/icons-material/Person2";
import DeleteIcon from "@mui/icons-material/Delete";

interface Props {
    participant: User;
}

const ChatTableParticipant = ({ participant }: Props) => {
    const { t } = useTranslation();

    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            gap={1}
            key={participant.id}
            sx={{
                width: "100%",
            }}
        >
            <Box display="flex" gap={2} alignItems="center">
                <Avatar variant="rounded" src={participant.chat_avatar_url} />
                <Box>
                    <Typography>{participant.full_name}</Typography>
                    <Typography>{participant.email}</Typography>
                </Box>
            </Box>
            <ActionMenu
                actions={[
                    {
                        id: "remove",
                        disabled: true,
                        label: t("common.remove"),
                        onClick: () => {},
                        icon: <DeleteIcon />,
                    },
                    {
                        id: "go_to_profile",
                        label: t("common.go_to_profile"),
                        href: `/profile/${participant.id}`,
                        icon: <Person2Icon />,
                    },
                ]}
            />
        </Box>
    );
};

export default ChatTableParticipant;
