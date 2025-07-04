import { Avatar, Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { User } from "../../../auth/types";
import { ComponentAction } from "../../../shared/types";
import { translatedRoles } from "../../constants";

interface Props {
    user: User;
    actions?: ComponentAction[];
}

const UserListRow = ({ user }: Props) => {
    const { t } = useTranslation();
    return (
        <Box
            sx={{
                width: "100%",
                display: "flex",
                gap: "20px",
            }}
        >
            <Avatar variant="rounded" src={user.chat_avatar_url} alt={user.full_name} />
            <Typography>{user.full_name}</Typography>
            <Typography>{translatedRoles[user.user_role]}</Typography>
            <Typography>{user.email}</Typography>
            <Typography>{user.is_assigned_to_chat ? t("common.yes") : t("common.no")}</Typography>
            <Typography>{user.id}</Typography>
        </Box>
    );
};

export default UserListRow;
