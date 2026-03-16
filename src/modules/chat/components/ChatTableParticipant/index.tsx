import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trash2, User as UserIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { User } from "../../../auth/types";
import ActionMenu from "../../../shared/components/ActionMenu";

interface Props {
    participant: User;
}

const ChatTableParticipant = ({ participant }: Props) => {
    const { t } = useTranslation();

    return (
        <div className="flex w-full items-center justify-between gap-2">
            <div className="flex items-center gap-4">
                <Avatar className="rounded-md">
                    <AvatarImage src={participant.chat_avatar_url} />
                    <AvatarFallback className="rounded-md">
                        <UserIcon className="size-4" />
                    </AvatarFallback>
                </Avatar>
                <div>
                    <p className="text-foreground">{participant.full_name}</p>
                    <p className="text-foreground">{participant.email}</p>
                </div>
            </div>
            <ActionMenu
                actions={[
                    {
                        id: "remove",
                        disabled: true,
                        label: t("common.remove"),
                        onClick: () => {},
                        icon: <Trash2 className="size-4" />,
                    },
                    {
                        id: "go_to_profile",
                        label: t("common.go_to_profile"),
                        href: `/profile/${participant.id}`,
                        icon: <UserIcon className="size-4" />,
                    },
                ]}
            />
        </div>
    );
};

export default ChatTableParticipant;
