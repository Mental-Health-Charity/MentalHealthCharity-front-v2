import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User as UserIcon } from "lucide-react";
import { User } from "../../../auth/types";
import { translatedRoles } from "../../../users/constants";

interface Props {
    user: User;
}

const ArticleAuthor = ({ user }: Props) => {
    return (
        <a
            href={`/profile/${user.id}`}
            className="bg-paper flex items-center gap-2.5 rounded-lg p-2 text-left no-underline transition-opacity hover:opacity-80"
        >
            <Avatar className="size-[55px] rounded-[10px] shadow-md">
                <AvatarImage src={user.chat_avatar_url} alt={user.full_name} />
                <AvatarFallback className="rounded-[10px]">
                    <UserIcon className="size-5" />
                </AvatarFallback>
            </Avatar>
            <div>
                <p className="text-dark min-w-[200px] text-xl font-semibold">{user.full_name}</p>
                <p className="font-semibold">{translatedRoles[user.user_role]}</p>
            </div>
        </a>
    );
};

export default ArticleAuthor;
