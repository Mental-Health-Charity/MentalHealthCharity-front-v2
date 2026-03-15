import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User as UserIcon, X } from "lucide-react";
import formatDate from "../../../shared/helpers/formatDate";
import { translatedRoles } from "../../../users/constants";
import { Chat } from "../../types";

interface Props {
    chat: Chat;
    onClose: () => void;
}

const ChatDetails = ({ chat, onClose }: Props) => {
    return (
        <div className="bg-background shadow-box flex h-fit min-w-[300px] flex-col justify-center rounded-lg p-4">
            <div className="flex w-full items-center justify-between gap-4">
                <h3 className="bg-dark text-bg-brand w-fit min-w-[130px] rounded-lg px-4 py-1 text-xl font-semibold">
                    {chat.name}
                </h3>
                <button onClick={onClose} className="bg-danger-brand text-bg-brand rounded-sm p-0.5">
                    <X className="size-5" />
                </button>
            </div>
            <h4 className="text-text-body w-full text-start text-xl font-semibold">
                Uczestnicy ({chat.participants.length})
            </h4>
            <ul className="mt-2 flex flex-col gap-1">
                {chat.participants.map((participant) => (
                    <li key={participant.id} className="hover:bg-muted flex items-center gap-4 rounded-md px-1.5 py-1">
                        <Avatar className="rounded-md">
                            <AvatarImage src={participant.chat_avatar_url} alt={participant.full_name} />
                            <AvatarFallback className="rounded-md">
                                <UserIcon className="size-4" />
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-text-body">{participant.full_name}</p>
                            <p className="text-text-body">{translatedRoles[participant.user_role]}</p>
                        </div>
                    </li>
                ))}
            </ul>
            <h4 className="text-text-body mt-4 w-full text-start text-xl font-semibold">Utworzony w dniu</h4>
            <p className="text-text-body">{formatDate(chat.creation_date)}</p>
        </div>
    );
};

export default ChatDetails;
