import { Avatar, Box, Button, Typography, useTheme } from "@mui/material";
import { User } from "../../../auth/types";
import { translatedRoles } from "../../../users/constants";

interface Props {
    user: User;
}

const ArticleAuthor = ({ user }: Props) => {
    const theme = useTheme();
    return (
        <Button
            sx={{
                backgroundColor: theme.palette.background.paper,
                borderRadius: "8px",
                padding: "8px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                textAlign: "left",
            }}
            href={`/profile/${user.id}`}
        >
            <Avatar
                variant="rounded"
                src={user.chat_avatar_url}
                alt={user.full_name}
                sx={{
                    boxShadow: `0 0 5px 2px rgba(0,0,0,0.1)`,
                    width: "55px",
                    height: "55px",
                    borderRadius: "10px",
                }}
            />
            <Box>
                <Typography color="text.secondary" fontSize={20} fontWeight={600} minWidth={200}>
                    {user.full_name}
                </Typography>
                <Typography fontWeight={600}>{translatedRoles[user.user_role]}</Typography>
            </Box>
        </Button>
    );
};

export default ArticleAuthor;
