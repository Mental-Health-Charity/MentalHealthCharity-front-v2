import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User as UserIcon } from "lucide-react";
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
        <div className="flex w-full items-center gap-5">
            <Avatar className="rounded-md">
                <AvatarImage src={user.chat_avatar_url} alt={user.full_name} />
                <AvatarFallback className="rounded-md">
                    <UserIcon className="size-4" />
                </AvatarFallback>
            </Avatar>
            <p>{user.full_name}</p>
            <p>{translatedRoles[user.user_role]}</p>
            <p>{user.email}</p>
            <p>{user.is_assigned_to_chat ? t("common.yes") : t("common.no")}</p>
            <p>{user.id}</p>
        </div>
    );
};

export default UserListRow;
