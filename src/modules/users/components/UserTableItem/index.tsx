import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { t } from "i18next";
import { Copy, Download, MessageSquare, Pencil, User } from "lucide-react";
import toast from "react-hot-toast";
import { User as UserType } from "../../../auth/types";
import ActionMenu from "../../../shared/components/ActionMenu";
import { downloadFile } from "../../../shared/helpers/downloadFile";
import { ComponentAction } from "../../../shared/types";
import { Roles, translatedRoles } from "../../constants";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    user: UserType;
    onEdit: (user: UserType) => void;
    additionalActions?: ComponentAction[];
}

const UserTableItem = ({ onEdit, user, additionalActions, className, ...props }: Props) => {
    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success(t("common.copied_to_clipboard"));
    };

    return (
        <div
            className={cn(
                "border-border-brand bg-paper flex flex-wrap items-center justify-between rounded-lg border-2 p-4",
                className
            )}
            {...props}
        >
            <div className="flex items-center gap-4">
                <Avatar className="size-[50px] rounded-md">
                    <AvatarImage src={user.chat_avatar_url || undefined} alt={user.full_name} />
                    <AvatarFallback className="rounded-md">{user.full_name?.charAt(0)?.toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="text-muted-foreground text-lg font-semibold">
                        {user.full_name} ({user.id})
                    </p>
                    <button
                        onClick={() => handleCopy(user.email)}
                        className="text-muted-foreground flex items-center gap-2.5 border-none bg-transparent p-0 text-sm hover:underline"
                    >
                        {user.email}
                        <Copy className="size-3.5" />
                    </button>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <Badge variant={user.is_assigned_to_chat ? "secondary" : "outline"}>
                    {user.is_assigned_to_chat ? t("users.is_assigned_to_chat") : t("users.is_not_assigned_to_chat")}
                </Badge>
                <Badge variant={user.user_role === Roles.USER ? "secondary" : "destructive"}>
                    {translatedRoles[user.user_role]}
                </Badge>

                <ActionMenu
                    actions={[
                        {
                            id: "edit",
                            label: t("common.edit"),
                            onClick: () => onEdit(user),
                            icon: <Pencil className="size-4" />,
                        },
                        {
                            id: "go_to_profile",
                            label: t("common.go_to_profile"),
                            href: `/profile/${user?.id}`,
                            icon: <User className="size-4" />,
                        },
                        {
                            id: "connected_chats_to_user",
                            label: t("common.check_connected_chats"),
                            href: `/admin/chats/?search=${user?.email}`,
                            icon: <MessageSquare className="size-4" />,
                        },
                        {
                            id: "download",
                            label: t("common.download"),
                            onClick: () => {
                                downloadFile(user, user.full_name + ".json", "application/json");
                            },
                            variant: "divider",
                            icon: <Download className="size-4" />,
                        },
                        ...(additionalActions || []),
                    ]}
                />
            </div>
        </div>
    );
};

export default UserTableItem;
